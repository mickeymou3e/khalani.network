use serde::{de::DeserializeOwned, Serialize};

use mirax_types::{
    BlockEnvelope, Header, MiraxMetadata, MiraxResult, TransactionBatch, WrappedTransaction, H256,
};

/// The read-only storage trait for reading data from the storage.
#[trait_variant::make(Send + Sync)]
pub trait ReadOnlyStorage {
    /// Get the mirax metadata.
    async fn get_metadata(&self) -> MiraxResult<MiraxMetadata>;

    /// Get the latest block.
    async fn get_latest_block_header(&self) -> MiraxResult<Header>;

    /// Get the block by the block number.
    async fn get_block_header_by_number(&self, block_number: &u64) -> MiraxResult<Option<Header>>;

    /// Get the block by the block hash.
    async fn get_block_header_by_hash(&self, block_hash: &H256) -> MiraxResult<Option<Header>>;

    /// Get the block by the block number.
    async fn get_block_by_number<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_number: &u64,
    ) -> MiraxResult<Option<BlockEnvelope<S>>>;

    /// Get the block by the block hash.
    async fn get_block_by_hash<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_hash: &H256,
    ) -> MiraxResult<Option<BlockEnvelope<S>>>;

    /// Get the transaction by the transaction hash.
    async fn get_transaction_by_hash(
        &self,
        tx_hash: &H256,
    ) -> MiraxResult<Option<WrappedTransaction>>;

    /// Get the transactions by the transaction hashes.
    async fn get_transactions(&self, tx_hashes: &[H256]) -> MiraxResult<Vec<WrappedTransaction>>;
}

#[trait_variant::make(Send + Sync)]
pub trait Storage: ReadOnlyStorage {
    /// Update the mirax metadata.
    async fn update_metadata(&self, metadata: &MiraxMetadata) -> MiraxResult<()>;

    /// Insert a transaction batch.
    async fn insert_transaction_batch(&self, tx_batch: TransactionBatch) -> MiraxResult<()>;

    /// Insert transactions.
    async fn insert_transactions(&self, txs: Vec<WrappedTransaction>) -> MiraxResult<()>;

    /// Update the latest block.
    async fn insert_new_block<S: Send + Sync>(&self, block: BlockEnvelope<S>) -> MiraxResult<()>;
}
