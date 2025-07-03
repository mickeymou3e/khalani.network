pub mod in_memory;
pub mod manager;

use intentbook_matchmaker::types::limit_order_intent::LimitOrderIntent;
use solver_common::types::intent_id::IntentId;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum LimitOrderIntentState {
    Pending,
    Confirmed,
    Cancelled,
}

#[cfg(test)]
impl LimitOrderIntentState {
    pub fn is_confirmed(&self) -> bool {
        matches!(self, Self::Confirmed)
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct IntentState {
    pub intent: LimitOrderIntent,
    pub state: LimitOrderIntentState,
}

impl IntentState {
    pub fn new(intent: LimitOrderIntent) -> Self {
        Self {
            intent,
            state: LimitOrderIntentState::Pending,
        }
    }

    pub fn intent_id(&self) -> IntentId {
        self.intent.intent_id
    }
}
