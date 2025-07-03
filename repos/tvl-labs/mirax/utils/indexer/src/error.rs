use jsonrpsee::core::ClientError;
use mirax_error::impl_into_mirax_error;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum IndexerError {
    #[error("Rocksdb error: {0}")]
    Rocksdb(rocksdb::Error),

    #[error("Jsonrpsee error: {0}")]
    Jsonrpc(#[from] ClientError),
}

impl_into_mirax_error!(IndexerError, Indexer);

impl From<rocksdb::Error> for IndexerError {
    fn from(err: rocksdb::Error) -> Self {
        IndexerError::Rocksdb(err)
    }
}
