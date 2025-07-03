use mirax_crypto::Signature;
use mirax_types::{BlockEnvelope, H256, Header};
use serde::{Deserialize, Serialize};

use crate::{TransactionChunkInfo, TransactionEnvelope};

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Block {
    pub hash: H256,
    pub header: Header,
    pub cellbase: TransactionEnvelope,
    pub chunks: Vec<TransactionChunkInfo>,
    pub transactions: Vec<TransactionEnvelope>,
}

impl<S: Signature> From<BlockEnvelope<S>> for Block {
    fn from(value: BlockEnvelope<S>) -> Self {
        let hash = value.header.calc_hash();
        let mut chunks = Vec::with_capacity(value.chunks.len());
        let mut transactions = Vec::with_capacity(100);
        let cellbase = TransactionEnvelope {
            hash: value.cellbase.hash,
            is_cellbase: true,
            chunk_index: 0,
            in_chunk_index: 0,
            transaction: value.cellbase.transaction,
        };

        for (chunk_index, chunk) in value.chunks.into_iter().enumerate() {
            chunks.push(TransactionChunkInfo {
                hash: chunk.hash(),
                chunk_index: chunk_index as u32,
                certificates: chunk.certificates.into_iter().map(|c| c.into()).collect(),
            });

            for (in_chunk_index, tx) in chunk.transaction_batch.transactions.into_iter().enumerate()
            {
                transactions.push(TransactionEnvelope {
                    hash: tx.hash,
                    is_cellbase: false,
                    chunk_index: chunk_index as u32,
                    in_chunk_index: in_chunk_index as u32,
                    transaction: tx.transaction,
                });
            }
        }

        Self {
            hash,
            header: value.header,
            cellbase,
            chunks,
            transactions,
        }
    }
}
