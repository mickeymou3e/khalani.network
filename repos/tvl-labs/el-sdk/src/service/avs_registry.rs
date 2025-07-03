use anyhow::Result;
use ethers::core::types::{Bytes, U256};
use ethers::providers::{Provider, Ws};
use url::Url;

use std::collections::{BTreeMap, HashMap};
use std::sync::Arc;

use crate::{
    bls::{u256_to_bigint256, G1Point as BlsG1Point},
    client::ElClient,
    contract::operator_state_retriever::Operator,
    service::operator_info::OperatorInfoServiceInMemory,
    types::{OperatorAvsState, OperatorInfo, OperatorPubKeys, QuorumAvsState},
};

pub struct AvsRegistryServiceChainCaller {
    client: Arc<ElClient>,
    operator_info: OperatorInfoServiceInMemory,
}

impl AvsRegistryServiceChainCaller {
    pub async fn new(client: Arc<ElClient>, ws_url: Url) -> Self {
        Self {
            client: Arc::clone(&client),
            operator_info: OperatorInfoServiceInMemory::new(
                client,
                Arc::new(Provider::new(Ws::connect(ws_url).await.unwrap())),
            )
            .await,
        }
    }

    async fn get_operators_stake_in_quorums_at_block(
        &self,
        block_num: u32,
        quorum_nums: Bytes,
    ) -> Result<Vec<Vec<Operator>>> {
        let operator_state_retriever = self.client.operator_state_retriever_contract();
        let res = operator_state_retriever
            .get_operator_state(
                self.client.registry_coordinator_addr,
                quorum_nums,
                block_num,
            )
            .call()
            .await?;
        Ok(res)
    }

    pub async fn get_operators_avs_state_at_block(
        &self,
        block_num: u32,
        quorum_nums: Bytes,
    ) -> Result<HashMap<[u8; 32], OperatorAvsState>> {
        let mut operators_avs_state: HashMap<[u8; 32], OperatorAvsState> = HashMap::new();

        let operator_state_retriever = self.client.operator_state_retriever_contract();
        let operators_stakes_in_quorums = operator_state_retriever
            .get_operator_state(
                self.client.registry_coordinator_addr,
                quorum_nums.clone(),
                block_num,
            )
            .call()
            .await?;

        for (quorum_id, quorum_num) in quorum_nums.iter().enumerate() {
            for operator in &operators_stakes_in_quorums[quorum_id] {
                let info = self.get_operator_info(operator.operator_id).await?;
                let stake_per_quorum = BTreeMap::new();
                let avs_state = operators_avs_state
                    .entry(operator.operator_id)
                    .or_insert_with(|| OperatorAvsState {
                        operator_id: operator.operator_id,
                        operator_info: OperatorInfo { pub_keys: info },
                        stake_per_quorum: stake_per_quorum,
                        block_num: block_num.into(),
                    });
                avs_state
                    .stake_per_quorum
                    .insert(*quorum_num, U256::from(operator.stake));
            }
        }

        Ok(operators_avs_state)
    }

    pub async fn get_quorums_avs_state_at_block(
        &self,
        quorum_nums: Bytes,
        block_num: u32,
    ) -> Result<HashMap<u8, QuorumAvsState>> {
        let operators_avs_state = self
            .get_operators_avs_state_at_block(block_num, quorum_nums.clone())
            .await?;

        let mut quorums_avs_state: HashMap<u8, QuorumAvsState> = HashMap::new();

        for quorum_num in quorum_nums.iter() {
            let mut pub_key_g1 = BlsG1Point::new(
                u256_to_bigint256(U256::from(0)),
                u256_to_bigint256(U256::from(0)),
            );
            let mut total_stake: U256 = U256::from(0);
            for (_k, operator) in &operators_avs_state {
                if !operator.stake_per_quorum[quorum_num].is_zero() {
                    if let Some(pubkeys) = &operator.operator_info.pub_keys {
                        let g1_point = BlsG1Point::new(
                            u256_to_bigint256(pubkeys.g1_pub_key.x),
                            u256_to_bigint256(pubkeys.g1_pub_key.y),
                        );
                        pub_key_g1.add(g1_point);
                        total_stake += operator.stake_per_quorum[quorum_num];
                    }
                }
            }
            quorums_avs_state.insert(
                *quorum_num,
                QuorumAvsState {
                    quorum_num: *quorum_num,
                    total_stake,
                    agg_pub_key_g1: pub_key_g1,
                    block_num,
                },
            );
        }

        Ok(quorums_avs_state)
    }

    pub async fn get_operator_info(
        &self,
        operator_id: [u8; 32],
    ) -> Result<Option<OperatorPubKeys>> {
        let registry_coordinator = self.client.registry_coordinator_contract();
        let operator_addr = registry_coordinator
            .get_operator_from_id(operator_id)
            .call()
            .await?;

        Ok(self.operator_info.get_operator_info(operator_addr).await)
    }
}
