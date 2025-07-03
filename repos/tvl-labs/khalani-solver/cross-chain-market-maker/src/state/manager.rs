use solver_common::types::intent_id::IntentId;

use crate::state::IntentState;

/// The limit order book state manager trait.
pub trait StateManager {
    /// Create a new limit order state and returns the limit order hash.
    fn create_order_state(&mut self, intent_state: IntentState) -> IntentId;

    /// Update the limit order state and returns the old limit order state.
    fn update_state(
        &mut self,
        intent_id: IntentId,
        intent_state: IntentState,
    ) -> Option<IntentState>;

    /// Update the limit order state with the given updater and returns the old limit order state.
    fn update_state_with<F>(&mut self, intent_id: &IntentId, updater: F) -> Option<IntentState>
    where
        F: FnOnce(&mut IntentState);

    /// Remove the limit order state with the given limit order hash.
    fn remove(&mut self, intent_id: &IntentId) -> Option<IntentState>;

    /// Get the limit order state with the given limit order hash.
    fn get_state(&self, intent_id: &IntentId) -> Option<&IntentState>;

    /// Get all limit order states.
    fn get_all_states(&self) -> Vec<IntentState>;
}
