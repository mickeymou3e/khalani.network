use serde::{Deserialize, Serialize};

use mirax_types::{Address, BlockNumber, Byte28, H256};

use crate::error::NarwhalError;

pub type NarwhalResult<T> = std::result::Result<T, NarwhalError>;

pub type TransactionChunkKey = Byte28;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Vote<S> {
    pub tx_chunk_hash: H256,
    pub tx_chunk_number: BlockNumber,
    pub author: Address,
    pub signature: S,
}
