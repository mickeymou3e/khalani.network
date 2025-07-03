use mirax_primitive::traits::{AtomicTrait, BasicTrait, BlockEnvelopeTrait, BlockHeaderTrait};
use mirax_primitive::BlockNumber;
use serde::{Deserialize, Serialize};

use crate::{mirax_hash_bcs, Bytes, TransactionChunk, WrappedTransaction, H256, U16};

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Header {
    pub version: U16,
    pub block_number: BlockNumber,
    pub parent_hash: H256,
    pub live_cells_root: H256,
    pub chunks_root: H256,
    pub transactions_root: H256,
    pub timestamp: u64,
    pub extra_data: Bytes,
}

impl BlockHeaderTrait for Header {
    fn hash(&self) -> H256 {
        self.calc_hash()
    }

    fn version(&self) -> U16 {
        self.version
    }

    fn block_number(&self) -> BlockNumber {
        self.block_number
    }

    fn parent_hash(&self) -> H256 {
        self.parent_hash
    }

    fn live_cells_root(&self) -> H256 {
        self.live_cells_root
    }

    fn chunks_root(&self) -> H256 {
        self.chunks_root
    }

    fn transactions_root(&self) -> H256 {
        self.transactions_root
    }

    fn timestamp(&self) -> u64 {
        self.timestamp
    }

    fn extra_data(&self) -> &[u8] {
        self.extra_data.as_ref()
    }
}

impl Header {
    pub fn calc_hash(&self) -> H256 {
        mirax_hash_bcs(self).unwrap()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct BlockEnvelope<S> {
    pub header: Header,
    pub cellbase: WrappedTransaction,
    pub chunks: Vec<TransactionChunk<S>>,
}

impl<S: BasicTrait + AtomicTrait> BlockEnvelopeTrait for BlockEnvelope<S> {
    type Header = Header;

    type Transaction = WrappedTransaction;

    fn header(&self) -> &Self::Header {
        &self.header
    }

    fn cellbase(&self) -> &Self::Transaction {
        &self.cellbase
    }

    fn transactions(&self) -> Vec<Self::Transaction> {
        self.chunks
            .iter()
            .flat_map(|chunk| &chunk.transaction_batch.transactions)
            .cloned()
            .collect()
    }

    fn transactions_iter(&self) -> impl Iterator<Item = &Self::Transaction> {
        std::iter::once(&self.cellbase).chain(
            self.chunks
                .iter()
                .flat_map(|chunk| &chunk.transaction_batch.transactions),
        )
    }
}

impl<S> BlockEnvelope<S> {
    pub fn hash(&self) -> H256 {
        self.header.calc_hash()
    }

    pub fn number(&self) -> BlockNumber {
        self.header.block_number
    }

    pub fn transaction_iter(&self) -> impl Iterator<Item = &WrappedTransaction> {
        std::iter::once(&self.cellbase).chain(
            self.chunks
                .iter()
                .flat_map(|chunk| &chunk.transaction_batch.transactions),
        )
    }
}
