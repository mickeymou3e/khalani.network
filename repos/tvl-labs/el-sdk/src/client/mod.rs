use std::sync::Arc;

use anyhow::Result;
use ethers::middleware::Middleware;
use ethers::providers::{Provider, Ws};
use ethers::signers::{LocalWallet, Signer};
use ethers::types::transaction::eip2718::TypedTransaction;
use ethers::types::{
    Address, BlockNumber, Filter, FilterBlockOption, Signature, Topic, ValueOrArray, H256,
};
use serde::Deserialize;
use url::Url;

use crate::contract::bls_apk_registry::bls_apk_registry::{self, NewPubkeyRegistrationFilter};
use crate::contract::incredible_squaring_service_manager::IncredibleSquaringServiceManager;
use crate::contract::incredible_squaring_task_manager::IncredibleSquaringTaskManager;
use crate::contract::operator_state_retriever::OperatorStateRetriever;
use crate::provider::ElProvider;
use crate::types::OperatorPubKeys;
use crate::{contract::registry_coordinator::RegistryCoordinator, provider::ElMiddleware};

pub const NEW_BLS_APK_REGISTRATION_EVENT_SIGNATURE: H256 = H256([
    0xe3, 0xfb, 0x66, 0x13, 0xaf, 0x2e, 0x89, 0x30, 0xcf, 0x85, 0xd4, 0x7f, 0xcf, 0x6d, 0xb1, 0x01,
    0x92, 0x22, 0x4a, 0x64, 0xc6, 0xcb, 0xe8, 0x02, 0x3e, 0x0e, 0xee, 0x1b, 0xa3, 0x82, 0x80, 0x41,
]);

#[derive(Deserialize, Clone, Debug)]
pub struct ElConfig {
    pub eth_http_url: Url,
    pub eth_ws_url: Url,
    pub bls_apk_registry_addr: Address,
    pub operator_registry_addr: Address,
    pub registry_coordinator_addr: Address,
    pub avs_name: String,
    pub from_metrics_ip_port_address: Url,
    pub sender: Address,
    pub private_key: String,
}

#[allow(dead_code)]
#[derive(Clone, Debug)]
pub struct ElClient {
    pub avs_directory_addr: Address,
    pub bls_apk_registry_addr: Address,
    pub delegation_manager_addr: Address,
    pub operator_registry_addr: Address,
    pub registry_coordinator_addr: Address,
    pub slasher_addr: Address,
    pub stake_registry_addr: Address,
    pub strategy_manager_addr: Address,
    pub service_manager_addr: Address,
    pub task_manager_addr: Address,
    avs_name: String,
    from_metrics_ip_port_address: Url,
    wallet: LocalWallet,
    provider: Arc<ElProvider>,
}

impl ElClient {
    pub async fn init(config: ElConfig) -> Result<Self> {
        let provider: Arc<ElProvider> = Arc::new(ElMiddleware::from(config.eth_http_url));

        let service_manager_address =
            RegistryCoordinator::new(config.registry_coordinator_addr, Arc::clone(&provider))
                .service_manager()
                .call()
                .await?;
        let service_manager =
            IncredibleSquaringServiceManager::new(service_manager_address, Arc::clone(&provider));
        let task_manager_address = service_manager
            .incredible_squaring_task_manager()
            .call()
            .await?;

        Ok(ElClient {
            avs_directory_addr: Default::default(),
            bls_apk_registry_addr: Default::default(),
            delegation_manager_addr: Default::default(),
            operator_registry_addr: config.operator_registry_addr,
            registry_coordinator_addr: config.registry_coordinator_addr,
            slasher_addr: Default::default(),
            service_manager_addr: service_manager_address,
            stake_registry_addr: Default::default(),
            strategy_manager_addr: Default::default(),
            task_manager_addr: task_manager_address,
            avs_name: config.avs_name,
            from_metrics_ip_port_address: config.from_metrics_ip_port_address,
            wallet: LocalWallet::from_bytes(&hex::decode(config.private_key)?)?,
            provider,
        })
    }

