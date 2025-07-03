use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;

use intentbook_matchmaker::types::swap_intent_bid::SwapIntentBid;
use solver_common::connectors::Connector;

use crate::quote::quoted_swap_intent::QuotedSwapIntent;
use crate::workflow::executors::matched_swap_intent_bid_creator_executor::{
    MatchedSwapIntentBidCreatorHandler, MatchedSwapIntentBidCreatorHandlerResult,
};

pub struct MatchedSwapIntentBidCreatorHandlerImpl {
    connector: Arc<Connector>,
}

impl MatchedSwapIntentBidCreatorHandlerImpl {
    pub fn new(connector: Arc<Connector>) -> Self {
        Self { connector }
    }
}

#[async_trait]
impl MatchedSwapIntentBidCreatorHandler for MatchedSwapIntentBidCreatorHandlerImpl {
    async fn create_matched_bid(
        &self,
        quoted_swap_intent: QuotedSwapIntent,
    ) -> Result<MatchedSwapIntentBidCreatorHandlerResult> {
        let intent_id = quoted_swap_intent.swap_intent.intent_id;
        let address = self.connector.get_address();
        let destination_amount = quoted_swap_intent.destination_amount.base_units;
        Ok(MatchedSwapIntentBidCreatorHandlerResult {
            swap_intent: quoted_swap_intent.swap_intent,
            swap_intent_bid: SwapIntentBid::new(intent_id, address, destination_amount),
        })
    }
}
