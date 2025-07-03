use mirax_codec::{Bcs, BinaryCodec};
use mirax_types::{BlockNumber, Byte32, Bytes, CellOutput, OutPoint, Script};

/// Tx index alias
pub type TxIndex = u32;
/// Output index alias
pub type OutputIndex = u32;
/// Cell index alias
pub type CellIndex = u32;

/// Cell type enum
pub enum CellType {
    /// Input Cell
    Input,
    /// Output Cell
    Output,
}

/// +--------------+--------------------+--------------------------+
/// | KeyPrefix::  | Key::              | Value::                  |
/// +--------------+--------------------+--------------------------+
/// | 0            | OutPoint           | Cell                     |
/// | 32           | ConsumedOutPoint   | Cell                     |
/// | 64           | CellLockScript     | TxHash                   |
/// | 96           | CellTypeScript     | TxHash                   |
/// | 128          | TxLockScript       | TxHash                   |
/// | 160          | TxTypeScript       | TxHash                   |
/// | 192          | TxHash             | TransactionInputs        |
/// | 224          | Header             | Transactions             |
/// +--------------+--------------------+--------------------------+
/// Storage indexer key type enum
pub enum Key<'a> {
    /// OutPoint
    OutPoint(&'a OutPoint),
    /// Consumed OutPoint
    ConsumedOutPoint(BlockNumber, &'a OutPoint),
    /// LockScript
    CellLockScript(&'a Script, BlockNumber, TxIndex, OutputIndex),
    /// TypeScript
    CellTypeScript(&'a Script, BlockNumber, TxIndex, OutputIndex),
    /// Tx LockScript, used by get_transactions
    TxLockScript(&'a Script, BlockNumber, TxIndex, CellIndex, CellType),
    /// Tx TypeScript, used by get_transactions
    TxTypeScript(&'a Script, BlockNumber, TxIndex, CellIndex, CellType),
    /// Tx hash
    TxHash(&'a Byte32),
    /// (block_number, block_hash, txs_filtered)
    Header(BlockNumber, &'a Byte32, bool),
}

/// Storage value
pub enum Value<'a> {
    /// Cell
    Cell(BlockNumber, TxIndex, &'a CellOutput, &'a Bytes),
    /// Tx hash
    TxHash(&'a Byte32),
    /// Transaction inputs
    TransactionInputs(Vec<OutPoint>),
    /// (tx_hash, outputs_len, tx_index)
    Transactions(Vec<(Byte32, u32, Option<u32>)>),
}

/// Key prefix
#[repr(u8)]
pub enum KeyPrefix {
    /// OutPoint
    OutPoint = 0,
    /// Consumed OutPoint
    ConsumedOutPoint = 32,
    /// LockScript Cell
    CellLockScript = 64,
    /// TypeScript Cell
    CellTypeScript = 96,
    /// LockScript Tx
    TxLockScript = 128,
    /// TypeScript Tx
    TxTypeScript = 160,
    /// Tx Hash
    TxHash = 192,
    /// Header
    Header = 224,
}

impl Key<'_> {
    /// Encode to binary
    pub fn into_vec(self) -> Vec<u8> {
        self.into()
    }
}

impl<'a> From<Key<'a>> for Vec<u8> {
    fn from(key: Key<'a>) -> Vec<u8> {
        let mut encoded = Vec::new();

        match key {
            Key::OutPoint(out_point) => {
                encoded.push(KeyPrefix::OutPoint as u8);
                encoded.extend_from_slice(&out_point.as_bytes());
            }
            Key::ConsumedOutPoint(block_number, out_point) => {
                encoded.push(KeyPrefix::ConsumedOutPoint as u8);
                encoded.extend_from_slice(&block_number.to_be_bytes());
                encoded.extend_from_slice(&out_point.as_bytes());
            }
            Key::CellLockScript(script, block_number, tx_index, output_index) => {
                encoded.push(KeyPrefix::CellLockScript as u8);
                append_key(&mut encoded, script, block_number, tx_index, output_index);
            }
            Key::CellTypeScript(script, block_number, tx_index, output_index) => {
                encoded.push(KeyPrefix::CellTypeScript as u8);
                append_key(&mut encoded, script, block_number, tx_index, output_index);
            }
            Key::TxLockScript(script, block_number, tx_index, io_index, io_type) => {
                encoded.push(KeyPrefix::TxLockScript as u8);
                append_key(&mut encoded, script, block_number, tx_index, io_index);
                match io_type {
                    CellType::Input => encoded.push(0),
                    CellType::Output => encoded.push(1),
                }
            }
            Key::TxTypeScript(script, block_number, tx_index, io_index, io_type) => {
                encoded.push(KeyPrefix::TxTypeScript as u8);
                append_key(&mut encoded, script, block_number, tx_index, io_index);
                match io_type {
                    CellType::Input => encoded.push(0),
                    CellType::Output => encoded.push(1),
                }
            }
            Key::TxHash(tx_hash) => {
                encoded.push(KeyPrefix::TxHash as u8);
                encoded.extend_from_slice(tx_hash.as_slice());
            }
            Key::Header(block_number, block_hash, filtered) => {
                encoded.push(KeyPrefix::Header as u8);
                encoded.extend_from_slice(&block_number.to_be_bytes());
                encoded.extend_from_slice(block_hash.as_slice());
                if filtered {
                    encoded.push(1);
                }
            }
        }
        encoded
    }
}

impl<'a> From<Value<'a>> for Vec<u8> {
    fn from(value: Value<'a>) -> Vec<u8> {
        let mut encoded = Vec::new();
        match value {
            Value::Cell(block_number, tx_index, output, output_data) => {
                encoded.extend_from_slice(&block_number.to_le_bytes());
                encoded.extend_from_slice(&tx_index.to_le_bytes());

                let raw_cell_output = Bcs::encode(output).unwrap();
                let raw_output_len = raw_cell_output.len() as u32;

                encoded.extend_from_slice(&raw_output_len.to_le_bytes());
                encoded.extend_from_slice(&raw_cell_output);
                encoded.extend_from_slice(output_data);
            }
            Value::TxHash(tx_hash) => {
                encoded.extend_from_slice(tx_hash.as_slice());
            }
            Value::TransactionInputs(out_points) => {
                out_points
                    .iter()
                    .for_each(|out_point| encoded.extend_from_slice(&out_point.as_bytes()));
            }
            Value::Transactions(txs) => {
                txs.iter().for_each(|(tx_hash, outputs_len, tx_index)| {
                    encoded.extend_from_slice(tx_hash.as_slice());
                    encoded.extend_from_slice(&(outputs_len).to_le_bytes());
                    if let Some(i) = tx_index {
                        encoded.extend_from_slice(&i.to_le_bytes());
                    }
                });
            }
        }
        encoded
    }
}

impl Value<'_> {
    /// Decode value from binary
    pub fn parse_cell_value(slice: &[u8]) -> (BlockNumber, TxIndex, CellOutput, Bytes) {
        let block_number =
            BlockNumber::from_le_bytes(slice[0..8].try_into().expect("stored cell block_number"));
        let tx_index =
            TxIndex::from_le_bytes(slice[8..12].try_into().expect("stored cell tx_index"));
        let output_size =
            u32::from_le_bytes(slice[12..16].try_into().expect("stored cell output_size")) as usize;
        let output =
            Bcs::<CellOutput>::decode(&slice[16..16 + output_size]).expect("stored cell output");
        let output_data = slice[16 + output_size..].to_vec().into();

        (block_number, tx_index, output, output_data)
    }

    /// Decode transactions from binary
    pub fn parse_transactions_value(
        slice: &[u8],
        filtered: bool,
    ) -> Vec<(Byte32, u32, Option<u32>)> {
        let chunk_size = if filtered { 32 + 4 + 4 } else { 32 + 4 }; // hash(32) + outputs_len(4) + tx_index(4)
        slice
            .chunks_exact(chunk_size)
            .map(|s| {
                let tx_hash = Byte32::from_slice(&s[0..32]);
                let outputs_len = u32::from_le_bytes(
                    s[32..36]
                        .try_into()
                        .expect("stored block value: outputs_len"),
                );
                let tx_index = if filtered {
                    let tx_index = u32::from_le_bytes(
                        s[36..].try_into().expect("stored block value: tx_index"),
                    );
                    Some(tx_index)
                } else {
                    None
                };
                (tx_hash, outputs_len, tx_index)
            })
            .collect()
    }
}

/// Live cell with information:
/// * CellOutput
/// * Cell data
/// * Block hash in which the cell is created
#[allow(dead_code)]
pub struct DetailedLiveCell {
    block_number: BlockNumber,
    block_hash: Byte32,
    tx_index: TxIndex,
    cell_output: CellOutput,
    cell_data: Bytes,
}

fn append_key(
    encoded: &mut Vec<u8>,
    script: &Script,
    block_number: u64,
    tx_index: u32,
    io_index: u32,
) {
    encoded.extend_from_slice(&block_number.to_be_bytes());
    encoded.extend_from_slice(&tx_index.to_be_bytes());
    encoded.extend_from_slice(&io_index.to_be_bytes());
    encoded.extend_from_slice(&script.as_bytes());
}
