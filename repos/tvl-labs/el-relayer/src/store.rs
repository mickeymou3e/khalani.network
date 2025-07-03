use std::sync::Arc;

use anyhow::Result;
use sparse_merkle_tree::traits::{StoreReadOps, StoreWriteOps};
use sparse_merkle_tree::{error::Error, merge::MergeValue, BranchKey, BranchNode, H256};

use crate::db::{
    Col, RocksDB, COLUMN_SMT_BRANCH, COLUMN_SMT_LEAF, COLUMN_SMT_ROOT, COLUMN_SMT_TEMP_LEAVES,
};
use crate::error::RelayerError;
use crate::smt::SMTLeaf;

const REGISTRY_KEY: [u8; 32] = [90u8; 32];
const BRANCH_KEY_LEN: usize = 33;

pub struct SMTStore {
    leaf_col: Col,
    branch_col: Col,
    root_col: Col,
    leaves_col: Col,
    store: Arc<RocksDB>,
}

impl SMTStore {
    pub fn new(store: Arc<RocksDB>) -> Self {
        SMTStore {
            leaf_col: COLUMN_SMT_LEAF,
            branch_col: COLUMN_SMT_BRANCH,
            root_col: COLUMN_SMT_ROOT,
            leaves_col: COLUMN_SMT_TEMP_LEAVES,
            store,
        }
    }

    pub fn save_root(&self, root: &H256) -> Result<()> {
        self.store
            .put(self.root_col, &REGISTRY_KEY, root.as_slice())
            .map_err(|err| RelayerError::SMT(format!("insert error {:?}", err)))?;
        Ok(())
    }

    pub fn get_root(&self) -> Result<Option<H256>> {
        match self.store.get(self.root_col, &REGISTRY_KEY)? {
            Some(slice) => {
                let mut v = [0u8; 32];
                v.copy_from_slice(&slice[0..32]);
                Ok(Some(v.into()))
            }
            None => Ok(None),
        }
    }

    pub fn insert_leaves(&self, leaves: Vec<SMTLeaf>) -> Result<()> {
        let raw = bcs::to_bytes(&leaves)?;
        self.store.put(self.leaves_col, &REGISTRY_KEY, &raw)?;

        Ok(())
    }

    pub fn get_leaves(&self) -> Result<Option<Vec<SMTLeaf>>> {
        match self.store.get(self.leaves_col, &REGISTRY_KEY)? {
            Some(slice) => {
                let leaves: Vec<SMTLeaf> = bcs::from_bytes(&slice)?;
                Ok(Some(leaves))
            }
            None => Ok(None),
        }
    }
}

impl StoreReadOps<H256> for SMTStore {
    fn get_branch(&self, branch_key: &BranchKey) -> Result<Option<BranchNode>, Error> {
        match self
            .store
            .get(self.branch_col, &encode_branch_key(branch_key))
            .map_err(|e| Error::Store(e.to_string()))?
        {
            Some(slice) => Ok(Some(decode_branch_node(&slice))),
            None => Ok(None),
        }
    }

    fn get_leaf(&self, leaf_key: &H256) -> Result<Option<H256>, Error> {
        match self
            .store
            .get(self.leaf_col, leaf_key.as_slice())
            .map_err(|e| Error::Store(e.to_string()))?
        {
            Some(slice) if slice.len() == 32 => {
                let mut leaf = [0u8; 32];
                leaf.copy_from_slice(slice.as_ref());
                Ok(Some(leaf.into()))
            }
            Some(_) => Err(Error::Store("get corrupted leaf".to_string())),
            None => Ok(None),
        }
    }
}

impl StoreWriteOps<H256> for SMTStore {
    fn insert_branch(&mut self, node_key: BranchKey, branch: BranchNode) -> Result<(), Error> {
        self.store
            .put(
                self.branch_col,
                &encode_branch_key(&node_key),
                &encode_branch_node(&branch),
            )
            .map_err(|err| Error::Store(format!("insert error {:?}", err)))?;

        Ok(())
    }

    fn insert_leaf(&mut self, leaf_key: H256, leaf: H256) -> Result<(), Error> {
        self.store
            .put(self.leaf_col, leaf_key.as_slice(), leaf.as_slice())
            .map_err(|err| Error::Store(format!("insert error {:?}", err)))?;

        Ok(())
    }

    fn remove_branch(&mut self, node_key: &BranchKey) -> Result<(), Error> {
        self.store
            .delete(self.branch_col, &encode_branch_key(node_key))
            .map_err(|err| Error::Store(format!("delete error {:?}", err)))?;

        Ok(())
    }

    fn remove_leaf(&mut self, leaf_key: &H256) -> Result<(), Error> {
        self.store
            .delete(self.leaf_col, leaf_key.as_slice())
            .map_err(|err| Error::Store(format!("delete error {:?}", err)))?;

        Ok(())
    }
}

