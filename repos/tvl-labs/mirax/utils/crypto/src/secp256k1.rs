pub use secp256k1::constants;

use rayon::prelude::*;

use mirax_primitive::{MiraxResult, H256};

use crate::{
    def_ecdsa_private_key, def_ecdsa_public_key, def_ecdsa_signature, error::CryptoError,
    BatchVerify, Signature,
};

/// The secp256k1 recovery signature binary length.
pub const SECP256K1_RECOVERY_SIGNATURE_LENGTH: usize = 65;

def_ecdsa_private_key!(
    Secp256k1PrivateKey,
    secp256k1::SecretKey,
    constants::SECRET_KEY_SIZE,
    Secp256k1PublicKey,
    Secp256k1Signature,
    sign_ecdsa,
    from_slice,
    InvalidPrivateKeyLength
);

def_ecdsa_public_key!(
    Secp256k1PublicKey,
    secp256k1::PublicKey,
    constants::PUBLIC_KEY_SIZE,
    from_slice,
    InvalidPublicKeyLength
);

def_ecdsa_signature!(
    Secp256k1Signature,
    secp256k1::ecdsa::Signature,
    constants::COMPACT_SIGNATURE_SIZE,
    Secp256k1PublicKey,
    from_compact,
    InvalidSignatureLength
);

def_ecdsa_private_key!(
    Secp256k1RecoverablePrivateKey,
    secp256k1::SecretKey,
    constants::SECRET_KEY_SIZE,
    Secp256k1RecoverablePublicKey,
    Secp256k1RecoverableSignature,
    sign_ecdsa_recoverable,
    from_slice,
    InvalidPrivateKeyLength
);

def_ecdsa_public_key!(
    Secp256k1RecoverablePublicKey,
    secp256k1::PublicKey,
    constants::PUBLIC_KEY_SIZE,
    from_slice,
    InvalidPublicKeyLength
);

def_ecdsa_signature!(
    @rec,
    Secp256k1RecoverableSignature,
    secp256k1::ecdsa::RecoverableSignature,
    SECP256K1_RECOVERY_SIGNATURE_LENGTH,
    Secp256k1RecoverablePublicKey,
    from_compact,
    InvalidSignatureLength
);

pub struct Secp256k1BatchVerify;

impl BatchVerify for Secp256k1BatchVerify {
    type PublicKey = Secp256k1PublicKey;

    type Signature = Secp256k1Signature;

    fn verify(
        message: &H256,
        signatures: &[Self::Signature],
        public_keys: &[Self::PublicKey],
    ) -> MiraxResult<()> {
        if signatures.len() != public_keys.len() {
            return Err(CryptoError::BatchVerifyNumberMismatch.into());
        }

        if signatures
            .par_iter()
            .zip(public_keys.par_iter())
            .all(|(sig, pk)| sig.verify(message, pk).is_ok())
        {
            return Ok(());
        }

        Err(CryptoError::BatchVerifySignature.into())
    }
}
