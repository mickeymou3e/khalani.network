use std::collections::{BTreeMap, BTreeSet};
use std::sync::Arc;

use anyhow::{anyhow, Result};
use ethers::types::{Bytes, H256, U256};
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio::sync::Mutex;
use url::Url;

use crate::bls::{u256_to_bigint256, G1Point, G2Point, Signature};
use crate::client::ElClient;
use crate::service::avs_registry::AvsRegistryServiceChainCaller;
use crate::types::{QuorumNum, SignedTaskResponseDigest, TaskResponseDigest};

pub struct BlsAggregationServiceResponse {
    pub task_index: u32,
    pub task_hash: H256,
    pub non_signers_pubkeys_g1: Vec<G1Point>,
    pub quorum_apks_g1: Vec<G1Point>,
    pub signers_apk_g2: G2Point,
    pub signers_agg_sig_g1: Signature,
    pub non_signer_quorum_bitmap_indices: Vec<u32>,
    pub quorum_apk_indices: Vec<u32>,
    pub total_stake_indices: Vec<u32>,
    pub non_signer_stake_indices: Vec<u32>,
}

pub struct AggregatedOperator {
    signers_apk_g2: G2Point,
    signers_agg_sig_g1: Signature,
    signers_total_stake_per_quorum: BTreeMap<u8, U256>,
    signers_operator_ids: BTreeMap<H256, bool>,
}

pub struct AggregatorService {
    registry_service: AvsRegistryServiceChainCaller,
    signed_task_index_set: Mutex<BTreeSet<u32>>,
    signed_task_tx: UnboundedSender<SignedTaskResponseDigest>,
    signed_task_rx: UnboundedReceiver<SignedTaskResponseDigest>,
}

impl AggregatorService {
    pub async fn new(client: Arc<ElClient>, ws_url: Url) -> Self {
        let (signed_task_tx, signed_task_rx) = tokio::sync::mpsc::unbounded_channel();
        Self {
            registry_service: AvsRegistryServiceChainCaller::new(client, ws_url).await,
            signed_task_index_set: Mutex::new(BTreeSet::new()),
            signed_task_tx,
            signed_task_rx,
        }
    }

    pub async fn process_new_signature(
        &self,
        task_index: u32,
        task_response_digest: TaskResponseDigest,
        bls_sig: Signature,
        operator_id: H256,
    ) -> Result<()> {
        {
            if self
                .signed_task_index_set
                .lock()
                .await
                .contains(&task_index)
            {
                return Ok(());
            }
        }

        self.signed_task_tx.send(SignedTaskResponseDigest {
            task_index,
            task_response_digest,
            bls_signature: bls_sig,
            operator_id,
        })?;
        Ok(())
    }

