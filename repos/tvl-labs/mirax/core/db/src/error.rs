use std::sync::PoisonError;

use mirax_error::impl_into_mirax_error;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DBError {
    #[error("Rocks error: {0}")]
    RocksDBError(#[from] rocksdb::Error),

    #[error("Mem error: {0}")]
    MemError(String),
}

impl<T> From<PoisonError<T>> for DBError {
    fn from(err: PoisonError<T>) -> Self {
        DBError::MemError(err.to_string())
    }
}

impl_into_mirax_error!(DBError, DB);
