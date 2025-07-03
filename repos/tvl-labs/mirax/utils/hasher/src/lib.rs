mod blake3;

pub use blake3::Blake3Hasher;

use mirax_primitive::H256;

/// The Mirax hash key derivation context.
pub const MIRAX_HASH_KEY: &str = "mirax-hash";

/// Hash digest trait.
pub trait Digest {
    /// Create new hasher instance. If the key is some, use the key as derive key.
    fn new(key: Option<&str>) -> Self;

    /// Process data, updating the internal state.
    fn update<T: AsRef<[u8]>>(&mut self, data: T);

    /// Retrieve result and consume hasher instance.
    fn finalize(self) -> H256;

    /// Digest the input data to a 32 bytes hash value.
    fn digest<T: AsRef<[u8]>>(data: T) -> H256;
}
