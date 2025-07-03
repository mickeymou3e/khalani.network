use intentbook_matchmaker::types::limit_order_intent::LimitOrderIntent;
use solver_common::types::intent_id::IntentId;

/// Core Action enum.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Action {
    /// Place the limit orders.
    PlaceLimitOrders(Vec<LimitOrderIntent>),
    /// Cancel the limit orders by hashes.
    CancelLimitOrders(Vec<IntentId>),
}

#[cfg(test)]
impl Action {
    pub fn place_orders(&self) -> Vec<LimitOrderIntent> {
        match self {
            Action::PlaceLimitOrders(limit_orders) => limit_orders.clone(),
            _ => panic!("Not a PlaceLimitOrders action"),
        }
    }

    pub fn cancel_orders(&self) -> Vec<IntentId> {
        match self {
            Action::CancelLimitOrders(hashes) => hashes.clone(),
            _ => panic!("Not a CancelLimitOrders action"),
        }
    }
}
