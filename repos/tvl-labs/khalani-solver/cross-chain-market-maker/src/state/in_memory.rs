use std::collections::HashMap;

use ethers::types::H256;
use solver_common::types::intent_id::IntentId;

use crate::state::{manager::StateManager, IntentState};

/// The in-memory state manager which stores a `HashMap` with order hash as key and
/// order data as value.
#[derive(Default, Clone, Debug)]
pub struct InMemoryStateManager {
    // Todo: refactor with multi-index-map
    intents: HashMap<IntentId, IntentState>,
}

impl InMemoryStateManager {
    pub fn new() -> Self {
        Self {
            intents: HashMap::new(),
        }
    }

    #[cfg(test)]
    pub fn inner(&self) -> HashMap<IntentId, IntentState> {
        self.intents.clone()
    }
}

impl StateManager for InMemoryStateManager {
    fn create_order_state(&mut self, intent: IntentState) -> H256 {
        let intent_id = intent.intent_id();
        self.intents.insert(intent_id, intent);
        intent_id
    }

    fn update_state(&mut self, intent_id: H256, intent_state: IntentState) -> Option<IntentState> {
        self.intents.insert(intent_id, intent_state)
    }

    fn update_state_with<F>(&mut self, intent_id: &H256, updater: F) -> Option<IntentState>
    where
        F: FnOnce(&mut IntentState),
    {
        self.intents.get_mut(intent_id).map(|intent_state| {
            updater(intent_state);
            intent_state.clone()
        })
    }

    fn remove(&mut self, intent_id: &H256) -> Option<IntentState> {
        self.intents.remove(intent_id)
    }

    fn get_state(&self, intent_id: &H256) -> Option<&IntentState> {
        self.intents.get(intent_id)
    }

    fn get_all_states(&self) -> Vec<IntentState> {
        self.intents.values().cloned().collect()
    }
}
