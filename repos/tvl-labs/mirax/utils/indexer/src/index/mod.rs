mod sync;
mod types;

pub use crate::index::sync::IndexerSync;

use mirax_jsonrpc_types::Block;
use mirax_types::{BlockNumber, Byte32, MiraxResult, OutPoint};

use crate::index::types::{CellType, Key, KeyPrefix, Value};
use crate::store::{BatchStore, IteratorDirection, Store};

/// Indexer store wrapper
#[derive(Clone)]
pub(crate) struct MiraxIndexer<S> {
    store: S,
}

impl<S> MiraxIndexer<S> {
    pub fn new(store: S) -> Self {
        Self { store }
    }
}

impl<S: Store> IndexerSync for MiraxIndexer<S> {
    /// Parse the block, store the Cell Transaction etc. contained in the block with the designed index
    fn append(&self, block: &Block) -> MiraxResult<()> {
        let mut batch = self.store.batch()?;
        let block_number = block.header.block_number;
        let block_hash = block.hash;
        let mut matched_txs = vec![];
        let tx_count = block.transactions.len();

        for (tx_index, tx) in block.transactions.iter().enumerate() {
            let tx_index = tx_index as u32;
            let tx_hash = tx.hash;
            let transaction = tx.transaction.clone();

            for (input_index, input) in transaction.inputs.into_iter().enumerate() {
                // delete live cells related kv and mark it as consumed (for rollback and forking)
                // insert lock / type => tx_hash mapping
                let input_index = input_index as u32;
                let out_point = input.previous_output;
                let key_vec = Key::OutPoint(&out_point).into_vec();

                if let Some(stored_live_cell) = self.store.get(&key_vec)?.or_else(|| {
                    block
                        .transactions
                        .iter()
                        .enumerate()
                        .find(|(_i, tx)| tx.hash == out_point.tx_hash)
                        .map(|(i, tx)| {
                            let output_index = out_point.index as usize;
                            Value::Cell(
                                block_number,
                                i as u32,
                                tx.transaction
                                    .outputs
                                    .get(output_index)
                                    .expect("index should match"),
                                tx.transaction
                                    .outputs_data
                                    .get(output_index)
                                    .expect("index should match"),
                            )
                            .into()
                        })
                }) {
                    let (generated_by_block_number, generated_by_tx_index, output, _output_data) =
                        Value::parse_cell_value(&stored_live_cell);

                    batch.delete(
                        Key::CellLockScript(
                            &output.lock,
                            generated_by_block_number,
                            generated_by_tx_index,
                            out_point.index,
                        )
                        .into_vec(),
                    )?;
                    batch.put_kv(
                        Key::TxLockScript(
                            &output.lock,
                            block_number,
                            tx_index,
                            input_index,
                            CellType::Input,
                        ),
                        Value::TxHash(&tx_hash),
                    )?;
                    if let Some(script) = output.type_ {
                        batch.delete(
                            Key::CellTypeScript(
                                &script,
                                generated_by_block_number,
                                generated_by_tx_index,
                                out_point.index,
                            )
                            .into_vec(),
                        )?;
                        batch.put_kv(
                            Key::TxTypeScript(
                                &script,
                                block_number,
                                tx_index,
                                input_index,
                                CellType::Input,
                            ),
                            Value::TxHash(&tx_hash),
                        )?;
                    };
                    batch.delete(key_vec)?;
                    batch.put_kv(
                        Key::ConsumedOutPoint(block_number, &out_point),
                        stored_live_cell,
                    )?;
                }
            }

            for (output_index, output) in tx.transaction.outputs.clone().into_iter().enumerate() {
                // insert live cells related kv
                // insert lock / type => tx_hash mapping
                let output_data = tx
                    .transaction
                    .outputs_data
                    .get(output_index)
                    .expect("outputs_data len should equals outputs len");

                let output_index = output_index as u32;
                let out_point = OutPoint::new(tx.hash, output_index);
                batch.put_kv(
                    Key::CellLockScript(&output.lock, block_number, tx_index, output_index),
                    Value::TxHash(&tx_hash),
                )?;
                batch.put_kv(
                    Key::TxLockScript(
                        &output.lock,
                        block_number,
                        tx_index,
                        output_index,
                        CellType::Output,
                    ),
                    Value::TxHash(&tx_hash),
                )?;
                if let Some(script) = output.type_.as_ref() {
                    batch.put_kv(
                        Key::CellTypeScript(script, block_number, tx_index, output_index),
                        Value::TxHash(&tx_hash),
                    )?;
                    batch.put_kv(
                        Key::TxTypeScript(
                            script,
                            block_number,
                            tx_index,
                            output_index,
                            CellType::Output,
                        ),
                        Value::TxHash(&tx_hash),
                    )?;
                }
                batch.put_kv(
                    Key::OutPoint(&out_point),
                    Value::Cell(block_number, tx_index, &output, output_data),
                )?;
            }

            matched_txs.push((tx.hash, tx.transaction.outputs.len() as u32, Some(tx_index)));
            // insert tx
            batch.put_kv(
                Key::TxHash(&tx_hash),
                Value::TransactionInputs(
                    tx.transaction
                        .inputs
                        .clone()
                        .into_iter()
                        .map(|input| input.previous_output)
                        .collect(),
                ),
            )?;
        }

        // insert block transactions
        if matched_txs.len() == tx_count {
            batch.put_kv(
                Key::Header(block_number, &block_hash, false),
                Value::Transactions(
                    matched_txs
                        .into_iter()
                        .map(|(tx_hash, outputs_len, _)| (tx_hash, outputs_len, None))
                        .collect(),
                ),
            )?;
        } else {
            batch.put_kv(
                Key::Header(block_number, &block_hash, true),
                Value::Transactions(matched_txs),
            )?;
        }
        batch.commit()?;

        Ok(())
    }

    fn tip(&self) -> MiraxResult<Option<(BlockNumber, Byte32)>> {
        let mut iter = self
            .store
            .iter([KeyPrefix::Header as u8 + 1], IteratorDirection::Reverse)?;
        Ok(iter.next().map(|(key, _)| {
            (
                BlockNumber::from_be_bytes(key[1..9].try_into().expect("stored block key")),
                Byte32::from_slice(&key[9..41]),
            )
        }))
    }

    /// Return identity
    fn get_identity(&self) -> &str {
        "indexer"
    }
}
