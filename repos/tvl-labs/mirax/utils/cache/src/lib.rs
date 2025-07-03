pub use quick_cache;

/// A LRU cache wrapped in parking_lot Mutex.
pub type SyncSchnellruCache<K, V> = parking_lot::Mutex<schnellru::LruMap<K, V>>;
/// A LRU cache wrapped in async_lock Mutex.
pub type AsyncSchnellruCache<K, V> = async_lock::Mutex<schnellru::LruMap<K, V>>;
