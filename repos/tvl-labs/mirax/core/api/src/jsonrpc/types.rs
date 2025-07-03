use serde::{Deserialize, Serialize};

use mirax_crypto::Signature;
use mirax_types::{BitVec, BlockNumber, Bytes, Header, TransactionBatch, WrappedTransaction, H256};

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Certificate {
    pub number: u64,
    pub previous_tx_batch_hash: H256,
    pub signatures: Vec<Bytes>,
    pub signer_bitmap: BitVec,
}

impl<S: Signature> From<mirax_types::Certificate<S>> for Certificate {
    fn from(value: mirax_types::Certificate<S>) -> Self {
        Self {
            number: value.number,
            previous_tx_batch_hash: value.previous_tx_batch_hash,
            signatures: value
                .signatures
                .into_iter()
                .map(|sig| sig.as_bytes())
                .collect(),
            signer_bitmap: value.signer_bitmap,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct TransactionChunk {
    pub transaction_batch: TransactionBatch,
    pub certificates: Vec<Certificate>,
    hash: H256,
}

impl<S: Signature> From<mirax_types::TransactionChunk<S>> for TransactionChunk {
    fn from(value: mirax_types::TransactionChunk<S>) -> Self {
        Self {
            hash: value.hash(),
            transaction_batch: value.transaction_batch,
            certificates: value
                .certificates
                .into_iter()
                .map(|cert| cert.into())
                .collect(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Block {
    pub header: Header,
    pub cellbase: WrappedTransaction,
    pub chunks: Vec<TransactionChunk>,
}

impl Block {
    pub fn number(&self) -> BlockNumber {
        self.header.block_number
    }

    pub fn transaction_iter(&self) -> impl Iterator<Item = &WrappedTransaction> {
        self.chunks
            .iter()
            .flat_map(|chunk| chunk.transaction_batch.transactions.iter())
    }

    pub fn hash(&self) -> H256 {
        self.header.calc_hash()
    }
}

impl<S: Signature> From<mirax_types::Block<S>> for Block {
    fn from(value: mirax_types::Block<S>) -> Self {
        Self {
            header: value.header,
            cellbase: value.cellbase,
            chunks: value.chunks.into_iter().map(|chunk| chunk.into()).collect(),
        }
    }
}
