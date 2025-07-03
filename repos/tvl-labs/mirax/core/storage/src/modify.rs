use serde::{Deserialize, Serialize};

use mirax_types::{
    Address, BlockEnvelope, BlockNumber, Byte28, Header, TransactionBatch, TransactionChunk,
    WrappedTransaction, H256,
};

#[derive(Serialize, Deserialize, Debug)]
pub struct ModifyBlockHeader {
    pub header: Header,
    pub tx_chunk_keys: Vec<Byte28>,
    pub cellbase_hash: H256,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ModifyTransactionChunk {
    pub block_number: BlockNumber,
    pub tx_batch_hash: H256,
    pub certificate_hashes: Vec<H256>,
}

impl<S> From<&BlockEnvelope<S>> for ModifyBlockHeader {
    fn from(value: &BlockEnvelope<S>) -> Self {
        let tx_chunk_keys = value
            .chunks
            .iter()
            .map(|chunk| generate_number_author_key(&value.header.block_number, &chunk.origin()))
            .collect::<Vec<_>>();

        ModifyBlockHeader {
            header: value.header.clone(),
            tx_chunk_keys,
            cellbase_hash: value.cellbase.hash,
        }
    }
}

pub fn generate_tx_chunk_kv<S>(value: &TransactionChunk<S>) -> (Byte28, ModifyTransactionChunk) {
    let key = generate_number_author_key(&value.block_number(), &value.origin());
    let hashes = value
        .certificates
        .iter()
        .map(|cert| cert.previous_tx_batch_hash)
        .collect::<Vec<_>>();

    (
        key,
        ModifyTransactionChunk {
            block_number: value.block_number(),
            tx_batch_hash: value.transaction_batch.hash(),
            certificate_hashes: hashes,
        },
    )
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ModifyTransactionBatch {
    pub block_number: BlockNumber,
    pub tx_hashes: Vec<H256>,
    pub origin: Address,
}

impl ModifyTransactionBatch {
    pub fn recover(&self, intact_txs: Vec<WrappedTransaction>) -> TransactionBatch {
        TransactionBatch::new(self.block_number, intact_txs, self.origin)
    }
}

/// Generate the key from the block number and the author.
///
/// The key is used to store the block header, the transaction chunk and the transaction batch.
/// The block number is stored in the first 8 bytes. The author's address is stored in the last 20 bytes. The key is 28 bytes long.
pub fn generate_tx_batch_kv(value: &TransactionBatch) -> (Byte28, ModifyTransactionBatch) {
    let hashes = value
        .transactions
        .iter()
        .map(|tx| tx.hash)
        .collect::<Vec<_>>();

    (
        generate_number_author_key(&value.block_number, &value.origin),
        ModifyTransactionBatch {
            block_number: value.block_number,
            tx_hashes: hashes,
            origin: value.origin,
        },
    )
}

/// Generate the key from the block number and the author.
///
/// The key is used to store the block header, the transaction chunk and the transaction batch.
/// The block number is stored in the first 8 bytes. The author's address is stored in the last 20 bytes. The key is 28 bytes long.
pub fn generate_number_author_key(block_number: &BlockNumber, author: &Address) -> Byte28 {
    let mut key = [0u8; 28];
    key[0..8].copy_from_slice(&block_number.to_le_bytes());
    key[8..28].copy_from_slice(author.as_bytes());
    Byte28::new(key)
}
