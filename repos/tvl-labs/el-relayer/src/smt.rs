use arcadia::types::Hasher;
use serde::{Deserialize, Serialize};
use sparse_merkle_tree::{blake2b::Blake2bHasher, SparseMerkleTree, H256};

use crate::store::SMTStore;

pub type SMT = SparseMerkleTree<Blake2bHasher, H256, SMTStore>;

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct SMTLeaf {
    pub key: [u8; 32],
    pub val: [u8; 32],
}

impl SMTLeaf {
    pub fn new(start_number: u64, val: [u8; 32]) -> Self {
        let key = Hasher::digest(start_number.to_le_bytes()).0;
        SMTLeaf { key, val }
    }
}
