mod error;
pub mod traits;
mod verify;

pub use alloy_primitives::{U128, U16, U256, U32, U512, U64, U8};
pub use bytes::{buf, Buf, BufMut, BytesMut};
pub use verify::{Cycle, VerifyResult};

use std::{borrow::Cow, str::FromStr};

use alloy_primitives::FixedBytes;
use derive_more::{Deref, Display};
use faster_hex::{hex_string, withpfx_lowercase};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use zeroize::Zeroizing;

use crate::error::PrimitiveError;

pub const HEX_PREFIX: &str = "0x";

/// The mirax result type.
pub type MiraxResult<T> = std::result::Result<T, mirax_error::MiraxError>;
/// The block number type.
pub type BlockNumber = u64;

/// The 4 bytes fixed-length binary data.
pub type H32 = FixedBytes<4>;
/// The 8 bytes fixed-length binary data.
pub type H64 = FixedBytes<8>;
/// The 16 bytes fixed-length binary data.
pub type H128 = FixedBytes<16>;
/// The 20 bytes fixed-length binary data.
pub type H160 = FixedBytes<20>;
/// The 28 bytes fixed-length binary data.
pub type Byte28 = FixedBytes<28>;
/// The 32 bytes fixed-length binary data.
pub type H256 = FixedBytes<32>;
/// The 32 bytes fixed-length binary data.
pub type Byte32 = FixedBytes<32>;
/// The 36 bytes fixed-length binary data.
pub type Byte36 = FixedBytes<36>;
/// The 64 bytes fixed-length binary data.
pub type H512 = FixedBytes<64>;
/// The 64 bytes fixed-length binary data.
pub type Byte64 = FixedBytes<64>;

pub type K256Bits = Zeroizing<[u8; 32]>;

/// Bytes object that display in hexadecimal format.
#[derive(Clone, Debug, Display, Deref, Default, Hash, PartialEq, Eq)]
#[display("0x{:x}", _0)]
pub struct Bytes(bytes::Bytes);

impl Serialize for Bytes {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        if serializer.is_human_readable() {
            withpfx_lowercase::serialize(&self.0, serializer)
        } else {
            serializer.serialize_bytes(&self.0)
        }
    }
}

impl<'de> Deserialize<'de> for Bytes {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        if deserializer.is_human_readable() {
            let s = <Cow<str>>::deserialize(deserializer)?;
            Ok(Self::decode_hex(&s).map_err(serde::de::Error::custom)?)
        } else {
            let bytes = <Vec<u8>>::deserialize(deserializer)?;
            Ok(Self(bytes.into()))
        }
    }
}

impl Bytes {
    pub fn new() -> Self {
        Default::default()
    }

    /// Create an empty `Bytes`.
    pub fn empty() -> Self {
        Self::default()
    }

    /// Create a `HexBytes` with the given length.
    pub fn with_length(len: usize) -> Self {
        Self(vec![0u8; len].into())
    }

    /// Returns `true` if `self` has a length of zero bytes.
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    /// Returns the length of `self`.
    pub fn len(&self) -> usize {
        self.0.len()
    }

    /// Encode `self` to a hexadecimal string.
    pub fn as_string(&self) -> String {
        HEX_PREFIX.to_string() + &hex_string(&self.0)
    }

    /// Encode `self` to a hexadecimal string without the prefix.
    pub fn as_string_trim0x(&self) -> String {
        hex_string(&self.0)
    }

    pub fn to_vec(&self) -> Vec<u8> {
        self.0.to_vec()
    }

    pub fn encode_hex(&self) -> String {
        HEX_PREFIX.to_string() + &hex_string(&self.0)
    }

    pub fn decode_hex(input: &str) -> MiraxResult<Self> {
        if let Some(buf) = input.strip_prefix(HEX_PREFIX) {
            Ok(Self(
                hex_decode(buf).map_err(PrimitiveError::HexDecode)?.into(),
            ))
        } else {
            Err(PrimitiveError::MissingHexPrefix.into())
        }
    }
}

impl AsRef<[u8]> for Bytes {
    #[inline]
    fn as_ref(&self) -> &[u8] {
        &self.0
    }
}

impl<'a> IntoIterator for &'a Bytes {
    type Item = &'a u8;
    type IntoIter = core::slice::Iter<'a, u8>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.iter()
    }
}

