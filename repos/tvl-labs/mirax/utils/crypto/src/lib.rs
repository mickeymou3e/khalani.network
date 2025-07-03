pub mod bls;
pub mod ed25519;
mod error;
mod macros;
pub mod secp256k1;
#[cfg(test)]
mod tests;

pub use crate::error::CryptoError;

use std::{fmt::Debug, hash::Hash};

use rand::{CryptoRng, RngCore};
use serde::{de::DeserializeOwned, Serialize};

use mirax_primitive::{Bytes, MiraxResult, H256};

/// The private key trait.
pub trait PrivateKey: for<'a> TryFrom<&'a [u8], Error = CryptoError> + Clone {
    /// The public key type.
    type PublicKey: PublicKey;

    /// The signature type.
    type Signature: Signature;

    /// Generate a new private key.
    fn generate<R: RngCore + CryptoRng>(rng: &mut R) -> Self;

    /// Get the public key.
    fn public_key(&self) -> Self::PublicKey;

    /// Sign a message.
    fn sign(&self, msg: &H256) -> Self::Signature;

    /// Get the private key as bytes.
    fn as_bytes(&self) -> Bytes;
}

/// The public key trait.
pub trait PublicKey:
    for<'a> TryFrom<&'a [u8], Error = CryptoError> + Clone + Send + Sync + Serialize + DeserializeOwned
{
    /// Get the public key as bytes.
    fn as_bytes(&self) -> Bytes;
}

/// The uncompressed public key trait for secp256k1.
pub trait UncompressedPublicKey {
    /// Get the uncompressed public key as bytes.
    fn as_bytes_uncompressed(&self) -> Bytes;
}

/// The aggregated public key trait.
pub trait AggregatedPublicKey: for<'a> TryFrom<&'a [u8], Error = CryptoError> {
    type PublicKey: PublicKey;

    fn aggregate(public_keys: Vec<Self::PublicKey>) -> MiraxResult<Self>;

    /// Get the public key as bytes.
    fn as_bytes(&self) -> Bytes;
}

/// The signature trait.
pub trait Signature:
    for<'a> TryFrom<&'a [u8], Error = CryptoError>
    + Clone
    + Debug
    + Hash
    + Eq
    + Send
    + Sync
    + Serialize
    + DeserializeOwned
{
    /// The public key type.
    type PublicKey: PublicKey;

    /// Verify a message with public key.
    fn verify(&self, msg: &H256, public_key: &Self::PublicKey) -> MiraxResult<()>;

    /// Get the signature as bytes.
    fn as_bytes(&self) -> Bytes;
}

/// The aggregated signature trait.
pub trait AggregatedSignature: for<'a> TryFrom<&'a [u8], Error = CryptoError> {
    /// The individual signature type.
    type Signature: Signature;

    /// The aggregated public key type.
    type AggregatedPublicKey: AggregatedPublicKey;

    /// Aggregate signatures and public keys into a aggregated signature.
    fn aggregate(signatures: Vec<Self::Signature>) -> MiraxResult<Self>;

    /// Verify a message with aggregated public key.
    fn aggregate_verify(
        &self,
        msg: &H256,
        public_key: Self::AggregatedPublicKey,
    ) -> MiraxResult<()>;

    /// Get the aggregated signature as bytes.
    fn as_bytes(&self) -> Bytes;
}

pub trait BatchVerify {
    type Signature: Signature;

    type PublicKey: PublicKey;

    fn verify(
        messages: &H256,
        signatures: &[Self::Signature],
        public_keys: &[Self::PublicKey],
    ) -> MiraxResult<()>;
}
