use mirax_codec::MAX_BCS_RECURSION_DEPTH;
use mirax_hasher::MIRAX_HASH_KEY;
use mirax_primitive::H256;
use serde::Serialize;

/// Calculate the (mirax-keyed blake3) hash of the object serialized with bcs.
pub fn mirax_hash_bcs<T: Serialize + ?Sized>(t: &T) -> Result<H256, bcs::Error> {
    // The mirax-codec and mirax-hasher crates won't allow this, so we are using
    // the underlying crates directly.
    let mut hasher = blake3::Hasher::new_derive_key(MIRAX_HASH_KEY);
    bcs::serialize_into_with_limit(&mut hasher, t, MAX_BCS_RECURSION_DEPTH)?;
    Ok(hasher.finalize().as_bytes().into())
}
