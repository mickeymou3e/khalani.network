use mirax_jsonrpc_types::Block;
use mirax_primitive::MiraxResult;
use mirax_types::{BlockNumber, Byte32};

pub trait IndexerSync {
    /// Retrieves the tip of the indexer
    fn tip(&self) -> MiraxResult<Option<(BlockNumber, Byte32)>>;
    /// Appends a new block to the indexer
    fn append(&self, block: &Block) -> MiraxResult<()>;
    /// Get indexer identity
    fn get_identity(&self) -> &str;
}
