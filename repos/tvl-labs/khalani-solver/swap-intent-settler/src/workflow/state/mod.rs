use intentbook_matchmaker::types::swap_intent::SwapIntent;
use solver_common::types::intent_id::IntentId;

use crate::quote::quoted_swap_intent::QuotedSwapIntent;

pub mod in_memory_state_manager;
pub mod state_manager;

#[derive(Debug, Clone)]
pub struct IntentState {
    pub intent_id: IntentId,
    pub swap_intent: SwapIntent,
    pub quoted_intent: Option<QuotedSwapIntent>,
    pub is_matched: bool,
}

impl IntentState {
    pub fn new(swap_intent: SwapIntent) -> Self {
        IntentState {
            intent_id: swap_intent.intent_id,
            swap_intent,
            quoted_intent: None,
            is_matched: false,
        }
    }

    pub fn get_intent_id(&self) -> IntentId {
        self.intent_id
    }
}
