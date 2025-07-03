use crate::types::intent::Intent;
use crate::types::intent_bid::IntentBid;

/// Core Action enum.
#[derive(Debug, Clone)]
pub enum Action {
    MatchIntent(Intent, IntentBid),
    Settle(Intent),
}
