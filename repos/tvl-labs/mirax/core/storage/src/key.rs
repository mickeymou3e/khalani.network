use mirax_hasher::{Blake3Hasher, Digest as _};
use mirax_types::H256;
use once_cell::sync::Lazy;

pub static METADATA_KEY: Lazy<H256> = Lazy::new(|| Blake3Hasher::digest("metadata_key"));
pub static LATEST_BLOCK_KEY: Lazy<H256> = Lazy::new(|| Blake3Hasher::digest("latest_block_key"));
pub static CONSENSUS_STATUS_KEY: Lazy<H256> =
    Lazy::new(|| Blake3Hasher::digest("consensus_status_key"));
