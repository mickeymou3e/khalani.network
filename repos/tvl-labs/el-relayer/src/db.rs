use anyhow::Result;
use rocksdb::{ColumnFamily, ColumnFamilyDescriptor, OptimisticTransactionDB, Options};
use std::sync::Arc;

use crate::error::RelayerError;

pub type Col = u8;
pub const COLUMNS: u32 = 5;
pub const COLUMN_SMT_BRANCH: Col = 0;
pub const COLUMN_SMT_LEAF: Col = 1;
pub const COLUMN_SMT_ROOT: Col = 2;
pub const COLUMN_SMT_TEMP_LEAVES: Col = 3;
pub const COLUMN_BLOCK_NUMBER: Col = 4;

#[derive(Clone)]
pub struct RocksDB {
    pub(crate) inner: Arc<OptimisticTransactionDB>,
}

impl RocksDB {
    pub fn new_with_path(path: &str) -> Result<Self> {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.create_missing_column_families(true);

        let cf_names: Vec<_> = (0..COLUMNS).map(|c| c.to_string()).collect();
        let cf_descriptors: Vec<_> = cf_names
            .iter()
            .map(|c| ColumnFamilyDescriptor::new(c, Options::default()))
            .collect();

        let db = OptimisticTransactionDB::open_cf_descriptors(&opts, path, cf_descriptors)
            .map_err(|e| {
                RelayerError::RocksDB(format!("RocksDB open error: {:?}", e.to_string()))
            })?;
        Ok(RocksDB {
            inner: Arc::new(db),
        })
    }

    pub fn get(&self, col: Col, key: &[u8]) -> Result<Option<Vec<u8>>> {
        let cf = cf_handle(&self.inner, col)?;
        self.inner
            .get_cf(cf, key)
            .map_err(|_e| RelayerError::RocksDB("transaction get_cf".to_owned()).into())
    }

    pub fn put(&self, col: Col, key: &[u8], value: &[u8]) -> Result<()> {
        let cf = cf_handle(&self.inner, col)?;
        self.inner
            .put_cf(cf, key, value)
            .map_err(|_e| RelayerError::RocksDB("transaction put_cf".to_owned()).into())
    }

    pub fn delete(&self, col: Col, key: &[u8]) -> Result<()> {
        let cf = cf_handle(&self.inner, col)?;
        self.inner
            .delete_cf(cf, key)
            .map_err(|_e| RelayerError::RocksDB("transaction delete_cf".to_owned()).into())
    }
}

#[inline]
pub(crate) fn cf_handle(db: &OptimisticTransactionDB, col: Col) -> Result<&ColumnFamily> {
    db.cf_handle(&col.to_string())
        .ok_or_else(|| RelayerError::RocksDB(format!("column {} not found", col)).into())
}