    pub fn wallet(&self) -> LocalWallet {
        self.wallet.clone()
    }

    pub async fn build_transaction(
        &self,
        mut tx: TypedTransaction,
    ) -> Result<(TypedTransaction, Signature)> {
        let chain_id = self.provider().get_chainid().await?.low_u64();
        let nonce = self
            .provider()
            .get_transaction_count(self.wallet.address(), None)
            .await?
            + 1;
        let gas_price = self.provider().get_gas_price().await?;

        tx.set_chain_id(chain_id)
            .set_gas(200000)
            .set_gas_price(gas_price)
            .set_nonce(nonce);
        let sig = self.wallet.sign_transaction_sync(&tx)?;

        Ok((tx, sig))
    }

    pub fn task_manager_contract(&self) -> IncredibleSquaringTaskManager<ElProvider> {
        IncredibleSquaringTaskManager::new(self.task_manager_addr, Arc::clone(&self.provider))
    }

    pub fn service_manager_contract(&self) -> IncredibleSquaringServiceManager<ElProvider> {
        IncredibleSquaringServiceManager::new(self.service_manager_addr, Arc::clone(&self.provider))
    }

    pub fn operator_state_retriever_contract(&self) -> OperatorStateRetriever<ElProvider> {
        OperatorStateRetriever::new(self.registry_coordinator_addr, Arc::clone(&self.provider))
    }

    pub fn registry_coordinator_contract(&self) -> RegistryCoordinator<ElProvider> {
        RegistryCoordinator::new(self.registry_coordinator_addr, Arc::clone(&self.provider))
    }

    pub fn provider(&self) -> &ElProvider {
        self.provider.as_ref()
    }

    pub async fn query_existing_registered_operator_pub_keys(
        &self,
        start_block: Option<BlockNumber>,
        stop_block: Option<BlockNumber>,
    ) -> Result<(Vec<Address>, Vec<OperatorPubKeys>)> {
        let mut block_option: FilterBlockOption = FilterBlockOption::Range {
            from_block: (start_block),
            to_block: (stop_block),
        };

        if stop_block.is_none() {
            let current_block_number = self.provider.get_block_number().await?;
            block_option = block_option.set_to_block(BlockNumber::Number(current_block_number));
        }

        let query = Filter {
            block_option,
            address: Some(ValueOrArray::Value(self.bls_apk_registry_addr)),
            topics: [
                Some(Topic::Value(Some(NEW_BLS_APK_REGISTRATION_EVENT_SIGNATURE))),
                None,
                None,
                None,
            ],
        };

        let contract_bls_apk_registry = bls_apk_registry::BLSApkRegistry::new(
            self.bls_apk_registry_addr,
            self.provider.clone(),
        );
        let logs = self.provider.get_logs(&query).await?;

        let mut operator_addresses: Vec<Address> = vec![];
        let mut operator_pub_keys: Vec<OperatorPubKeys> = vec![];

        for (i, v_log) in logs.iter().enumerate() {
            let operator_addr = Address::from_slice(&v_log.topics[i].as_bytes()[12..]);
            operator_addresses.push(operator_addr);

            let decoded_event = contract_bls_apk_registry
                .decode_event::<NewPubkeyRegistrationFilter>(
                    "NewPubkeyRegistration",
                    v_log.topics.clone(),
                    v_log.data.clone(),
                )?;
            let g1_pub_key = decoded_event.pubkey_g1;
            let g2_pub_key = decoded_event.pubkey_g2;

            let operator_pub_key = OperatorPubKeys {
                g1_pub_key,
                g2_pub_key,
            };

            operator_pub_keys.push(operator_pub_key);
        }

        Ok((operator_addresses, operator_pub_keys))
    }

    pub async fn get_new_pub_key_registration_filter<'a>(
        &self,
        client: Arc<Provider<Ws>>,
    ) -> Filter {
        let current_block_number = client.get_block_number().await.unwrap();

        let filter = Filter::new()
            .topic0(NEW_BLS_APK_REGISTRATION_EVENT_SIGNATURE)
            .from_block(current_block_number);
        filter
    }
}
