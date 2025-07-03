use rocksdb::{prelude::GetColumnFamilys, ColumnFamily, OptimisticTransactionDB};

use crate::traits::TableColumn;

#[inline]
pub(crate) fn cf_handle(db: &OptimisticTransactionDB, col: TableColumn) -> Option<&ColumnFamily> {
    db.cf_handle(col)
}
