use std::time::Duration;

use jsonrpsee::http_client::HttpClient;
use mirax_api::MiraxRpcClient;
use mirax_jsonrpc_types::Block;
use mirax_primitive::MiraxResult;
use mirax_types::BlockNumber;

use crate::error::IndexerError;
use crate::index::{IndexerSync, MiraxIndexer};
use crate::store::{rocks::RocksdbStore, Store};

/// Indexer service
#[derive(Clone)]
pub struct IndexerService {
    indexer: MiraxIndexer<RocksdbStore>,
    client: HttpClient,
    block_time: Duration,
    start_number: BlockNumber,
}

impl IndexerService {
    pub fn new(store_path: &str, url: &str, block_time: u64, start_number: BlockNumber) -> Self {
        let opts = RocksdbStore::default_options();
        let store = RocksdbStore::new(&opts, store_path);

        Self {
            indexer: MiraxIndexer::new(store),
            client: HttpClient::builder().build(url).unwrap(),
            block_time: Duration::from_millis(block_time),
            start_number,
        }
    }

    async fn chain_tip(&self) -> MiraxResult<BlockNumber> {
        let tip = self
            .client
            .get_tip_number()
            .await
            .map_err(IndexerError::from)?;
        Ok(tip)
    }

    async fn get_block(&self, number: BlockNumber) -> MiraxResult<Block> {
        let block = self
            .client
            .get_block_by_number(number)
            .await
            .map_err(IndexerError::from)?
            .unwrap_or_else(|| panic!("block {} not found", number));
        Ok(block)
    }

    pub async fn run(self) -> MiraxResult<()> {
        let mut chain_tip = self.chain_tip().await?;
        let current_number = self.indexer.tip()?.map(|(n, _)| n + 1).unwrap_or_default();
        let mut sync_number = current_number.max(self.start_number);

        assert!(sync_number <= chain_tip);

        loop {
            if sync_number == chain_tip {
                tokio::time::sleep(self.block_time).await;
                chain_tip = self.chain_tip().await?;
                continue;
            }

            let block = self.get_block(sync_number).await?;
            self.indexer.append(&block)?;

            sync_number += 1;
        }
    }
}
