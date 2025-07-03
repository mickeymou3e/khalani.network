use derive_more::Display;
use thiserror::Error;

use mirax_error::impl_into_mirax_error;
use mirax_types::{Byte28, H256};

#[derive(Debug, Error)]
pub enum StorageError {
    #[error("Cannot find {0}")]
    CannotFind(DataType),
}

impl_into_mirax_error!(StorageError, Storage);

#[derive(Clone, Display, Debug)]
pub enum DataType {
    Metadata,
    LatestBlock,
    #[display("Block hash {:?}", _0)]
    BlockHash(H256),
    #[display("Tx hash {:?}", _0)]
    TxHash(H256),
    #[display("Tx batch key {:?}", _0)]
    TxBatchKey(Byte28),
    #[display("Tx chunk key {:?}", _0)]
    TxChunkKey(Byte28),
}
