use mirax_primitive::H256;
use once_cell::sync::Lazy;

use crate::{Digest, MIRAX_HASH_KEY};

/// The BLAKE3 hash output on an empty input.
pub const BLANK_HASH: H256 = H256::new([
    104, 20, 39, 134, 241, 196, 207, 124, 101, 56, 219, 115, 149, 234, 198, 250, 36, 148, 1, 25,
    226, 45, 220, 121, 105, 179, 76, 114, 84, 103, 27, 142,
]);

static HASHER: Lazy<blake3::Hasher> = Lazy::new(|| blake3::Hasher::new_derive_key(MIRAX_HASH_KEY));

/// The BLAKE3 hash function handle.
pub struct Blake3Hasher(blake3::Hasher);

impl Digest for Blake3Hasher {
    fn new(key: Option<&str>) -> Self {
        if let Some(k) = key {
            return Blake3Hasher(blake3::Hasher::new_derive_key(k));
        }

        Blake3Hasher(blake3::Hasher::new())
    }

    fn update<T: AsRef<[u8]>>(&mut self, data: T) {
        self.0.update(data.as_ref());
    }

    fn finalize(self) -> H256 {
        self.0.finalize().as_bytes().into()
    }

    /// The `digest` function always use the `MIRAX_HASH_KEY` as derive key.
    fn digest<T: AsRef<[u8]>>(input: T) -> H256 {
        if input.as_ref().is_empty() {
            return BLANK_HASH;
        }

        let mut hasher = HASHER.clone();
        hasher.update(input.as_ref());
        hasher.finalize().as_bytes().into()
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashSet;

    use super::*;

    #[test]
    fn test_blake3() {
        let src = H256::random().to_vec();
        let set = (0..10)
            .map(|_| Blake3Hasher::digest(&src))
            .collect::<HashSet<_>>();
        assert_eq!(set.len(), 1);
    }

    #[test]
    fn test_blank_blake3_hash() {
        assert_eq!(BLANK_HASH, Blake3Hasher::digest([]));
    }
}
