use std::sync::Arc;

use anyhow::Result;
use artemis_core::types::CollectorStream;
use async_trait::async_trait;
use bindings_khalani::base_intent_book::{BaseIntentBook, IntentCreatedFilter};
use ethers::contract::Event as ContractEvent;
use ethers::types::{Address, ValueOrArray};
use solver_common::config::addresses::IntentbookType;

use crate::types::intent::Intent;
use solver_common::config::chain::ChainId;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::event_indexer::{EventFetcher, EventSource};

use crate::workflow::collectors::new_intent_collector::NewIntentSource;
use solver_common::types::intent_id::{IntentId, WithIntentId};

#[derive(Debug, Clone)]
pub struct NewIntentbookIntentSource {
    rpc_client: Arc<RpcClient>,
    intentbook: BaseIntentBook<RpcClient>,
    intentbook_address: Address,
    intentbook_type: IntentbookType,
}

impl NewIntentbookIntentSource {
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
            intentbook_address,
            intentbook_type,
        }
    }
}

#[async_trait]
impl EventSource for NewIntentbookIntentSource {
    type EventFilter = IntentCreatedFilter;
    type EventResult = Intent;

    fn create_event_filter(&self) -> ContractEvent<Arc<RpcClient>, RpcClient, Self::EventFilter> {
        self.intentbook
            .intent_created_filter()
            .address(ValueOrArray::Value(self.intentbook_address))
    }

    fn parse_event(&self, event: Self::EventFilter) -> Option<Result<Self::EventResult>> {
        let intent_id: IntentId = event.intent_id.into();
        let with_intent_id: WithIntentId<bindings_khalani::base_intent_book::Intent> =
            (intent_id, event.intent);

        match self.intentbook_type {
            IntentbookType::LimitOrderIntentBook => None, // TODO: parse limit order intents.
            IntentbookType::SpokeChainCallIntentBook => {
                if let Ok(spoke_chain_caller) = with_intent_id.clone().try_into() {
                    Some(Ok(Intent::SpokeChainCall(spoke_chain_caller)))
                } else {
                    None
                }
            }
            IntentbookType::SwapIntentIntentBook => {
                if let Ok(swap_intent) = with_intent_id.clone().try_into() {
                    Some(Ok(Intent::SwapIntent(swap_intent)))
                } else {
                    None
                }
            }
        }
    }
}

#[async_trait]
impl NewIntentSource for NewIntentbookIntentSource {
    async fn get_new_intent_source(&self) -> Result<CollectorStream<'_, Intent>> {
        let event_fetcher = EventFetcher::new(
            format!("Intentbook (New) {}", self.intentbook_address),
            self.rpc_client.clone(),
            self.clone(),
        );
        event_fetcher.fetch_events().await
    }
}
