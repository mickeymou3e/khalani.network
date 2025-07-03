mod timer;

pub use timer::{PinnedSleep, Timer};

use std::time::{SystemTime, UNIX_EPOCH};

/// Get the current system time as milliseconds.
pub fn system_time_as_millis() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64
}
