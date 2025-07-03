use once_cell::sync::Lazy;
use serde::Serialize;

use crate::H256;

const MIRAX_HASH_KEY: &str = "mirax-hash";
static HASHER: Lazy<blake3::Hasher> = Lazy::new(|| blake3::Hasher::new_derive_key(MIRAX_HASH_KEY));

pub fn mirax_hasher() -> blake3::Hasher {
    HASHER.clone()
}

pub fn mirax_hash(data: &[u8]) -> H256 {
    let mut hasher = mirax_hasher();
    hasher.update(data);
    hasher.finalize().as_bytes().into()
}

/// Calculate the (mirax-keyed blake3) hash of the object serialized with bcs.
pub fn mirax_hash_bcs<T: Serialize + ?Sized>(t: &T) -> Result<H256, bcs::Error> {
    let mut hasher = mirax_hasher();
    bcs::serialize_into(&mut hasher, t)?;
    Ok(hasher.finalize().as_bytes().into())
}
