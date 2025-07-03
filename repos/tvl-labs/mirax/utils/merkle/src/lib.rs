pub mod binary;
pub mod mmr;

use mirax_hasher::{Blake3Hasher, Digest as _};
use mirax_primitive::H256;

fn blake3_merge<T: AsRef<[u8]>>(left: T, right: T) -> H256 {
    let mut hasher = Blake3Hasher::new(None);
    hasher.update(left);
    hasher.update(right);
    hasher.finalize()
}