    pub async fn initialize_new_task(
        &mut self,
        task_index: u32,
        task_created_block: u32,
        quorum_numbers: Bytes,
        quorum_threshold_percentages: Vec<u32>,
    ) -> Result<BlsAggregationServiceResponse> {
        {
            let mut set = self.signed_task_index_set.lock().await;
            if set.contains(&task_index) {
                return Err(anyhow!("Task already initialized"));
            }

            set.insert(task_index);
        }

        let mut quorum_threshold_percentages_map = BTreeMap::new();
        for (i, quorum_num) in quorum_numbers.iter().enumerate() {
            quorum_threshold_percentages_map.insert(*quorum_num, quorum_threshold_percentages[i]);
        }

        let operator_state = self
            .registry_service
            .get_operators_avs_state_at_block(task_created_block, quorum_numbers.clone())
            .await?;
        let quorum_stake = self
            .registry_service
            .get_quorums_avs_state_at_block(quorum_numbers.clone(), task_created_block)
            .await?;

        let mut total_stake_per_quorum = BTreeMap::new();
        for (q_num, q_state) in quorum_stake.iter() {
            total_stake_per_quorum.insert(*q_num, q_state.total_stake);
        }

        let mut quorum_apks_g1 = Vec::new();
        for quorum_number in quorum_numbers.iter() {
            quorum_apks_g1.push(
                quorum_stake
                    .get(quorum_number)
                    .cloned()
                    .unwrap()
                    .agg_pub_key_g1,
            );
        }

        let mut aggregated_operators = BTreeMap::new();

        while let Some(resp) = self.signed_task_rx.recv().await {
            let state = operator_state.get(&resp.operator_id.0).cloned().unwrap();
            let pubkey = state.operator_info.pub_keys.clone().unwrap().g2_pub_key;

            aggregated_operators
                .entry(resp.operator_id)
                .and_modify(|s: &mut AggregatedOperator| {
                    (*s).signers_agg_sig_g1
                        .add(resp.bls_signature.clone().into());
                    (*s).signers_apk_g2.add(G2Point::new(
                        (
                            u256_to_bigint256(pubkey.x[0]),
                            u256_to_bigint256(pubkey.x[1]),
                        ),
                        (
                            u256_to_bigint256(pubkey.y[0]),
                            u256_to_bigint256(pubkey.y[1]),
                        ),
                    ));
                    (*s).signers_operator_ids.insert(resp.operator_id, true);
                    state
                        .stake_per_quorum
                        .iter()
                        .for_each(|(quorum_num, stake)| {
                            (*s).signers_total_stake_per_quorum
                                .entry(*quorum_num)
                                .and_modify(|t| {
                                    (*t) += *stake;
                                })
                                .or_insert(U256::zero());
                        });
                })
                .or_insert_with(|| AggregatedOperator {
                    signers_apk_g2: G2Point::new_zero().add(G2Point::new(
                        (
                            u256_to_bigint256(pubkey.x[0]),
                            u256_to_bigint256(pubkey.x[1]),
                        ),
                        (
                            u256_to_bigint256(pubkey.y[0]),
                            u256_to_bigint256(pubkey.y[1]),
                        ),
                    )),
                    signers_agg_sig_g1: resp.bls_signature.into(),
                    signers_operator_ids: {
                        let mut map = BTreeMap::new();
                        map.insert(resp.operator_id, true);
                        map
                    },
                    signers_total_stake_per_quorum: state.stake_per_quorum.clone(),
                });

            let aggregated_operator = aggregated_operators.get(&resp.operator_id).unwrap();
            if self.is_stake_meet_threshold(
                &aggregated_operator.signers_total_stake_per_quorum,
                &total_stake_per_quorum,
                &quorum_threshold_percentages_map,
            ) {
                let non_signers_pubkeys_g1 = state
                    .clone()
                    .clone()
                    .stake_per_quorum
                    .iter()
                    .filter(|(quorum_num, _)| {
                        !aggregated_operator
                            .signers_total_stake_per_quorum
                            .contains_key(quorum_num)
                    })
                    .map(|(_, _stake)| {
                        let pubkeys = state.clone().operator_info.pub_keys.unwrap();
                        G1Point::new(
                            u256_to_bigint256(pubkeys.g1_pub_key.x),
                            u256_to_bigint256(pubkeys.g1_pub_key.y),
                        )
                    })
                    .collect();

                let non_signer_quorum_bitmap_indices = state
                    .clone()
                    .stake_per_quorum
                    .iter()
                    .enumerate()
                    .filter(|(i, _)| {
                        !aggregated_operator
                            .signers_total_stake_per_quorum
                            .contains_key(&(*i as u8))
                    })
                    .map(|(i, _)| i as u32)
                    .collect();

                let quorum_apk_indices = quorum_numbers
                    .iter()
                    .enumerate()
                    .filter(|(i, _)| {
                        !aggregated_operator
                            .signers_total_stake_per_quorum
                            .contains_key(&(*i as u8))
                    })
                    .map(|(i, _)| i as u32)
                    .collect();

                let total_stake_indices = state
                    .clone()
                    .stake_per_quorum
                    .iter()
                    .enumerate()
                    .filter(|(i, _)| {
                        !aggregated_operator
                            .signers_total_stake_per_quorum
                            .contains_key(&(*i as u8))
                    })
                    .map(|(i, _)| i as u32)
                    .collect();

                let non_signer_stake_indices = state
                    .clone()
                    .stake_per_quorum
                    .iter()
                    .enumerate()
                    .filter(|(i, _)| {
                        !aggregated_operator
                            .signers_total_stake_per_quorum
                            .contains_key(&(*i as u8))
                    })
                    .map(|(i, _)| i as u32)
                    .collect();

                return Ok(BlsAggregationServiceResponse {
                    task_index,
                    task_hash: resp.task_response_digest,
                    non_signers_pubkeys_g1,
                    quorum_apks_g1: quorum_apks_g1.clone(),
                    signers_apk_g2: aggregated_operator.signers_apk_g2.clone(),
                    signers_agg_sig_g1: aggregated_operator.signers_agg_sig_g1.clone(),
                    non_signer_quorum_bitmap_indices,
                    quorum_apk_indices,
                    total_stake_indices,
                    non_signer_stake_indices,
                });
            }
        }

        Err(anyhow!("No response"))
    }

    fn is_stake_meet_threshold(
        &self,
        signed_stake_per_quorum: &BTreeMap<QuorumNum, U256>,
        total_stake_per_quorum: &BTreeMap<QuorumNum, U256>,
        quorum_threshold_percentages: &BTreeMap<QuorumNum, u32>,
    ) -> bool {
        for (quorum_num, percentage) in quorum_threshold_percentages.iter() {
            let stake_by_quorum = signed_stake_per_quorum.get(quorum_num);
            if stake_by_quorum.is_none() {
                return false;
            }
            let stake_by_quorum = stake_by_quorum.unwrap();

            let total_stake_by_quorum = total_stake_per_quorum.get(quorum_num);
            if total_stake_by_quorum.is_none() {
                return false;
            }
            let total_stake_by_quorum = total_stake_by_quorum.unwrap();

            let signed_stake = stake_by_quorum * 100;
            let threshold_stake = *total_stake_by_quorum * percentage;

            if signed_stake < threshold_stake {
                return false;
            }
        }

        true
    }
}
