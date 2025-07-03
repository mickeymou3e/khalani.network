use libp2p::{
    core::{peer_record::FromEnvelopeError, signed_envelope::DecodingError},
    identity::SigningError,
};
use smol_str::SmolStr;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DiscoveryError {
    #[error(transparent)]
    Signing(#[from] SigningError),
    #[error(transparent)]
    Decoding(#[from] DecodingError),
    #[error(transparent)]
    FromEnvelop(#[from] FromEnvelopeError),
    #[error("Codec: {0}")]
    CodecError(SmolStr),
}
