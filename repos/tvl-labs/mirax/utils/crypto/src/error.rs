use mirax_error::impl_into_mirax_error;
use smol_str::format_smolstr;
use smol_str::SmolStr;
use thiserror::Error;

/// Crypto errors.
#[derive(Debug, Error)]
pub enum CryptoError {
    #[error("Invalid private key length")]
    InvalidPrivateKeyLength,

    #[error("Invalid public key length")]
    InvalidPublicKeyLength,

    #[error("Invalid signature length")]
    InvalidSignatureLength,

    #[error("Invalid recoverable signature")]
    InvalidSignature,

    #[error("BLS error: {0}")]
    Bls(SmolStr),

    #[error("Ed25519 error: {0}")]
    Ed25519(#[from] ed25519_consensus::Error),

    #[error("Secp256k1 error: {0}")]
    Secp256k1(#[from] secp256k1::Error),

    #[error("Batch verify number mismatch")]
    BatchVerifyNumberMismatch,

    #[error("Batch verify signature failed")]
    BatchVerifySignature,
}

impl From<blst::BLST_ERROR> for CryptoError {
    fn from(err: blst::BLST_ERROR) -> Self {
        CryptoError::Bls(format_smolstr!("{:?}", err))
    }
}

impl_into_mirax_error!(CryptoError, Crypto);
