use std::collections::BTreeMap;
use std::sync::Arc;

use anyhow::{anyhow, Result};
use el_sdk::client::ElClient;
use el_sdk::contract::incredible_squaring_task_manager::NewTaskCreatedFilter;
use el_sdk::service::aggregator::{self, AggregatorService, BlsAggregationServiceResponse};
use ethers::signers::Signer;
use ethers::types::{Bytes, U256};
use ethers::{contract::EthLogDecode, middleware::Middleware, signers::LocalWallet};
use url::Url;

pub const QUORUM_THRESHOLD_NUMERATOR: u32 = 100;
pub const QUORUM_THRESHOLD_DENOMINATOR: u32 = 100;
pub const QUORUM_NUMBERS: Bytes = Bytes::from_static(&[0u8; 1]);

pub struct Aggregator {
    client: Arc<ElClient>,
    ws_url: Url,
    tasks: BTreeMap<u32, NewTaskCreatedFilter>,
    wallet: LocalWallet,
}

impl Aggregator {
    pub fn new(client: Arc<ElClient>, wallet: LocalWallet, ws_url: Url) -> Self {
        Self {
            client,
            wallet,
            ws_url,
            tasks: BTreeMap::new(),
        }
    }

    pub async fn run(mut self) {
        self.send_new_task(U256::one()).await.unwrap();
    }

    pub async fn send_new_task(&mut self, number_to_be_squared: U256) -> Result<()> {
        let new_task = self
            .send_new_task_to_square(
                number_to_be_squared,
                QUORUM_THRESHOLD_NUMERATOR,
                QUORUM_NUMBERS.clone(),
            )
            .await?;
        self.tasks.insert(new_task.task_index, new_task.clone());

        let mut threshold = vec![0u32; new_task.task.2.len()];
        for i in 0..new_task.task.2.len() {
            threshold[i] = new_task.task.3;
        }

        AggregatorService::new(Arc::clone(&self.client), self.ws_url.clone())
            .await
            .initialize_new_task(
                new_task.task_index,
                new_task.task.1,
                new_task.task.2,
                threshold,
            )
            .await?;

        Ok(())
    }

    pub async fn send_new_task_to_square(
        &self,
        number_to_squared: U256,
        quorum_threshold_percentage: u32,
        quorum_numbers: Bytes,
    ) -> Result<NewTaskCreatedFilter> {
        let task_manager = self.client.task_manager_contract();
        let tx = task_manager
            .create_new_task(
                number_to_squared,
                quorum_threshold_percentage,
                quorum_numbers,
            )
            .tx;

        let (tx, sig) = self.client.build_transaction(tx).await?;
        let receipt = self
            .client
            .provider()
            .send_raw_transaction(tx.rlp_signed(&sig))
            .await?
            .await?
            .ok_or(anyhow!("No receipt"))?;

        let ret = NewTaskCreatedFilter::decode_log(&receipt.logs[0].clone().into())?;
        Ok(ret)
    }
}
