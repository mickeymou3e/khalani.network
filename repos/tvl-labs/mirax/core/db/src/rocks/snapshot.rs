use std::sync::Arc;

use libc::{self, c_char, size_t};
use rocksdb::ops::{GetPinnedCF, Iterate, IterateCF, Read};
use rocksdb::{
    ffi, ffi_util, ColumnFamily, ConstHandle, DBPinnableSlice, DBRawIterator, Error, Handle,
    OptimisticTransactionDB, ReadOptions,
};

use mirax_codec::{Bcs, BinaryCodec};
use mirax_primitive::MiraxResult;

use crate::traits::{DBRead, DBSchema};
use crate::{error::DBError, rocks::cf_handle::cf_handle};

/// A snapshot captures a point-in-time view of the DB at the time it's created
pub struct RocksDBSnapshot {
    pub(crate) db: Arc<OptimisticTransactionDB>,
    pub(crate) inner: *const ffi::rocksdb_snapshot_t,
}

impl DBRead for RocksDBSnapshot {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>> {
        let k = Bcs::<S::Key>::encode(key)?;

        let v = self
            .get_pinned_cf_full(
                Some(cf_handle(&self.db, S::table_column()).unwrap()),
                &k,
                None,
            )
            .map_err(DBError::from)?;
        match v {
            Some(v) => Ok(Some(Bcs::<S::Value>::decode(v.as_ref())?)),
            None => Ok(None),
        }
    }
}

unsafe impl Sync for RocksDBSnapshot {}
unsafe impl Send for RocksDBSnapshot {}

impl RocksDBSnapshot {
    /// # Safety
    ///
    /// This function is unsafe because it take raw pointer as arguments
    pub unsafe fn new(
        db: &Arc<OptimisticTransactionDB>,
        ptr: *const ffi::rocksdb_snapshot_t,
    ) -> RocksDBSnapshot {
        RocksDBSnapshot {
            db: Arc::clone(db),
            inner: ptr,
        }
    }
}

impl Read for RocksDBSnapshot {}

impl ConstHandle<ffi::rocksdb_snapshot_t> for RocksDBSnapshot {
    fn const_handle(&self) -> *const ffi::rocksdb_snapshot_t {
        self.inner
    }
}

impl<'a> GetPinnedCF<'a> for RocksDBSnapshot {
    type ColumnFamily = &'a ColumnFamily;
    type ReadOptions = &'a ReadOptions;

    fn get_pinned_cf_full<K: AsRef<[u8]>>(
        &'a self,
        cf: Option<Self::ColumnFamily>,
        key: K,
        readopts: Option<Self::ReadOptions>,
    ) -> Result<Option<DBPinnableSlice<'a>>, Error> {
        let mut ro = readopts.cloned().unwrap_or_default();
        ro.set_snapshot(self);

        let key = key.as_ref();
        let key_ptr = key.as_ptr() as *const c_char;
        let key_len = key.len() as size_t;

        unsafe {
            let mut err: *mut ::libc::c_char = ::std::ptr::null_mut();
            let val = match cf {
                Some(cf) => ffi::rocksdb_get_pinned_cf(
                    self.db.handle(),
                    ro.handle(),
                    cf.handle(),
                    key_ptr,
                    key_len,
                    &mut err,
                ),
                None => ffi::rocksdb_get_pinned(
                    self.db.handle(),
                    ro.handle(),
                    key_ptr,
                    key_len,
                    &mut err,
                ),
            };

            if !err.is_null() {
                return Err(Error::new(ffi_util::error_message(err)));
            }

            if val.is_null() {
                Ok(None)
            } else {
                Ok(Some(DBPinnableSlice::from_c(val)))
            }
        }
    }
}

impl Drop for RocksDBSnapshot {
    fn drop(&mut self) {
        unsafe {
            ffi::rocksdb_release_snapshot(self.db.base_db_ptr(), self.inner);
        }
    }
}

impl Iterate for RocksDBSnapshot {
    fn get_raw_iter<'a: 'b, 'b>(&'a self, readopts: &ReadOptions) -> DBRawIterator<'b> {
        let mut ro = readopts.to_owned();
        ro.set_snapshot(self);
        self.db.get_raw_iter(&ro)
    }
}

impl IterateCF for RocksDBSnapshot {
    fn get_raw_iter_cf<'a: 'b, 'b>(
        &'a self,
        cf_handle: &ColumnFamily,
        readopts: &ReadOptions,
    ) -> Result<DBRawIterator<'b>, Error> {
        let mut ro = readopts.to_owned();
        ro.set_snapshot(self);
        self.db.get_raw_iter_cf(cf_handle, &ro)
    }
}
