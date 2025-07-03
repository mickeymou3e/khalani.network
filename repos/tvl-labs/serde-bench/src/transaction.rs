use std::fmt::{Display, Formatter, Result};

use crate::{
    borsh_deserialize_bytes_vec, borsh_deserialize_h256_vec, borsh_deserialize_uint,
    borsh_serialize_bytes_vec, borsh_serialize_h256_vec, borsh_serialize_uint, random_bytes,
    CellDep, CellInput, CellOutput, InputGroup, H256,
};

use alloy_primitives::U16;
use alloy_rlp::{Decodable, RlpDecodable, RlpEncodable};
use borsh::{BorshDeserialize, BorshSerialize};
use bytes::Bytes;
use serde::{Deserialize, Serialize};

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
pub struct Transaction {
    #[borsh(
        serialize_with = "borsh_serialize_uint",
        deserialize_with = "borsh_deserialize_uint"
    )]
    pub version: U16,
    pub cell_deps: Vec<CellDep>,
    #[borsh(
        serialize_with = "borsh_serialize_h256_vec",
        deserialize_with = "borsh_deserialize_h256_vec"
    )]
    pub header_deps: Vec<H256>,
    pub inputs: Vec<CellInput>,
    pub outputs: Vec<CellOutput>,
    #[borsh(
        serialize_with = "borsh_serialize_bytes_vec",
        deserialize_with = "borsh_deserialize_bytes_vec"
    )]
    pub outputs_data: Vec<Bytes>,
    #[borsh(
        serialize_with = "borsh_serialize_bytes_vec",
        deserialize_with = "borsh_deserialize_bytes_vec"
    )]
    pub witnesses: Vec<Bytes>,
}

impl Display for Transaction {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(f, "Transaction")
    }
}

impl Transaction {
    pub const MIN_SIZE: usize = 2 + CellDep::SIZE + 32 + CellInput::SIZE + CellOutput::MIN_SIZE;

    pub fn mock(output_len: usize, expect_size: usize) -> Self {
        assert!(expect_size >= Self::MIN_SIZE * 2);

        let output_and_data_size = expect_size / 2 - CellDep::SIZE - 32 - CellInput::SIZE - 64;
        let per_output_size = output_and_data_size / output_len;

        Transaction {
            version: U16::ZERO,
            cell_deps: (0..2).map(|_| CellDep::mock()).collect(),
            header_deps: (0..2).map(|_| H256::random()).collect(),
            inputs: (0..2).map(|_| CellInput::mock()).collect(),
            outputs: (0..output_len)
                .map(|_| CellOutput::mock(per_output_size))
                .collect(),
            outputs_data: (0..output_len)
                .map(|_| random_bytes(per_output_size))
                .collect(),
            witnesses: (0..output_len).map(|_| random_bytes(64)).collect(),
        }
    }

    pub fn size(&self) -> usize {
        2 + self.cell_deps.len() * CellDep::SIZE
            + self.header_deps.len() * 32
            + self.inputs.len() * CellInput::SIZE
            + self.outputs.iter().map(|c| c.size()).sum::<usize>()
            + self.outputs_data.iter().map(|d| d.len()).sum::<usize>()
            + self.witnesses.iter().map(|w| w.len()).sum::<usize>()
    }

    pub fn to_rlp(&self) -> Vec<u8> {
        alloy_rlp::encode(self.clone())
    }

    pub fn to_bcs(&self) -> Vec<u8> {
        bcs::to_bytes(self).unwrap()
    }

    pub fn to_borsh(&self) -> Vec<u8> {
        borsh::to_vec(self).unwrap()
    }

    pub fn from_rlp(raw: Vec<u8>) -> Self {
        Decodable::decode(&mut &raw[..]).unwrap()
    }

    pub fn from_bcs(raw: Vec<u8>) -> Self {
        bcs::from_bytes(&raw).unwrap()
    }

    pub fn from_borsh(raw: Vec<u8>) -> Self {
        borsh::from_slice(&raw).unwrap()
    }

    pub fn group_raw_input(&self) -> InputGroup {
        InputGroup {
            rlp: self.to_rlp(),
            bcs: self.to_bcs(),
            borsh: self.to_borsh(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tx_codec() {
        let input = Transaction::mock(1, 1024);
        assert_eq!(input, Transaction::from_rlp(input.to_rlp()));
        assert_eq!(input, Transaction::from_bcs(input.to_bcs()));
        assert_eq!(input, Transaction::from_borsh(input.to_borsh()));
    }
}
