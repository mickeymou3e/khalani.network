use mirax_crypto::Signature;
use mirax_types::{BitVec, Bytes, H256};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct TransactionEnvelope {
    pub hash: H256,
    pub is_cellbase: bool,
    pub chunk_index: u32,
    pub in_chunk_index: u32,
    pub transaction: mirax_types::Transaction,
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct TransactionChunkInfo {
    pub hash: H256,
    pub chunk_index: u32,
    pub certificates: Vec<Certificate>,
}

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
