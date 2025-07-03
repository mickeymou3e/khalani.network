use mirax_error::impl_into_mirax_error;
use thiserror::Error;

/// Types errors.
#[derive(Clone, Debug, Error)]
pub enum TypesError {
    #[error("Certificate signature count mismatch: signature length {0}, bitmap count {1}")]
    CertificateSignatureCountMismatch(usize, usize),
}

impl_into_mirax_error!(TypesError, Types);
