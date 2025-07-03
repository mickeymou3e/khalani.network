pub mod rocks;

use mirax_primitive::MiraxResult;
use std::path::Path;

type IteratorItem = (Box<[u8]>, Box<[u8]>);

pub enum IteratorDirection {
    Forward,
    Reverse,
}

#[allow(dead_code)]
pub trait Store {
    type Batch: BatchStore;
    type Opts;

    fn new<P>(opts: &Self::Opts, path: P) -> Self
    where
        P: AsRef<Path>;

    fn default_options() -> Self::Opts;

    fn get<K: AsRef<[u8]>>(&self, key: K) -> MiraxResult<Option<Vec<u8>>>;

    fn exists<K: AsRef<[u8]>>(&self, key: K) -> MiraxResult<bool>;

    fn iter<K: AsRef<[u8]>>(
        &self,
        from_key: K,
        direction: IteratorDirection,
    ) -> MiraxResult<Box<dyn Iterator<Item = IteratorItem> + '_>>;

    fn batch(&self) -> MiraxResult<Self::Batch>;
}

pub trait BatchStore {
    fn put_kv<K: Into<Vec<u8>>, V: Into<Vec<u8>>>(&mut self, key: K, value: V) -> MiraxResult<()> {
        self.put(Into::<Vec<u8>>::into(key), Into::<Vec<u8>>::into(value))
    }

    fn put<K: AsRef<[u8]>, V: AsRef<[u8]>>(&mut self, key: K, value: V) -> MiraxResult<()>;

    fn delete<K: AsRef<[u8]>>(&mut self, key: K) -> MiraxResult<()>;

    fn commit(self) -> MiraxResult<()>;
}
