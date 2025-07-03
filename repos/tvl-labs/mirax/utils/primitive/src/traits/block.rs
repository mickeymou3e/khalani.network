use crate::traits::{AtomicTrait, BasicTrait, TransactionTrait};
use crate::{BlockNumber, H256, U16};

pub trait BlockHeaderTrait: BasicTrait + AtomicTrait {
    fn hash(&self) -> H256;

    fn version(&self) -> U16;

    fn block_number(&self) -> BlockNumber;

    fn parent_hash(&self) -> H256;

    fn live_cells_root(&self) -> H256;

    fn chunks_root(&self) -> H256;

    fn transactions_root(&self) -> H256;

    fn timestamp(&self) -> u64;

    fn extra_data(&self) -> &[u8];
}

pub trait BlockEnvelopeTrait: BasicTrait + AtomicTrait {
    type Header: BlockHeaderTrait;

    type Transaction: TransactionTrait;

    fn header(&self) -> &Self::Header;

    fn cellbase(&self) -> &Self::Transaction;

    fn transactions(&self) -> Vec<Self::Transaction>;

    fn transactions_iter(&self) -> impl Iterator<Item = &Self::Transaction>;

    fn hash(&self) -> H256 {
        self.header().hash()
    }
}
