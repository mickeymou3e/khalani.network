use std::{
    ops::DerefMut,
    sync::{Arc, RwLock},
};

use im::HashMap;

use mirax_codec::{Bcs, BinaryCodec};
use mirax_primitive::{Bytes, MiraxResult};

use crate::{
    error::DBError,
    traits::{DBRead, DBSchema, DBSnap, DBStartTransaction, DBTransaction, DBWrite},
};

#[derive(Default, Clone)]
pub struct MemDatabase {
    inner: Arc<RwLock<HashMap<&'static str, HashMap<Bytes, Bytes>>>>,
}

impl DBRead for MemDatabase {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>> {
        let k = Bcs::<S::Key>::encode(key)?;

        let v = {
            let db = self.inner.read().map_err(DBError::from)?;
            let table = match db.get(S::table_name()) {
                Some(table) => table,
                None => return Ok(None),
            };

            table.get(&k).cloned()
        };

        match v {
            Some(v) => Ok(Some(Bcs::<S::Value>::decode(v.as_ref())?)),
            None => Ok(None),
        }
    }
}

impl DBWrite for MemDatabase {
    fn put<S: DBSchema>(&self, key: &S::Key, val: &S::Value) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;
        let v = Bcs::<S::Value>::encode(val)?;

        {
            let mut db = self.inner.write().map_err(DBError::from)?;
            let _ = db.entry(S::table_name()).or_default().insert(k, v);
        }

        Ok(())
    }

    fn delete<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;

        {
            let mut db = self.inner.write().map_err(DBError::from)?;
            let _ = db.entry(S::table_name()).or_default().remove(&k);
        }

        Ok(())
    }
}

impl DBSnap for MemDatabase {
    #[allow(refining_impl_trait)]
    fn snap(&self) -> MiraxResult<MemSnapshot> {
        Ok(MemSnapshot {
            inner: self.inner.read().map_err(DBError::from)?.clone(),
        })
    }
}

impl DBStartTransaction for MemDatabase {
    type Transaction = MemTransaction;

    fn begin_transaction(&self) -> MiraxResult<Self::Transaction> {
        Ok(MemTransaction {
            inner: self.clone(),
            tx: Default::default(),
        })
    }
}

pub struct MemSnapshot {
    inner: HashMap<&'static str, HashMap<Bytes, Bytes>>,
}

impl DBRead for MemSnapshot {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>> {
        let k = Bcs::<S::Key>::encode(key)?;

        let table = match self.inner.get(S::table_name()) {
            Some(table) => table,
            None => return Ok(None),
        };

        let v = table.get(&k);

        match v {
            Some(v) => Ok(Some(Bcs::<S::Value>::decode(v.as_ref())?)),
            None => Ok(None),
        }
    }
}

pub struct MemTransaction {
    inner: MemDatabase,
    tx: RwLock<HashMap<&'static str, HashMap<Bytes, Bytes>>>,
}

impl DBRead for MemTransaction {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>> {
        if let Some(tx_table) = { self.tx.read().map_err(DBError::from)?.get(S::table_name()) } {
            let k = Bcs::<S::Key>::encode(key)?;
            if let Some(v) = tx_table.get(&k) {
                return Ok(Some(Bcs::<S::Value>::decode(v.as_ref())?));
            }
        }

        self.inner.get::<S>(key)
    }
}

impl DBWrite for MemTransaction {
    fn put<S: DBSchema>(&self, key: &S::Key, val: &S::Value) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;
        let v = Bcs::<S::Value>::encode(val)?;

        let mut table_mut = self.tx.write().map_err(DBError::from)?;
        let _e = table_mut.entry(S::table_name()).or_default().insert(k, v);

        Ok(())
    }

    fn delete<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<()> {
        let k = Bcs::<S::Key>::encode(key)?;

        let mut table_mut = self.tx.write().map_err(DBError::from)?;
        let _e = table_mut.entry(S::table_name()).or_default().remove(&k);

        Ok(())
    }
}

impl DBTransaction for MemTransaction {
    fn commit(&self) -> MiraxResult<()> {
        let mut tx = HashMap::default();
        {
            let mut tx_ref = self.tx.write().map_err(DBError::from)?;
            let mut_ref = tx_ref.deref_mut();
            std::mem::swap(&mut tx, mut_ref);
        }

        let mut db = self.inner.inner.write().map_err(DBError::from)?;
        db.extend(tx);
        Ok(())
    }

    fn rollback(&self) -> MiraxResult<()> {
        self.tx.write().map_err(DBError::from)?.clear();
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use crate::mem::MemDatabase;
    use crate::traits::{
        DBRead, DBSchema, DBSnap, DBStartTransaction, DBTransaction, DBWrite, TableColumn,
        TableName,
    };

    struct TestSchema {}
    impl DBSchema for TestSchema {
        type Key = String;
        type Value = String;

        fn table_column() -> TableColumn {
            "c0"
        }

        fn table_name() -> TableName {
            "test"
        }
    }

    #[test]
    fn test_mem_database() {
        let db = MemDatabase::default();

        db.put::<TestSchema>(&"hello".to_owned(), &"world".to_owned())
            .unwrap();
        let saved = db.get::<TestSchema>(&"hello".to_owned()).unwrap();
        assert_eq!(saved, Some("world".to_owned()));
    }

    #[test]
    fn test_mem_database_snap() {
        let db = MemDatabase::default();

        db.put::<TestSchema>(&"hello".to_owned(), &"world".to_owned())
            .unwrap();

        let snap = db.snap().unwrap();

        db.put::<TestSchema>(&"new key".to_owned(), &"new val".to_owned())
            .unwrap();
        let new_val = db.get::<TestSchema>(&"new key".to_owned()).unwrap();
        assert_eq!(new_val, Some("new val".to_owned()));

        let snap_world = snap.get::<TestSchema>(&"hello".to_owned()).unwrap();
        assert_eq!(snap_world, Some("world".to_owned()));

        let snap_none_new_val = snap.get::<TestSchema>(&"new key".to_owned()).unwrap();
        assert_eq!(snap_none_new_val, None);
    }

    #[test]
    fn test_mem_database_transaction() {
        let db = MemDatabase::default();

        {
            let tx = db.begin_transaction().unwrap();
            tx.put::<TestSchema>(&"hello".to_owned(), &"world".to_owned())
                .unwrap();

            let none_world = db.get::<TestSchema>(&"hello".to_owned()).unwrap();
            assert_eq!(none_world, None);

            let tx_world = tx.get::<TestSchema>(&"hello".to_owned()).unwrap();
            assert_eq!(tx_world, Some("world".to_owned()));

            tx.commit().unwrap();

            let db_world = db.get::<TestSchema>(&"hello".to_owned()).unwrap();
            assert_eq!(db_world, Some("world".to_owned()));
        }
    }
}
