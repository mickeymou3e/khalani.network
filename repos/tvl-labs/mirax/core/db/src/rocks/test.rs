use tempfile::tempdir;

use crate::rocks::RocksDatabase;
use crate::traits::{
    DBRead, DBSchema, DBSnap, DBStartTransaction, DBTransaction, DBWrite, TableColumn, TableName,
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
fn test_database() {
    let tmp_dir = tempdir().unwrap();
    let db = RocksDatabase::open(tmp_dir, vec!["c0".to_string()]).unwrap();

    db.put::<TestSchema>(&"hello".to_owned(), &"world".to_owned())
        .unwrap();
    let saved = db.get::<TestSchema>(&"hello".to_owned()).unwrap();
    assert_eq!(saved, Some("world".to_owned()));
}

#[test]
fn test_database_snap() {
    let tmp_dir = tempdir().unwrap();
    let db = RocksDatabase::open(tmp_dir, vec!["c0".to_string()]).unwrap();

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
fn test_database_transaction() {
    let tmp_dir = tempdir().unwrap();
    let db = RocksDatabase::open(tmp_dir, vec!["c0".to_string()]).unwrap();

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
