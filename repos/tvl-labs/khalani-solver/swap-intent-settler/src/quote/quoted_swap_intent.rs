use intentbook_matchmaker::types::swap_intent::SwapIntent;
use solver_common::inventory::amount::Amount;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct QuotedSwapIntent {
    pub swap_intent: SwapIntent,
    pub destination_amount: Amount,
}
