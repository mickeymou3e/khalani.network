use mirax_primitive::MiraxResult;
use serde::{de::DeserializeOwned, Serialize};

pub type TableName = &'static str;
pub type TableColumn = &'static str;

pub trait DBSchema {
    type Key: Serialize + DeserializeOwned;
    type Value: Serialize + DeserializeOwned;

    fn table_name() -> TableName;
    fn table_column() -> TableColumn;
}

pub trait DBRead {
    fn get<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<Option<S::Value>>;
}

pub trait DBWrite {
    fn put<S: DBSchema>(&self, key: &S::Key, val: &S::Value) -> MiraxResult<()>;

    fn delete<S: DBSchema>(&self, key: &S::Key) -> MiraxResult<()>;
}

pub trait DBSnap {
    fn snap(&self) -> MiraxResult<impl DBRead + Send + Sync>;
}

pub trait DBTransaction: Send + Sync + DBRead + DBWrite {
    fn commit(&self) -> MiraxResult<()>;

    fn rollback(&self) -> MiraxResult<()>;
}

pub trait DBStartTransaction: DBSnap {
    type Transaction: DBTransaction;

    fn begin_transaction(&self) -> MiraxResult<Self::Transaction>;
}
