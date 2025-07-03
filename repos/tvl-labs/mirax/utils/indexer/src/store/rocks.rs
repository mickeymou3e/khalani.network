use std::path::Path;
use std::sync::Arc;

use rocksdb::{prelude::*, Direction, IteratorMode, WriteBatch, DB};

use mirax_primitive::MiraxResult;

use crate::error::IndexerError;
use crate::store::{BatchStore, IteratorDirection, IteratorItem, Store};

#[derive(Clone)]
pub(crate) struct RocksdbStore {
    db: Arc<DB>,
}

impl Store for RocksdbStore {
    type Batch = RocksdbBatch;
    type Opts = Options;

    fn new<P>(opts: &Options, path: P) -> Self
    where
        P: AsRef<Path>,
    {
        let db = Arc::new(DB::open(opts, path.as_ref()).expect("Failed to open rocksdb"));
        Self { db }
    }

    fn default_options() -> Self::Opts {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts
    }

    fn get<K: AsRef<[u8]>>(&self, key: K) -> MiraxResult<Option<Vec<u8>>> {
        let ret = self
            .db
            .get(key.as_ref())
            .map(|v| v.map(|vi| vi.to_vec()))
            .map_err(IndexerError::from)?;
        Ok(ret)
    }

    fn exists<K: AsRef<[u8]>>(&self, key: K) -> MiraxResult<bool> {
        let ret = self
            .db
            .get(key.as_ref())
            .map(|v| v.is_some())
            .map_err(IndexerError::from)?;
        Ok(ret)
    }

    fn iter<K: AsRef<[u8]>>(
        &self,
        from_key: K,
        mode: IteratorDirection,
    ) -> MiraxResult<Box<dyn Iterator<Item = IteratorItem> + '_>> {
        let mode = IteratorMode::From(
            from_key.as_ref(),
            match mode {
                IteratorDirection::Forward => Direction::Forward,
                IteratorDirection::Reverse => Direction::Reverse,
            },
        );
        Ok(Box::new(self.db.iterator(mode)) as Box<_>)
    }

    fn batch(&self) -> MiraxResult<Self::Batch> {
        Ok(Self::Batch {
            db: Arc::clone(&self.db),
            wb: WriteBatch::default(),
        })
    }
}

pub(crate) struct RocksdbBatch {
    db: Arc<DB>,
    wb: WriteBatch,
}

impl BatchStore for RocksdbBatch {
    fn put<K: AsRef<[u8]>, V: AsRef<[u8]>>(&mut self, key: K, value: V) -> MiraxResult<()> {
        self.wb.put(key, value).map_err(IndexerError::from)?;
        Ok(())
    }

    fn delete<K: AsRef<[u8]>>(&mut self, key: K) -> MiraxResult<()> {
        self.wb.delete(key.as_ref()).map_err(IndexerError::from)?;
        Ok(())
    }

    fn commit(self) -> MiraxResult<()> {
        self.db.write(&self.wb).map_err(IndexerError::from)?;
        Ok(())
    }
}

impl RocksdbStore {
    #[allow(dead_code)]
    pub fn inner(&self) -> &DB {
        &self.db
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn put_and_get() {
        let tmp_dir = tempfile::Builder::new()
            .prefix("put_and_get")
            .tempdir()
            .unwrap();
        let store = RocksdbStore::new(
            &RocksdbStore::default_options(),
            tmp_dir.path().to_str().unwrap(),
        );
        let mut batch = store.batch().unwrap();
        batch.put([0, 0], [0, 0, 0]).unwrap();
        batch.put([1, 1], [1, 1, 1]).unwrap();
        batch.commit().unwrap();

        assert_eq!(Some(vec![0, 0, 0]), store.get([0, 0]).unwrap());
        assert_eq!(Some(vec![1, 1, 1]), store.get([1, 1]).unwrap());
        assert_eq!(None, store.get([2, 2]).unwrap());
    }

    #[test]
    fn exists() {
        let tmp_dir = tempfile::Builder::new().prefix("exists").tempdir().unwrap();
        let store = RocksdbStore::new(
            &RocksdbStore::default_options(),
            tmp_dir.path().to_str().unwrap(),
        );
        assert!(!store.exists([0, 0]).unwrap());

        let mut batch = store.batch().unwrap();
        batch.put([0, 0], [0, 0, 0]).unwrap();
        batch.commit().unwrap();

        assert!(store.exists([0, 0]).unwrap());
    }

    #[test]
    fn delete() {
        let tmp_dir = tempfile::Builder::new().prefix("delete").tempdir().unwrap();
        let store = RocksdbStore::new(
            &RocksdbStore::default_options(),
            tmp_dir.path().to_str().unwrap(),
        );
        let mut batch = store.batch().unwrap();
        batch.put([0, 0], [0, 0, 0]).unwrap();
        batch.commit().unwrap();
        assert_eq!(Some(vec![0, 0, 0]), store.get([0, 0]).unwrap());

        let mut batch = store.batch().unwrap();
        batch.delete([0, 0]).unwrap();
        batch.commit().unwrap();
        assert_eq!(None, store.get([0, 0]).unwrap());
    }

    #[test]
    fn iter() {
        let tmp_dir = tempfile::Builder::new().prefix("iter").tempdir().unwrap();
        let store = RocksdbStore::new(
            &RocksdbStore::default_options(),
            tmp_dir.path().to_str().unwrap(),
        );
        let mut batch = store.batch().unwrap();
        batch.put([0, 0, 0], [0, 0, 0]).unwrap();
        batch.put([0, 0, 1], [0, 0, 1]).unwrap();
        batch.put([1, 0, 0], [1, 0, 0]).unwrap();
        batch.put([1, 0, 1], [1, 0, 1]).unwrap();
        batch.put([2, 0, 0, 1], [2, 0, 0, 1]).unwrap();
        batch.put([2, 0, 1, 1], [2, 0, 1, 1]).unwrap();
        batch.put([2, 0, 2, 1], [2, 0, 2, 1]).unwrap();
        batch.commit().unwrap();

        let mut iter = store.iter([0, 0, 1], IteratorDirection::Forward).unwrap();
        assert_eq!(
            Some((vec![0, 0, 1], vec![0, 0, 1])),
            iter.next().map(|i| (i.0.to_vec(), i.1.to_vec()))
        );
        assert_eq!(
            Some((vec![1, 0, 0], vec![1, 0, 0])),
            iter.next().map(|i| (i.0.to_vec(), i.1.to_vec()))
        );

        let mut iter = store.iter([0, 0, 1], IteratorDirection::Reverse).unwrap();
        assert_eq!(
            Some((vec![0, 0, 1], vec![0, 0, 1])),
            iter.next().map(|i| (i.0.to_vec(), i.1.to_vec()))
        );
        assert_eq!(
            Some((vec![0, 0, 0], vec![0, 0, 0])),
            iter.next().map(|i| (i.0.to_vec(), i.1.to_vec()))
        );
        assert!(iter.next().is_none());

        let mut iter = store.iter([2, 0, 1], IteratorDirection::Reverse).unwrap();
        assert_eq!(
            Some((vec![2, 0, 0, 1], vec![2, 0, 0, 1])),
            iter.next().map(|i| (i.0.to_vec(), i.1.to_vec()))
        );
    }
}
