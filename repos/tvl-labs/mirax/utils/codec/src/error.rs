use mirax_error::impl_into_mirax_error;
use thiserror::Error;

/// Encode and decode errors.
#[derive(Clone, Debug, Error)]
pub enum CodecError {
    #[error("Hex decode error: {0}")]
    HexDecode(#[from] faster_hex::Error),

    #[error("Bcs error: {0}")]
    Bcs(#[from] bcs::Error),
}

impl_into_mirax_error!(CodecError, Codec);
