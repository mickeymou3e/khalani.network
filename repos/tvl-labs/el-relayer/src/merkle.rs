use arcadia::types::{Hasher, H256};
use merkle_cbt::merkle_tree::{Merge, MerkleProof, CBMT};

pub type BinaryMerkleTree = CBMT<H256, MergeH256>;
pub type BinaryMerkleProof = MerkleProof<H256, MergeH256>;
pub type MerkleTree = merkle_cbt::MerkleTree<H256, MergeH256>;

pub struct MergeH256;

impl Merge for MergeH256 {
    type Item = H256;

    fn merge(left: &Self::Item, right: &Self::Item) -> Self::Item {
        let mut buf = Vec::with_capacity(64);
        buf.extend_from_slice(left.as_bytes());
        buf.extend_from_slice(right.as_bytes());
        Hasher::digest(buf)
    }
}
