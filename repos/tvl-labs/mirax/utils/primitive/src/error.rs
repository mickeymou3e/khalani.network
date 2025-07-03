use mirax_error::impl_into_mirax_error;
use thiserror::Error;

/// Primitive errors.
#[derive(Clone, Debug, Error)]
pub enum PrimitiveError {
    #[error("Invalid hex prefix")]
    MissingHexPrefix,

    #[error("Hex decode error: {0}")]
    HexDecode(#[from] faster_hex::Error),

    #[error("Invalid address length: {0}")]
    InvalidAddressLength(usize),
}

impl_into_mirax_error!(PrimitiveError, Primitive);
