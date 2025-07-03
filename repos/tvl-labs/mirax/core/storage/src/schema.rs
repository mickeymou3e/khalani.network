use std::marker::PhantomData;

use mirax_db::traits::{DBSchema, TableColumn, TableName};
use mirax_types::{
    Byte28, Byte32, Byte36, Bytes, CellEntry, Certificate, MiraxMetadata, WrappedTransaction, H256,
};
use serde::{de::DeserializeOwned, Serialize};

use crate::modify::{ModifyBlockHeader, ModifyTransactionBatch, ModifyTransactionChunk};

macro_rules! impl_db_schema {
    ($schema: ident, $key: ty, $val: ty, $name: expr, $col: expr) => {
        pub(crate) struct $schema;

        impl DBSchema for $schema {
            type Key = $key;
            type Value = $val;

            fn table_name() -> TableName {
                $name
            }

            fn table_column() -> TableColumn {
                $col
            }
        }
    };
}

pub const COLUMNS_NUMBER: usize = 13;

const METADATA_COLUMN: &str = "c0";
const METADATA_TABLE: &str = "metadata";
const BLOCK_HASH_NUMBER_COLUMN: &str = "c1";
const BLOCK_HASH_NUMBER_TABLE: &str = "block_hash_number";
const BLOCK_HEADER_COLUMN: &str = "c2";
const BLOCK_HEADER_TABLE: &str = "block";
const LATEST_BLOCK_COLUMN: &str = "c3";
const LATEST_BLOCK_TABLE: &str = "latest_block";
const TRANSACTION_CHUNK_COLUMN: &str = "c4";
const TRANSACTION_CHUNK_TABLE: &str = "transaction_chunk";
const TRANSACTION_BATCH_COLUMN: &str = "c5";
const TRANSACTION_BATCH_TABLE: &str = "transaction_batch";
const CERTIFICATE_COLUMN: &str = "c6";
const CERTIFICATE_TABLE: &str = "certificate";
const TRANSACTION_COLUMN: &str = "c7";
const TRANSACTION_TABLE: &str = "transaction";
const CELL_COLUMN: &str = "c8";
const CELL_TABLE: &str = "cell";
const CELL_DATA_COLUMN: &str = "c9";
const CELL_DATA_TABLE: &str = "cell_data";
const CELL_DATA_HASH_COLUMN: &str = "c10";
const CELL_DATA_HASH_TABLE: &str = "cell_data_hash";

const CONSENSUS_STATE_COLUMN: &str = "c20";
const CONSENSUS_STATE_TABLE: &str = "consensus_state";
const CONSENSUS_COMMIT_COLUMN: &str = "c21";
const CONSENSUS_COMMIT_TABLE: &str = "consensus_commit";

impl_db_schema!(
    MetadataSchema,
    H256,
    MiraxMetadata,
    METADATA_TABLE,
    METADATA_COLUMN
);
impl_db_schema!(
    BlockHeaderSchema,
    u64,
    ModifyBlockHeader,
    BLOCK_HEADER_TABLE,
    BLOCK_HEADER_COLUMN
);
impl_db_schema!(
    BlockHashNumberSchema,
    H256,
    u64,
    BLOCK_HASH_NUMBER_TABLE,
    BLOCK_HASH_NUMBER_COLUMN
);
impl_db_schema!(
    LatestBlockSchema,
    H256,
    ModifyBlockHeader,
    LATEST_BLOCK_TABLE,
    LATEST_BLOCK_COLUMN
);
impl_db_schema!(
    TransactionChunkSchema,
    Byte28,
    ModifyTransactionChunk,
    TRANSACTION_CHUNK_TABLE,
    TRANSACTION_CHUNK_COLUMN
);
impl_db_schema!(
    TransactionBatchSchema,
    Byte28,
    ModifyTransactionBatch,
    TRANSACTION_BATCH_TABLE,
    TRANSACTION_BATCH_COLUMN
);
impl_db_schema!(
    TransactionSchema,
    H256,
    WrappedTransaction,
    TRANSACTION_TABLE,
    TRANSACTION_COLUMN
);
impl_db_schema!(CellSchema, Byte36, CellEntry, CELL_TABLE, CELL_COLUMN);
impl_db_schema!(
    CellDataSchema,
    Byte36,
    Bytes,
    CELL_DATA_TABLE,
    CELL_DATA_COLUMN
);
impl_db_schema!(
    CellDataHashSchema,
    Byte36,
    H256,
    CELL_DATA_HASH_TABLE,
    CELL_DATA_HASH_COLUMN
);
impl_db_schema!(
    ConsensusCommitSchema,
    Byte32,
    Bytes,
    CONSENSUS_COMMIT_TABLE,
    CONSENSUS_COMMIT_COLUMN
);
impl_db_schema!(
    ConsensusStateSchema,
    Byte32,
    Bytes,
    CONSENSUS_STATE_TABLE,
    CONSENSUS_STATE_COLUMN
);

pub(crate) struct CertificateSchema<S>(PhantomData<S>);

impl<S: Serialize + DeserializeOwned> DBSchema for CertificateSchema<S> {
    type Key = Byte32;
    type Value = Certificate<S>;

    fn table_name() -> TableName {
        CERTIFICATE_TABLE
    }

    fn table_column() -> TableColumn {
        CERTIFICATE_COLUMN
    }
}

pub fn db_cols() -> Vec<String> {
    vec![
        METADATA_COLUMN.to_string(),
        BLOCK_HASH_NUMBER_COLUMN.to_string(),
        BLOCK_HEADER_COLUMN.to_string(),
        LATEST_BLOCK_COLUMN.to_string(),
        TRANSACTION_CHUNK_COLUMN.to_string(),
        TRANSACTION_BATCH_COLUMN.to_string(),
        TRANSACTION_COLUMN.to_string(),
        CELL_COLUMN.to_string(),
        CELL_DATA_COLUMN.to_string(),
        CELL_DATA_HASH_COLUMN.to_string(),
        CONSENSUS_COMMIT_COLUMN.to_string(),
        CONSENSUS_STATE_COLUMN.to_string(),
        CERTIFICATE_COLUMN.to_string(),
    ]
}
