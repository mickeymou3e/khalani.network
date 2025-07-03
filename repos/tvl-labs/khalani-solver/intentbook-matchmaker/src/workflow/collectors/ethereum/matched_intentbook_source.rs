use std::sync::Arc;

use anyhow::Result;
use artemis_core::types::CollectorStream;
use async_trait::async_trait;
use bindings_khalani::base_intent_book::BaseIntentBook;
use bindings_khalani::base_intent_book::IntentMatchFilter;
use ethers::contract::Event as ContractEvent;
use ethers::types::{Address, ValueOrArray};
use solver_common::config::addresses::IntentbookType;

use crate::types::intent_bid::IntentBid;
use crate::workflow::collectors::matched_intent_collector::MatchedIntentsSource;
use solver_common::config::chain::ChainId;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::event_indexer::{EventFetcher, EventSource};
use solver_common::types::intent_id::{IntentBidId, IntentId, WithIntentIdAndBidId};

#[derive(Debug, Clone)]
pub struct MatchedIntentbookIntentSource {
    rpc_client: Arc<RpcClient>,
    intentbook: BaseIntentBook<RpcClient>,
    intentbook_type: IntentbookType,
}

impl MatchedIntentbookIntentSource {
    pub fn new(
        connector: Arc<Connector>,
        intentbook_address: Address,
        intentbook_type: IntentbookType,
    ) -> Self {
        let rpc_client = connector.get_rpc_client(ChainId::Khalani).unwrap();
        let intentbook = BaseIntentBook::new(intentbook_address, rpc_client.clone());

        Self {
            rpc_client,
            intentbook,
            intentbook_type,
        }
    }
}

#[async_trait]
impl EventSource for MatchedIntentbookIntentSource {
    type EventFilter = IntentMatchFilter;
    type EventResult = IntentBid;

    fn create_event_filter(&self) -> ContractEvent<Arc<RpcClient>, RpcClient, Self::EventFilter> {
        self.intentbook
            .intent_match_filter()
            .address(ValueOrArray::Value(self.intentbook.address()))
    }

    fn parse_event(&self, event: Self::EventFilter) -> Option<Result<Self::EventResult>> {
        let intent_id: IntentId = event.intent_id.into();
        let intent_bid_id: IntentBidId = event.intent_bid_id.into();
        let with_intent_id: WithIntentIdAndBidId<bindings_khalani::base_intent_book::IntentBid> =
            (intent_id, intent_bid_id, event.intent_bid);

        match self.intentbook_type {
            IntentbookType::LimitOrderIntentBook => None, // TODO: parse limit order intents.
            IntentbookType::SpokeChainCallIntentBook => {
                if let Ok(spoke_chain_call_bid) = with_intent_id.clone().try_into() {
                    Some(Ok(IntentBid::SpokeChainCallBid(spoke_chain_call_bid)))
                } else {
                    None
                }
            }
            IntentbookType::SwapIntentIntentBook => {
                if let Ok(swap_intent_bid) = with_intent_id.clone().try_into() {
                    Some(Ok(IntentBid::SwapIntentBid(swap_intent_bid)))
                } else {
                    None
                }
            }
        }
    }
}

#[async_trait]
impl MatchedIntentsSource for MatchedIntentbookIntentSource {
    async fn get_matched_intents_source(&self) -> Result<CollectorStream<'_, IntentBid>> {
        let event_fetcher = EventFetcher::new(
            format!("Intentbook (Matched) {}", self.intentbook.address()),
            self.rpc_client.clone(),
            self.clone(),
        );
        event_fetcher.fetch_events().await
    }
}
