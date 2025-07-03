use thiserror::Error;

#[derive(Clone, Debug, Error)]
pub enum RelayerError {
    #[error("RocksDB Error {0}")]
    RocksDB(String),

    #[error("SMT Error {0}")]
    SMT(String),
}
