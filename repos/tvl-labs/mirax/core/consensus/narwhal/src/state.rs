use std::fmt::{Debug, Formatter, Result};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

use serde::{Deserialize, Serialize};

use mirax_types::BlockNumber;

#[derive(Serialize, Deserialize, Default, Clone, Debug)]
pub struct ConsensusState {
    inner: Arc<InnerState>,
}

impl ConsensusState {
    pub fn init(
        block_number: BlockNumber,
        last_commit_number: BlockNumber,
        latest_gc_number: BlockNumber,
    ) -> Self {
        Self {
            inner: Arc::new(InnerState {
                block_number: AtomicU64::new(block_number),
                latest_commit_number: AtomicU64::new(last_commit_number),
                latest_gc_number: AtomicU64::new(latest_gc_number),
            }),
        }
    }

    pub fn block_number(&self) -> BlockNumber {
        self.inner.block_number.load(Ordering::Acquire)
    }

    pub fn latest_commit_number(&self) -> BlockNumber {
        self.inner.latest_commit_number.load(Ordering::Acquire)
    }

    pub fn latest_gc_number(&self) -> BlockNumber {
        self.inner.latest_gc_number.load(Ordering::Acquire)
    }

    pub fn new_block_number(&self, new: BlockNumber) {
        self.inner.block_number.swap(new, Ordering::Release);
    }

    pub fn new_latest_commit_number(&self, new: BlockNumber) {
        self.inner.latest_commit_number.swap(new, Ordering::Release);
    }

    pub fn new_latest_gc_number(&self, new: BlockNumber) {
        self.inner.latest_gc_number.swap(new, Ordering::Release);
    }
}

#[derive(Serialize, Deserialize, Default)]
struct InnerState {
    block_number: AtomicU64,
    latest_commit_number: AtomicU64,
    latest_gc_number: AtomicU64,
}

impl Debug for InnerState {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_struct("InnerState")
            .field("block_number", &self.block_number.load(Ordering::Acquire))
            .field(
                "latest_commit_number",
                &self.latest_commit_number.load(Ordering::Acquire),
            )
            .field(
                "latest_gc_number",
                &self.latest_gc_number.load(Ordering::Acquire),
            )
            .finish()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_state_sync() {
        let state = ConsensusState::default();
        let state_clone = state.clone();

        state.new_block_number(10);
        state.new_latest_commit_number(5);
        state.new_latest_gc_number(3);

        assert_eq!(state_clone.block_number(), 10);
        assert_eq!(state_clone.latest_commit_number(), 5);
        assert_eq!(state_clone.latest_gc_number(), 3);
        assert_eq!(state.block_number(), state_clone.block_number());
        assert_eq!(state.latest_gc_number(), state_clone.latest_gc_number());
        assert_eq!(
            state.latest_commit_number(),
            state_clone.latest_commit_number()
        );
    }
}
