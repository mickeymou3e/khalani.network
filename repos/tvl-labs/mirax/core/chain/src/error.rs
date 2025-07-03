use mirax_types::U16;
use mirax_version::Version;
use smol_str::SmolStr;
use thiserror::Error;

use mirax_error::impl_into_mirax_error;

#[derive(Error, Debug)]
pub enum ChainError {
    #[error("Chain Version Mismatch: Spec {0}, Current {1}")]
    VersionMismatch(U16, U16),

    #[error("Binary Incompatible {0}")]
    BinaryIncompatible(Version),

    #[error("Storage Error {0}")]
    Storage(SmolStr),
}

impl_into_mirax_error!(ChainError, Chain);
