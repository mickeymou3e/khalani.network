use merkle_cbt::merkle_tree::{Merge, MerkleProof, CBMT};
use mirax_primitive::H256;

pub type BinaryMerkleTree = CBMT<H256, MergeH256>;
pub type BinaryMerkleProof = MerkleProof<H256, MergeH256>;
pub type MerkleTree = merkle_cbt::MerkleTree<H256, MergeH256>;

pub struct MergeH256;

impl Merge for MergeH256 {
    type Item = H256;

    fn merge(left: &Self::Item, right: &Self::Item) -> Self::Item {
        crate::blake3_merge(left, right)
    }
}
