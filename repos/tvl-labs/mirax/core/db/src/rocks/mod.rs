mod cf_handle;
mod snapshot;
#[cfg(test)]
mod test;

use std::{path::Path, sync::Arc};

use mirax_codec::{Bcs, BinaryCodec};
use mirax_primitive::MiraxResult;
use rocksdb::{
    ffi, prelude::*, ColumnFamilyDescriptor, OptimisticTransaction, OptimisticTransactionDB,
    OptimisticTransactionOptions,
};

use crate::error::DBError;
use crate::rocks::{cf_handle::cf_handle, snapshot::RocksDBSnapshot};
use crate::traits::{DBRead, DBSchema, DBSnap, DBStartTransaction, DBTransaction, DBWrite};

#[derive(Clone)]
pub struct RocksDatabase {
    inner: Arc<OptimisticTransactionDB>,
}

impl RocksDatabase {
    pub fn open(path: impl AsRef<Path>, columns: Vec<String>) -> MiraxResult<Self> {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.create_missing_column_families(true);

        let cf_descriptors = columns
            .into_iter()
            .map(|name| ColumnFamilyDescriptor::new(name, Options::default()))
            .collect::<Vec<_>>();

        Ok(RocksDatabase {
            inner: Arc::new(
                OptimisticTransactionDB::open_cf_descriptors(&opts, path.as_ref(), cf_descriptors)
                    .map_err(DBError::from)?,
            ),
        })
    }
}

impl DBRead for RocksDatabase {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>> {
        let k = Bcs::<S::Key>::encode(key)?;

        if let Some(r) = {
            self.inner
                .get_cf(cf_handle(&self.inner, S::table_column()).unwrap(), &k)
                .map_err(DBError::from)?
        } {
            return Ok(Some(Bcs::<S::Value>::decode(r.as_ref())?));
        }

        Ok(None)
    }
}

impl DBWrite for RocksDatabase {
    fn put<S: DBSchema>(&self, key: &S::Key, val: &S::Value) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;
        let v = Bcs::<S::Value>::encode(val)?;

        self.inner
            .put_cf(cf_handle(&self.inner, S::table_column()).unwrap(), &k, &v)
            .map_err(DBError::from)?;

        Ok(())
    }

    fn delete<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;

        self.inner
            .delete_cf(cf_handle(&self.inner, S::table_column()).unwrap(), &k)
            .map_err(DBError::from)?;

        Ok(())
    }
}

impl DBSnap for RocksDatabase {
    #[allow(refining_impl_trait)]
    fn snap(&self) -> MiraxResult<RocksDBSnapshot> {
        unsafe {
            let ptr = ffi::rocksdb_create_snapshot(self.inner.base_db_ptr());
            Ok(RocksDBSnapshot::new(&self.inner, ptr))
        }
    }
}

impl DBStartTransaction for RocksDatabase {
    type Transaction = RocksTransaction;

    #[allow(refining_impl_trait)]
    fn begin_transaction(&self) -> MiraxResult<Self::Transaction> {
        let write_opts = WriteOptions::default();
        let mut tx_opts = OptimisticTransactionOptions::default();
        tx_opts.set_snapshot(true);

        Ok(RocksTransaction {
            inner: self.inner.transaction(&write_opts, &tx_opts),
            db: self.inner.clone(),
        })
    }
}

pub struct RocksTransaction {
    inner: OptimisticTransaction,
    db: Arc<OptimisticTransactionDB>,
}

impl DBRead for RocksTransaction {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>> {
        let k = Bcs::<S::Key>::encode(key)?;
        let db = &self.inner;

        if let Some(r) = {
            db.get_pinned_cf(cf_handle(&self.db, S::table_column()).unwrap(), &k)
                .map_err(DBError::from)?
        } {
            return Ok(Some(Bcs::<S::Value>::decode(r.as_ref())?));
        }

        Ok(None)
    }
}

impl DBWrite for RocksTransaction {
    fn put<S: DBSchema>(&self, key: &S::Key, val: &S::Value) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;
        let v = Bcs::<S::Value>::encode(val)?;

        self.inner
            .put_cf(cf_handle(&self.db, S::table_column()).unwrap(), &k, &v)
            .map_err(DBError::from)?;
        Ok(())
    }

    fn delete<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;

        self.inner
            .delete_cf(cf_handle(&self.db, S::table_column()).unwrap(), &k)
            .map_err(DBError::from)?;
        Ok(())
    }
}

impl DBTransaction for RocksTransaction {
    fn commit(&self) -> MiraxResult<()> {
        self.inner.commit().map_err(DBError::from)?;
        Ok(())
    }

    fn rollback(&self) -> MiraxResult<()> {
        self.inner.rollback().map_err(DBError::from)?;
        Ok(())
    }
}
