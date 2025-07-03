use ethers::types::U256;

use solver_common::types::intent_id::IntentId;

/// Core Event enum.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Event {
    Init,
    LimitOrderConfirm(Vec<IntentId>),
    TakeLimitOrders(Vec<TakeLimitOrderInfo>),
    CancelOrdersConfirm(Vec<IntentId>),
}

/// The take limit order intent information
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TakeLimitOrderInfo {
    /// The intent id of the limit order intent.
    pub intent_id: IntentId,
    /// If the fill volume is `None`, the order if full filled. Otherwise, the order is
    /// partial filled with the inner amount.
    pub fill_volume: Option<U256>,
}

impl TakeLimitOrderInfo {
    pub fn is_full_filled(&self) -> bool {
        self.fill_volume.is_none()
    }

    pub fn unchecked_get_partial_fill_volume(&self) -> U256 {
        self.fill_volume.unwrap()
    }
}