fn encode_branch_key(key: &BranchKey) -> Vec<u8> {
    let mut ret = [key.height; BRANCH_KEY_LEN];
    ret[1..BRANCH_KEY_LEN].copy_from_slice(key.node_key.as_slice());
    ret.to_vec()
}

fn decode_branch_key(encoded: &[u8]) -> BranchKey {
    let mut key = [0; 32];
    key.copy_from_slice(&encoded[1..BRANCH_KEY_LEN]);

    BranchKey {
        height: encoded[0],
        node_key: key.into(),
    }
}

fn encode_branch_node(node: &BranchNode) -> Vec<u8> {
    match (&node.left, &node.right) {
        (MergeValue::Value(left), MergeValue::Value(right)) => {
            let mut ret = Vec::with_capacity(33);
            ret.extend_from_slice(&[0]);
            ret.extend_from_slice(left.as_slice());
            ret.extend_from_slice(right.as_slice());
            ret
        }
        (
            MergeValue::Value(left),
            MergeValue::MergeWithZero {
                base_node,
                zero_bits,
                zero_count,
            },
        ) => {
            let mut ret = Vec::with_capacity(98);
            ret.extend_from_slice(&[1]);
            ret.extend_from_slice(left.as_slice());
            ret.extend_from_slice(base_node.as_slice());
            ret.extend_from_slice(zero_bits.as_slice());
            ret.extend_from_slice(&[*zero_count]);
            ret
        }
        (
            MergeValue::MergeWithZero {
                base_node,
                zero_bits,
                zero_count,
            },
            MergeValue::Value(right),
        ) => {
            let mut ret = Vec::with_capacity(98);
            ret.extend_from_slice(&[2]);
            ret.extend_from_slice(base_node.as_slice());
            ret.extend_from_slice(zero_bits.as_slice());
            ret.extend_from_slice(&[*zero_count]);
            ret.extend_from_slice(right.as_slice());
            ret
        }
        (
            MergeValue::MergeWithZero {
                base_node: l_base_node,
                zero_bits: l_zero_bits,
                zero_count: l_zero_count,
            },
            MergeValue::MergeWithZero {
                base_node: r_base_node,
                zero_bits: r_zero_bits,
                zero_count: r_zero_count,
            },
        ) => {
            let mut ret = Vec::with_capacity(131);
            ret.extend_from_slice(&[3]);
            ret.extend_from_slice(l_base_node.as_slice());
            ret.extend_from_slice(l_zero_bits.as_slice());
            ret.extend_from_slice(&[*l_zero_count]);
            ret.extend_from_slice(r_base_node.as_slice());
            ret.extend_from_slice(r_zero_bits.as_slice());
            ret.extend_from_slice(&[*r_zero_count]);
            ret
        }
    }
}

fn decode_branch_node(slice: &[u8]) -> BranchNode {
    match slice[0] {
        0 => {
            let left: [u8; 32] = slice[1..33].try_into().expect("checked slice");
            let right: [u8; 32] = slice[33..65].try_into().expect("checked slice");
            BranchNode {
                left: MergeValue::Value(left.into()),
                right: MergeValue::Value(right.into()),
            }
        }
        1 => {
            let left: [u8; 32] = slice[1..33].try_into().expect("checked slice");
            let base_node: [u8; 32] = slice[33..65].try_into().expect("checked slice");
            let zero_bits: [u8; 32] = slice[65..97].try_into().expect("checked slice");
            let zero_count = slice[97];
            BranchNode {
                left: MergeValue::Value(left.into()),
                right: MergeValue::MergeWithZero {
                    base_node: base_node.into(),
                    zero_bits: zero_bits.into(),
                    zero_count,
                },
            }
        }
        2 => {
            let base_node: [u8; 32] = slice[1..33].try_into().expect("checked slice");
            let zero_bits: [u8; 32] = slice[33..65].try_into().expect("checked slice");
            let zero_count = slice[65];
            let right: [u8; 32] = slice[66..98].try_into().expect("checked slice");
            BranchNode {
                left: MergeValue::MergeWithZero {
                    base_node: base_node.into(),
                    zero_bits: zero_bits.into(),
                    zero_count,
                },
                right: MergeValue::Value(right.into()),
            }
        }
        3 => {
            let l_base_node: [u8; 32] = slice[1..33].try_into().expect("checked slice");
            let l_zero_bits: [u8; 32] = slice[33..65].try_into().expect("checked slice");
            let l_zero_count = slice[65];
            let r_base_node: [u8; 32] = slice[66..98].try_into().expect("checked slice");
            let r_zero_bits: [u8; 32] = slice[98..130].try_into().expect("checked slice");
            let r_zero_count = slice[130];
            BranchNode {
                left: MergeValue::MergeWithZero {
                    base_node: l_base_node.into(),
                    zero_bits: l_zero_bits.into(),
                    zero_count: l_zero_count,
                },
                right: MergeValue::MergeWithZero {
                    base_node: r_base_node.into(),
                    zero_bits: r_zero_bits.into(),
                    zero_count: r_zero_count,
                },
            }
        }
        _ => {
            unreachable!()
        }
    }
}
