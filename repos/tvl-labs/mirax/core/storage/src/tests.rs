use mirax_db::mem::MemDatabase;
use mirax_db::rocks::RocksDatabase;
use mirax_storage_traits::Storage;
use mirax_types::BlockEnvelope;
use tempfile::tempdir;

use crate::{db_cols, StorageImpl, COLUMNS_NUMBER};

#[test]
fn test_db_cols() {
    let cols = db_cols();
    assert_eq!(cols.len(), COLUMNS_NUMBER);
}

#[tokio::test]
async fn test_with_memory_db() {
    let storage = StorageImpl::new(MemDatabase::default());
    inner_test(storage).await;
}

#[tokio::test]
async fn test_with_rocks_db() {
    let storage = StorageImpl::new(RocksDatabase::open(tempdir().unwrap(), db_cols()).unwrap());
    inner_test(storage).await;
}

async fn inner_test<S: Storage>(storage: S) {
    let block = BlockEnvelope::random();
    storage.insert_new_block(block.clone()).await.unwrap();
    assert!(storage
        .get_block_header_by_number(&(block.header.block_number + 1))
        .await
        .unwrap()
        .is_none());
    assert_eq!(
        storage
            .get_block_header_by_number(&block.header.block_number)
            .await
            .unwrap()
            .unwrap(),
        block.header
    );
    assert_eq!(
        storage
            .get_block_header_by_hash(&block.header.calc_hash())
            .await
            .unwrap()
            .unwrap(),
        block.header
    );
}
