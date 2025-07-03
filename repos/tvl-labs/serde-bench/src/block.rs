use std::fmt::{Display, Formatter, Result};

use crate::{
    borsh_deserialize_bytes, borsh_deserialize_h256, borsh_deserialize_uint, borsh_serialize_bytes,
    borsh_serialize_h256, borsh_serialize_uint, random_bytes, InputGroup, Transaction, H256,
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
pub struct Header {
    #[borsh(
        serialize_with = "borsh_serialize_uint",
        deserialize_with = "borsh_deserialize_uint"
    )]
    pub version: U16,
    pub timestamp: u64,
    pub number: u64,
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub parent_hash: H256,
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub transactions_root: H256,
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub proposals_hash: H256,
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub extra_hash: H256,
}

impl Header {
    const SIZE: usize = 2 + 8 + 8 + 32 + 32 + 32 + 32;

    pub fn mock() -> Self {
        Header {
            version: U16::ZERO,
            timestamp: rand::random(),
            number: rand::random(),
            parent_hash: H256::random(),
            transactions_root: H256::random(),
            proposals_hash: H256::random(),
            extra_hash: H256::random(),
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
pub struct HeaderView {
    pub inner: Header,
    #[borsh(
        serialize_with = "borsh_serialize_h256",
        deserialize_with = "borsh_deserialize_h256"
    )]
    pub hash: H256,
}

impl HeaderView {
    const SIZE: usize = Header::SIZE + 32;

    pub fn mock() -> Self {
        HeaderView {
            inner: Header::mock(),
            hash: H256::random(),
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
pub struct Block {
    pub header: HeaderView,
    pub transactions: Vec<Transaction>,
    pub proposals: Vec<u64>,
    #[borsh(
        serialize_with = "borsh_serialize_bytes",
        deserialize_with = "borsh_deserialize_bytes"
    )]
    pub extension: Bytes,
}

impl Display for Block {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(f, "Block")
    }
}

impl Block {
    pub fn mock(
        txs_len: usize,
        per_tx_size: usize,
        output_number_per_tx: usize,
        proposals_len: usize,
        ext_len: usize,
    ) -> Self {
        Block {
            header: HeaderView::mock(),
            transactions: (0..txs_len)
                .map(|_| Transaction::mock(output_number_per_tx, per_tx_size))
                .collect(),
            proposals: (0..proposals_len).map(|_| rand::random()).collect(),
            extension: random_bytes(ext_len),
        }
    }

    pub fn size(&self) -> usize {
        HeaderView::SIZE
            + self.transactions.iter().map(|tx| tx.size()).sum::<usize>()
            + self.proposals.len() * 8
            + self.extension.len()
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
    fn test_block_rlp() {
        let input = Block::mock(1, 1024, 1, 1, 64);
        assert_eq!(input, Block::from_rlp(input.to_rlp()));
        assert_eq!(input, Block::from_bcs(input.to_bcs()));
        assert_eq!(input, Block::from_borsh(input.to_borsh()));
    }
}
