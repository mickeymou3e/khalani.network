use blst::min_pk as bls;
use rand::{CryptoRng, RngCore};
use serde::{Deserialize, Deserializer, Serialize, Serializer};

use mirax_primitive::{Bytes, MiraxResult, H256};

use crate::{
    error::CryptoError, impl_hash, impl_into_address, impl_try_from_ref_u8_array,
    AggregatedPublicKey, AggregatedSignature, PrivateKey, PublicKey, Signature,
};

pub const BLS_PRIVATE_KEY_LENGTH: usize = 32;
pub const BLS_PUBLIC_KEY_LENGTH: usize = 48;
pub const BLS_SIGNATURE_LENGTH: usize = 96;
pub const DST: &str = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RONUL";

#[derive(Clone, Debug)]
pub struct BlsPrivateKey(bls::SecretKey);

impl PartialEq for BlsPrivateKey {
    fn eq(&self, other: &Self) -> bool {
        self.0.to_bytes() == other.0.to_bytes()
    }
}

impl Eq for BlsPrivateKey {}

impl PrivateKey for BlsPrivateKey {
    type PublicKey = BlsPublicKey;

    type Signature = BlsSignature;

    fn generate<R: RngCore + CryptoRng>(_rng: &mut R) -> Self {
        let seed = H256::random().0;
        BlsPrivateKey(bls::SecretKey::key_gen(&seed, &[]).unwrap())
    }

    fn public_key(&self) -> Self::PublicKey {
        BlsPublicKey(self.0.sk_to_pk())
    }

    fn sign(&self, msg: &H256) -> Self::Signature {
        BlsSignature(self.0.sign(msg.as_ref(), DST.as_bytes(), &[]))
    }

    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct BlsPublicKey(bls::PublicKey);

impl_into_address!(BlsPublicKey);
impl_hash!(BlsPublicKey);

impl Serialize for BlsPublicKey {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_bytes(&self.0.to_bytes())
    }
}

impl<'de> Deserialize<'de> for BlsPublicKey {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let bytes = <Vec<u8>>::deserialize(deserializer)?;
        Ok(BlsPublicKey(bls::PublicKey::from_bytes(&bytes).map_err(
            |e| serde::de::Error::custom(format!("{:?}", e)),
        )?))
    }
}

impl PublicKey for BlsPublicKey {
    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct BlsAggregatedPublicKey(bls::PublicKey);

impl AggregatedPublicKey for BlsAggregatedPublicKey {
    type PublicKey = BlsPublicKey;

    fn aggregate(public_keys: Vec<Self::PublicKey>) -> MiraxResult<Self> {
        let aggregated_pk = bls::AggregatePublicKey::aggregate(
            &public_keys.iter().map(|pk| &pk.0).collect::<Vec<_>>(),
            true,
        )
        .map_err(CryptoError::from)?;

        Ok(BlsAggregatedPublicKey(bls::PublicKey::from_aggregate(
            &aggregated_pk,
        )))
    }

    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct BlsSignature(bls::Signature);

impl_hash!(BlsSignature);

impl Serialize for BlsSignature {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_bytes(&self.0.to_bytes())
    }
}

impl<'de> Deserialize<'de> for BlsSignature {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let bytes = <Vec<u8>>::deserialize(deserializer)?;
        Ok(BlsSignature(bls::Signature::from_bytes(&bytes).map_err(
            |e| serde::de::Error::custom(format!("{:?}", e)),
        )?))
    }
}

impl Signature for BlsSignature {
    type PublicKey = BlsPublicKey;

    /// This function SHOULD NOT be called.
    fn verify(&self, _msg: &H256, _public_key: &Self::PublicKey) -> MiraxResult<()> {
        unreachable!()
    }

    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

#[derive(Clone, Debug)]
pub struct BlsAggregatedSignature(bls::Signature);

impl AggregatedSignature for BlsAggregatedSignature {
    type Signature = BlsSignature;

    type AggregatedPublicKey = BlsAggregatedPublicKey;

    fn aggregate(signatures: Vec<Self::Signature>) -> MiraxResult<Self> {
        let aggregated_sig = bls::AggregateSignature::aggregate(
            &signatures.iter().map(|sig| &sig.0).collect::<Vec<_>>(),
            true,
        )
        .map_err(CryptoError::from)?;

        Ok(BlsAggregatedSignature(bls::Signature::from_aggregate(
            &aggregated_sig,
        )))
    }

    fn aggregate_verify(
        &self,
        msg: &H256,
        public_key: Self::AggregatedPublicKey,
    ) -> MiraxResult<()> {
        let res = self.0.fast_aggregate_verify_pre_aggregated(
            true,
            msg.as_ref(),
            DST.as_bytes(),
            &public_key.0,
        );

        if res == blst::BLST_ERROR::BLST_SUCCESS {
            return Ok(());
        }

        Err(CryptoError::from(res).into())
    }

    fn as_bytes(&self) -> Bytes {
        self.0.to_bytes().to_vec().into()
    }
}

impl_try_from_ref_u8_array!(
    @map_err,
    BlsPrivateKey,
    bls::SecretKey,
    BLS_PRIVATE_KEY_LENGTH,
    from_bytes,
    InvalidPrivateKeyLength
);

impl_try_from_ref_u8_array!(
    @map_err,
    BlsPublicKey,
    bls::PublicKey,
    BLS_PUBLIC_KEY_LENGTH,
    from_bytes,
    InvalidPublicKeyLength
);

impl_try_from_ref_u8_array!(
    @map_err,
    BlsAggregatedPublicKey,
    bls::PublicKey,
    BLS_PUBLIC_KEY_LENGTH,
    from_bytes,
    InvalidPublicKeyLength
);

impl_try_from_ref_u8_array!(
    @map_err,
    BlsSignature,
    bls::Signature,
    BLS_SIGNATURE_LENGTH,
    from_bytes,
    InvalidSignatureLength
);

impl_try_from_ref_u8_array!(
    @map_err,
    BlsAggregatedSignature,
    bls::Signature,
    BLS_SIGNATURE_LENGTH,
    from_bytes,
    InvalidSignatureLength
);
