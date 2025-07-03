#[macro_export]
macro_rules! impl_into_address {
    ($pk: ty) => {
        impl From<$pk> for mirax_primitive::Address {
            fn from(pk: $pk) -> Self {
                use mirax_hasher::Digest;
                use $crate::PublicKey;
                mirax_hasher::Blake3Hasher::digest(&pk.as_bytes()).into()
            }
        }
    };
}

#[macro_export]
macro_rules! impl_hash {
    ($type_: ty) => {
        #[allow(unused_imports)]
        impl std::hash::Hash for $type_ {
            fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
                use $crate::{PublicKey, Signature};
                self.as_bytes().hash(state);
            }
        }
    };
}

#[macro_export]
macro_rules! def_ecdsa_private_key {
    ($name: ident, $inner: ty, $sk_len: path, $pk: ident, $sig: ident, $sign_func: ident, $from: ident, $err: ident) => {
        #[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, Eq)]
        pub struct $name($inner);

        $crate::impl_try_from_ref_u8_array!(@map_err, $name, $inner, $sk_len, from_slice, $err);

        impl $crate::PrivateKey for $name {
            type PublicKey = $pk;
            type Signature = $sig;
            fn generate<R: rand::RngCore + rand::CryptoRng>(rng: &mut R) -> Self {
                Self(<$inner>::new(rng))
            }

            fn public_key(&self) -> Self::PublicKey {
                $pk(self.0.public_key(secp256k1::SECP256K1))
            }

            fn sign(&self, msg: &mirax_primitive::H256) -> Self::Signature {
                $sig(
                    secp256k1::SECP256K1
                        .$sign_func(&secp256k1::Message::from_digest(msg.0), &self.0),
                )
            }

            fn as_bytes(&self) -> mirax_primitive::Bytes {
                self.0.secret_bytes().to_vec().into()
            }
        }
    };
}

#[macro_export]
macro_rules! def_ecdsa_public_key {
    ($name: ident, $inner: ty, $pk_len: path, $from: ident, $err: ident) => {
        #[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
        pub struct $name($inner);

        $crate::impl_try_from_ref_u8_array!(@map_err, $name, $inner, $pk_len, from_slice, $err);

        $crate::impl_into_address!($name);
        $crate::impl_hash!($name);

        impl $crate::PublicKey for $name {
            fn as_bytes(&self) -> mirax_primitive::Bytes {
                self.0.serialize().to_vec().into()
            }
        }

        impl $crate::UncompressedPublicKey for $name {
            fn as_bytes_uncompressed(&self) -> mirax_primitive::Bytes {
                self.0.serialize_uncompressed().to_vec().into()
            }
        }
    };
}

#[macro_export]
macro_rules! def_ecdsa_signature {
    ($name: ident, $inner: ty, $sig_len: path, $pk: ident, $from: ident, $err: ident) => {
        #[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, Eq)]
        pub struct $name($inner);

        $crate::impl_try_from_ref_u8_array!(@map_err, $name, $inner, $sig_len, $from, $err);
        $crate::impl_hash!($name);

        impl $crate::Signature for $name {
            type PublicKey = $pk;

            fn verify(
                &self,
                msg: &mirax_primitive::H256,
                public_key: &Self::PublicKey,
            ) -> mirax_primitive::MiraxResult<()> {
                Ok(self
                    .0
                    .verify(&secp256k1::Message::from_digest(msg.0), &public_key.0)
                    .map_err($crate::CryptoError::from)?)
            }

            fn as_bytes(&self) -> mirax_primitive::Bytes {
                self.0.serialize_compact().to_vec().into()
            }
        }
    };

    (@rec, $name: ident, $inner: ty, $sig_len: path, $pk: ident, $from: ident, $err: ident) => {
        #[derive(Clone, Debug, PartialEq, Eq)]
        pub struct $name($inner);

        impl serde::Serialize for $name {
            fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
                let (id, sig) = self.0.serialize_compact();
                let mut buf = mirax_primitive::BytesMut::with_capacity(65);
                buf.extend_from_slice(&sig);
                buf.extend_from_slice(&[i32::from(id) as u8]);
                serializer.serialize_bytes(&buf)
            }
        }

        impl<'de> serde::Deserialize<'de> for $name {
            fn deserialize<D: serde::Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
                let bytes = <Vec<u8>>::deserialize(deserializer)?;
                let mut sig = [0u8; secp256k1::constants::COMPACT_SIGNATURE_SIZE];
                sig.copy_from_slice(&bytes[1..secp256k1::constants::COMPACT_SIGNATURE_SIZE]);
                let id = secp256k1::ecdsa::RecoveryId::try_from(
                    bytes[0] as i32,
                )
                .map_err(serde::de::Error::custom)?;

                Ok($name(
                    <$inner>::from_compact(&sig, id).map_err(serde::de::Error::custom)?,
                ))
            }
        }

        $crate::impl_try_from_ref_u8_array!(@rec, $name, $inner);
        $crate::impl_hash!($name);

        impl $crate::Signature for $name {
            type PublicKey = $pk;

            fn verify(
                &self,
                msg: &mirax_primitive::H256,
                public_key: &Self::PublicKey,
            ) -> mirax_primitive::MiraxResult<()> {
                let pk = self
                    .0
                    .recover(&secp256k1::Message::from_digest(msg.0))
                    .map_err($crate::CryptoError::from)?;

                if pk == public_key.0 {
                    return Ok(());
                }

                Err($crate::CryptoError::InvalidSignature.into())
            }

            fn as_bytes(&self) -> mirax_primitive::Bytes {
                let (id, sig) = self.0.serialize_compact();
                let mut buf = mirax_primitive::BytesMut::with_capacity(65);
                buf.extend_from_slice(&sig);
                buf.extend_from_slice(&[i32::from(id) as u8]);
                buf.freeze().into()
            }
        }
    };
}

#[macro_export]
macro_rules! impl_try_from_ref_u8_array {
    (@rec, $name: ident, $inner: ty) => {
        impl<'a> TryFrom<&'a [u8]> for $name {
            type Error = $crate::CryptoError;

            fn try_from(bytes: &'a [u8]) -> Result<Self, Self::Error> {
                if bytes.len() < SECP256K1_RECOVERY_SIGNATURE_LENGTH {
                    return Err($crate::CryptoError::InvalidSignatureLength);
                }

                let mut key = [0u8; secp256k1::constants::COMPACT_SIGNATURE_SIZE];
                key.copy_from_slice(&bytes[0..secp256k1::constants::COMPACT_SIGNATURE_SIZE]);
                let id = secp256k1::ecdsa::RecoveryId::try_from(
                    bytes[secp256k1::constants::COMPACT_SIGNATURE_SIZE] as i32,
                )
                .map_err($crate::CryptoError::from)?;

                Ok($name(
                    <$inner>::from_compact(&key, id).map_err($crate::CryptoError::from)?,
                ))
            }
        }
    };

    (@map_err, $name: ident, $inner: ty, $len: path, $from: ident, $err: ident) => {
        impl<'a> TryFrom<&'a [u8]> for $name {
            type Error = $crate::CryptoError;

            fn try_from(bytes: &'a [u8]) -> Result<Self, Self::Error> {
                if bytes.len() < $len {
                    return Err($crate::CryptoError::$err);
                }

                let mut key = [0u8; $len];
                key.copy_from_slice(&bytes[0..$len]);
                Ok($name(
                    <$inner>::$from(key.as_ref()).map_err($crate::CryptoError::from)?,
                ))
            }
        }
    };
}
