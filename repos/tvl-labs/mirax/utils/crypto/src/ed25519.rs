use ed25519_consensus::{
    batch::Verifier as BatchVerifier, Signature as Ed25519Sig, SigningKey, VerificationKey,
};
use rand::{CryptoRng, RngCore};
use serde::{Deserialize, Serialize};

use mirax_primitive::{Bytes, MiraxResult, H256};
use zeroize::Zeroize;

use crate::{
    error::CryptoError, impl_hash, impl_into_address, impl_try_from_ref_u8_array, BatchVerify,
    PrivateKey, PublicKey, Signature,
};

pub const ED25519_PRIVATE_KEY_LENGTH: usize = 32;
pub const ED25519_PUBLIC_KEY_LENGTH: usize = 32;
pub const ED25519_SIGNATURE_LENGTH: usize = 64;

#[derive(Serialize, Deserialize, Zeroize, Clone, Debug)]
pub struct Ed25519PrivateKey(SigningKey);

impl PrivateKey for Ed25519PrivateKey {
    type PublicKey = Ed25519PublicKey;

    type Signature = Ed25519Signature;

    fn generate<R: RngCore + CryptoRng>(rng: &mut R) -> Self {
        Ed25519PrivateKey(SigningKey::new(rng))
    }

    fn public_key(&self) -> Self::PublicKey {
        Ed25519PublicKey(self.0.verification_key())
    }

    fn sign(&self, msg: &H256) -> Self::Signature {
        Ed25519Signature(self.0.sign(msg.as_ref()))
    }

    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct Ed25519PublicKey(VerificationKey);

impl_into_address!(Ed25519PublicKey);
impl_hash!(Ed25519PublicKey);

impl PublicKey for Ed25519PublicKey {
    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Ed25519Signature(Ed25519Sig);

impl_hash!(Ed25519Signature);

impl Signature for Ed25519Signature {
    type PublicKey = Ed25519PublicKey;

    fn verify(&self, msg: &H256, public_key: &Self::PublicKey) -> MiraxResult<()> {
        Ok(public_key
            .0
            .verify(&self.0, msg.as_ref())
            .map_err(CryptoError::from)?)
    }

    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

pub struct Ed25519BatchVerify;

impl BatchVerify for Ed25519BatchVerify {
    type PublicKey = Ed25519PublicKey;

    type Signature = Ed25519Signature;

    fn verify(
        messages: &H256,
        signatures: &[Self::Signature],
        public_keys: &[Self::PublicKey],
    ) -> MiraxResult<()> {
        if signatures.len() != public_keys.len() {
            return Err(CryptoError::BatchVerifyNumberMismatch.into());
        }

        let mut batch = BatchVerifier::new();
        signatures
            .iter()
            .zip(public_keys.iter())
            .for_each(|(sig, pub_key)| {
                batch.queue((pub_key.0.into(), sig.0, &messages));
            });

        Ok(())
    }
}

impl_try_from_ref_u8_array!(
    @map_err,
    Ed25519PrivateKey,
    SigningKey,
    ED25519_PRIVATE_KEY_LENGTH,
    try_from,
    InvalidPrivateKeyLength
);

impl_try_from_ref_u8_array!(
    @map_err,
    Ed25519PublicKey,
    VerificationKey,
    ED25519_PUBLIC_KEY_LENGTH,
    try_from,
    InvalidPublicKeyLength
);

impl_try_from_ref_u8_array!(
    @map_err,
    Ed25519Signature,
    Ed25519Sig,
    ED25519_SIGNATURE_LENGTH,
    try_from,
    InvalidSignatureLength
);