impl IntoIterator for Bytes {
    type Item = u8;
    type IntoIter = buf::IntoIter<bytes::Bytes>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl FromIterator<u8> for Bytes {
    fn from_iter<T: IntoIterator<Item = u8>>(into_iter: T) -> Self {
        Vec::from_iter(into_iter).into()
    }
}

impl From<Vec<u8>> for Bytes {
    fn from(value: Vec<u8>) -> Self {
        Self(value.into())
    }
}

impl From<&[u8]> for Bytes {
    fn from(value: &[u8]) -> Self {
        Self(value.to_vec().into())
    }
}

impl From<Bytes> for Vec<u8> {
    fn from(value: Bytes) -> Self {
        value.to_vec()
    }
}

impl From<&str> for Bytes {
    fn from(value: &str) -> Self {
        Self(value.as_bytes().to_vec().into())
    }
}

impl From<bytes::Bytes> for Bytes {
    fn from(value: bytes::Bytes) -> Self {
        Self(value)
    }
}

impl From<String> for Bytes {
    fn from(s: String) -> Bytes {
        Bytes::from(s.into_bytes())
    }
}

/// The address type
#[derive(
    Serialize,
    Deserialize,
    Default,
    Clone,
    Copy,
    Display,
    Debug,
    Hash,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
)]
#[display("{}", _0)]
pub struct Address(H160);

impl From<H256> for Address {
    fn from(value: H256) -> Self {
        Address(convert_h256_to_h160(value))
    }
}

impl FromStr for Address {
    type Err = PrimitiveError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.len() != Self::STR_LEN {
            return Err(PrimitiveError::InvalidAddressLength(s.len()));
        }

        Ok(Address(H160::from_slice(&hex_decode(s)?)))
    }
}

impl Address {
    const STR_LEN: usize = 42;

    pub const fn new(bytes: [u8; 20]) -> Self {
        Address(H160::new(bytes))
    }

    pub const fn repeat_byte(byte: u8) -> Self {
        Address(H160::repeat_byte(byte))
    }

    pub const fn with_last_byte(byte: u8) -> Self {
        Address(H160::with_last_byte(byte))
    }

    pub fn random() -> Self {
        Address(H160::random())
    }

    pub const fn as_bytes(&self) -> &[u8] {
        self.0.as_slice()
    }
}

/// Extract the **first** 20 bytes from the`H256` as an `H160`.
pub fn convert_h256_to_h160(input: H256) -> H160 {
    H160::from_slice(&input.as_slice()[0..20])
}

fn hex_decode(src: &str) -> Result<Vec<u8>, faster_hex::Error> {
    if src.is_empty() {
        return Ok(Vec::new());
    }

    let src = if src.starts_with("0x") {
        src.split_at(2).1
    } else {
        src
    };

    let src = src.as_bytes();
    let mut ret = vec![0u8; src.len() / 2];
    faster_hex::hex_decode(src, &mut ret)?;

    Ok(ret)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bytes_creation() {
        // Test empty bytes
        let empty = Bytes::empty();
        assert!(empty.is_empty());
        assert_eq!(empty.len(), 0);

        // Test with_length
        let fixed_len = Bytes::with_length(5);
        assert_eq!(fixed_len.len(), 5);
        assert_eq!(fixed_len.to_vec(), vec![0u8; 5]);
    }

    #[test]
    fn test_bytes_from_str() {
        // Test valid hex string
        let bytes = Bytes::decode_hex("0x1234").unwrap();
        assert_eq!(bytes.to_vec(), vec![0x12, 0x34]);

        // Test empty hex string
        let empty = Bytes::decode_hex("0x").unwrap();
        assert!(empty.is_empty());

        // Test invalid cases
        assert!(Bytes::decode_hex("1234").is_err()); // Missing prefix
        assert!(Bytes::decode_hex("0xg234").is_err()); // Invalid hex char
    }

    #[test]
    fn test_bytes_display_and_string_conversion() {
        let bytes = Bytes::decode_hex("0x1234").unwrap();
        assert_eq!(bytes.to_string(), "0x1234");
        assert_eq!(bytes.as_string(), "0x1234");
        assert_eq!(bytes.as_string_trim0x(), "1234");
    }

    #[test]
    fn test_bytes_serialization() {
        let bytes = Bytes::decode_hex("0x1234").unwrap();

        // Test JSON serialization (human readable)
        let json = serde_json::to_string(&bytes).unwrap();
        assert_eq!(json, "\"0x1234\"");

        // Test JSON deserialization
        let deserialized: Bytes = serde_json::from_str(&json).unwrap();
        assert_eq!(bytes, deserialized);
    }

    #[test]
    fn test_bytes_as_ref() {
        let bytes = Bytes::decode_hex("0x1234").unwrap();
        let slice: &[u8] = bytes.as_ref();
        assert_eq!(slice, &[0x12, 0x34]);
    }

    #[test]
    fn test_bytes_equality() {
        let bytes1 = Bytes::decode_hex("0x1234").unwrap();
        let bytes2 = Bytes::decode_hex("0x1234").unwrap();

        assert_eq!(bytes1, bytes2);
    }
}
