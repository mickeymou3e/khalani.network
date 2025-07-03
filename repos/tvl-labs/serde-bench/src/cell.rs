use crate::{
    borsh_deserialize_bytes, borsh_deserialize_h256, borsh_deserialize_uint, borsh_serialize_bytes,
    borsh_serialize_h256, borsh_serialize_uint, H256,
};

use alloy_primitives::{U32, U64};
use alloy_rlp::{Decodable, Encodable, RlpDecodable, RlpEncodable};
use borsh::{BorshDeserialize, BorshSerialize};
use bytes::Bytes;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq)]
#[borsh(use_discriminant = true)]
pub enum DepType {
    Code = 0,
    DepGroup = 1,
}

impl Encodable for DepType {
    fn encode(&self, out: &mut dyn bytes::BufMut) {
        let value = match self {
            DepType::Code => 0u8,
            DepType::DepGroup => 1u8,
        };
        value.encode(out);
    }
}

impl Decodable for DepType {
    fn decode(buf: &mut &[u8]) -> alloy_rlp::Result<Self> {
        let value: u8 = Decodable::decode(buf)?;
        match value {
            0 => Ok(DepType::Code),
            1 => Ok(DepType::DepGroup),
            _ => Err(alloy_rlp::Error::Custom("Invalid DepType")),
        }
    }
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq)]
#[borsh(use_discriminant = true)]
pub enum ScriptHashType {
    Data = 0,
    Type = 1,
    Data1 = 2,
    Data2 = 4,
}

impl Encodable for ScriptHashType {
    fn encode(&self, out: &mut dyn bytes::BufMut) {
        let value = match self {
            ScriptHashType::Data => 0u8,
            ScriptHashType::Type => 1u8,
            ScriptHashType::Data1 => 2u8,
            ScriptHashType::Data2 => 4u8,
        };
        value.encode(out);
    }
}

impl Decodable for ScriptHashType {
    fn decode(buf: &mut &[u8]) -> alloy_rlp::Result<Self> {
        let value: u8 = Decodable::decode(buf)?;
        match value {
            0 => Ok(ScriptHashType::Data),
            1 => Ok(ScriptHashType::Type),
            2 => Ok(ScriptHashType::Data1),
            4 => Ok(ScriptHashType::Data2),
            _ => Err(alloy_rlp::Error::Custom("Invalid ScriptHashType")),
        }
    }
}

#[derive(
    Serialize,
    Deserialize,
    BorshSerialize,
    BorshDeserialize,
    RlpEncodable,
    RlpDecodable,
    Clone,
    Debug,
    PartialEq,
    Eq,
)]
pub struct OutPoint {
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub tx_hash: H256,
    #[borsh(
        serialize_with = "borsh_serialize_uint",
        deserialize_with = "borsh_deserialize_uint"
    )]
    pub index: U32,
}

impl OutPoint {
    pub const SIZE: usize = 32 + 4;
}

#[derive(
    Serialize,
    Deserialize,
    BorshSerialize,
    BorshDeserialize,
    RlpEncodable,
    RlpDecodable,
    Clone,
    Debug,
    PartialEq,
    Eq,
)]
pub struct CellDep {
    pub out_point: OutPoint,
    pub dep_type: DepType,
}

impl CellDep {
    pub const SIZE: usize = OutPoint::SIZE + 1;

    pub fn mock() -> Self {
        CellDep {
            out_point: OutPoint {
                tx_hash: H256::random(),
                index: U32::ZERO,
            },
            dep_type: DepType::Code,
        }
    }
}

#[derive(
    Serialize,
    Deserialize,
    BorshSerialize,
    BorshDeserialize,
    RlpEncodable,
    RlpDecodable,
    Clone,
    Debug,
    PartialEq,
    Eq,
)]
pub struct CellInput {
    #[borsh(
        serialize_with = "borsh_serialize_uint",
        deserialize_with = "borsh_deserialize_uint"
    )]
    pub since: U64,
    pub previous_output: OutPoint,
}

impl CellInput {
    pub const SIZE: usize = OutPoint::SIZE + 8;

    pub fn mock() -> Self {
        CellInput {
            since: U64::ZERO,
            previous_output: OutPoint {
                tx_hash: H256::random(),
                index: U32::ZERO,
            },
        }
    }
}

#[derive(
    Serialize,
    Deserialize,
    BorshSerialize,
    BorshDeserialize,
    RlpEncodable,
    RlpDecodable,
    Clone,
    Debug,
    PartialEq,
    Eq,
)]
pub struct Script {
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub code_hash: H256,
    pub hash_type: ScriptHashType,
    #[borsh(
        serialize_with = "borsh_serialize_bytes",
        deserialize_with = "borsh_deserialize_bytes"
    )]
    pub args: Bytes,
}

impl Script {
    pub const MIN_SIZE: usize = 32 + 1;

    pub fn mock(expect_size: usize) -> Self {
        assert!(expect_size >= Self::MIN_SIZE);
        Script {
            code_hash: H256::random(),
            hash_type: ScriptHashType::Type,
            args: (0..expect_size - 33)
                .map(|_| rand::random())
                .collect::<Vec<u8>>()
                .into(),
        }
    }
}

#[derive(
    Serialize,
    Deserialize,
    BorshSerialize,
    BorshDeserialize,
    RlpEncodable,
    RlpDecodable,
    Clone,
    Debug,
    PartialEq,
    Eq,
)]
#[rlp(trailing)]
pub struct CellOutput {
    #[borsh(
        serialize_with = "borsh_serialize_uint",
        deserialize_with = "borsh_deserialize_uint"
    )]
    pub capacity: U64,
    pub lock: Script,
    pub type_: Option<Script>,
}

impl CellOutput {
    pub const MIN_SIZE: usize = 8 + Script::MIN_SIZE * 2;

    pub fn mock(expect_size: usize) -> Self {
        assert!(expect_size >= Self::MIN_SIZE);

        let script_size = (expect_size - 8) / 2;

        CellOutput {
            capacity: U64::ZERO,
            lock: Script::mock(script_size),
            type_: Some(Script::mock(script_size)),
        }
    }

    pub fn size(&self) -> usize {
        8 + self.lock.args.len()
            + self
                .type_
                .as_ref()
                .map(|s| s.args.len())
                .unwrap_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_script_hash_type_rlp() {
        let input = ScriptHashType::Data1;
        let rlp = alloy_rlp::encode(&input);
        let decode: ScriptHashType = Decodable::decode(&mut &rlp[..]).unwrap();
        assert_eq!(input, decode);
    }
}
