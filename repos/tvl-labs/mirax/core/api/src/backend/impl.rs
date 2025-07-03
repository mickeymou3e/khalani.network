use std::sync::Arc;

use serde::{de::DeserializeOwned, Serialize};

use mirax_db::traits::{DBRead, DBStartTransaction, DBWrite};
use mirax_mempool::MempoolHandle;
use mirax_storage_traits::ReadOnlyStorage;
use mirax_types::{BlockEnvelope, Header, MiraxResult, Transaction, H256};

use crate::backend::traits::APIBackend;

#[derive(Clone)]
pub struct APIBackendImpl<DB: Clone + DBStartTransaction, Storage: Clone + ReadOnlyStorage> {
    mempool_handle: MempoolHandle<DB>,
    storage: Arc<Storage>,
}

impl<DB, Storage> APIBackendImpl<DB, Storage>
where
    DB: DBRead + DBWrite + DBStartTransaction + Clone + Sync + Send + 'static,
    Storage: ReadOnlyStorage + Clone + 'static,
{
    pub fn new(mempool_handle: MempoolHandle<DB>, storage: Arc<Storage>) -> Self {
        Self {
            mempool_handle,
            storage,
        }
    }
}

impl<DB, Storage> APIBackend for APIBackendImpl<DB, Storage>
where
    DB: DBRead + DBWrite + DBStartTransaction + Clone + Sync + Send + 'static,
    Storage: ReadOnlyStorage + Clone + 'static,
{
    async fn get_transaction(&self, tx_hash: &H256) -> MiraxResult<Option<Transaction>> {
        let opt_wrap_tx = self.storage.get_transaction_by_hash(tx_hash).await?;

        Ok(opt_wrap_tx.map(|wrap_tx| wrap_tx.transaction))
    }

    async fn get_block_header_by_number(&self, block_number: u64) -> MiraxResult<Option<Header>> {
        let ret = self
            .storage
            .get_block_header_by_number(&block_number)
            .await?;
        Ok(ret)
    }

    async fn get_block_by_number<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_number: u64,
    ) -> MiraxResult<Option<BlockEnvelope<S>>> {
        let ret = self.storage.get_block_by_number(&block_number).await?;
        Ok(ret)
    }

    async fn get_block_by_hash<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_hash: &H256,
    ) -> MiraxResult<Option<BlockEnvelope<S>>> {
        let ret = self.storage.get_block_by_hash(block_hash).await?;
        Ok(ret)
    }

    async fn get_tip_block_header(&self) -> MiraxResult<Header> {
        let ret = self.storage.get_latest_block_header().await?;
        Ok(ret)
    }

    async fn insert_transaction(&self, tx: Transaction) -> MiraxResult<H256> {
        self.mempool_handle.insert(tx).await
    }
}
