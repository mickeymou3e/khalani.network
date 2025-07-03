use std::time::Duration;

pub const BROADCAST_RETRY_INTERVAL: Duration = Duration::from_millis(300);
pub const MAX_PROPOSE_INTERVAL: Duration = Duration::from_millis(3_000);
pub const MIN_PROPOSE_INTERVAL: Duration = Duration::from_millis(1_000);
pub(crate) const CHANNEL_CAPACITY: usize = 50;
pub(crate) const COMMIT_NUMBER_STEP: u64 = 2;

pub const TRANSACTION_BATCH_TOPIC_ID: u8 = 100;
pub const TRANSACTION_BATCH_TOPIC: &str = "transaction_batch";
pub const CHUNK_VOTE_TOPIC_ID: u8 = 101;
pub const CHUNK_VOTE_TOPIC: &str = "chunk_vote";
pub const CERTIFICATE_TOPIC_ID: u8 = 102;
pub const CERTIFICATE_TOPIC: &str = "certificate";
pub const TRANSACTION_CHUNK_TOPIC_ID: u8 = 103;
pub const TRANSACTION_CHUNK_TOPIC: &str = "transaction_chunk";
pub const SYNC_BLOCK_TOPIC_ID: u8 = 104;
pub const SYNC_BLOCK_TOPIC: &str = "sync_block";
