use mirax_crypto::Signature;
use mirax_types::{BlockEnvelope, Header, MiraxResult, Transaction, H256};

#[trait_variant::make(Send + Sync)]
pub trait APIBackend: Clone {
    async fn get_transaction(&self, tx_hash: &H256) -> MiraxResult<Option<Transaction>>;

    async fn get_block_header_by_number(&self, block_number: u64) -> MiraxResult<Option<Header>>;

    async fn get_tip_block_header(&self) -> MiraxResult<Header>;

    async fn get_block_by_number<S: Signature>(
        &self,
        block_number: u64,
    ) -> MiraxResult<Option<BlockEnvelope<S>>>;

    async fn get_block_by_hash<S: Signature>(
        &self,
        block_hash: &H256,
    ) -> MiraxResult<Option<BlockEnvelope<S>>>;

    async fn insert_transaction(&self, tx: Transaction) -> MiraxResult<H256>;
}
