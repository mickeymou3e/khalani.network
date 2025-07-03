use std::sync::Arc;

use anyhow::Result;
use artemis_core::types::CollectorStream;
use async_trait::async_trait;
use ethers::contract::Event as ContractEvent;
use ethers::types::ValueOrArray;

use bindings_khalani::limit_order_intent_book::{LimitOrderIntentBook, LimitOrderIntentBookEvents};
use solver_common::config::{addresses::IntentbookAddresses, chain::ChainId};
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::event_indexer::{EventFetcher, EventSource};
use solver_common::inventory::Inventory;

use crate::collectors::limit_order_collector::LimitOrderSource;
use crate::event::{Event, TakeLimitOrderInfo};

#[derive(Debug, Clone)]
pub struct LimitOrderBookSource {
    rpc_client: Arc<RpcClient>,
    _inventory: Arc<Inventory>,
    limit_order_intentbook: LimitOrderIntentBook<RpcClient>,
}

impl LimitOrderBookSource {
    pub fn new(
        connector: Arc<Connector>,
        _inventory: Arc<Inventory>,
        intentbook_addresses: IntentbookAddresses,
    ) -> Self {
        let rpc_client = connector.get_rpc_client(ChainId::Khalani).unwrap();
        let limit_order_intentbook = LimitOrderIntentBook::new(
            intentbook_addresses.limit_order_intentbook,
            rpc_client.clone(),
        );

        Self {
            rpc_client,
            _inventory,
            limit_order_intentbook,
        }
    }
}

#[async_trait]
impl EventSource for LimitOrderBookSource {
    type EventFilter = LimitOrderIntentBookEvents;

    type EventResult = Event;

    fn create_event_filter(&self) -> ContractEvent<Arc<RpcClient>, RpcClient, Self::EventFilter> {
        self.limit_order_intentbook
            .events()
            .address(ValueOrArray::Value(self.limit_order_intentbook.address()))
    }

    fn parse_event(&self, event: Self::EventFilter) -> Option<Result<Self::EventResult>> {
        match event {
            LimitOrderIntentBookEvents::IntentCreatedFilter(filter) => {
                Some(Ok(Event::LimitOrderConfirm(vec![filter.intent_id.into()])))
            }

            LimitOrderIntentBookEvents::IntentCancelledFilter(filter) => {
                Some(Ok(Event::CancelOrdersConfirm(vec![filter
                    .intent_id
                    .into()])))
            }

            LimitOrderIntentBookEvents::LimitOrderFulfilledFilter(filter) => {
                Some(Ok(Event::TakeLimitOrders(vec![TakeLimitOrderInfo {
                    intent_id: filter.intent_id.into(),
                    fill_volume: None,
                }])))
            }

            LimitOrderIntentBookEvents::LimitOrderPartialFillFilter(filter) => {
                Some(Ok(Event::TakeLimitOrders(vec![TakeLimitOrderInfo {
                    intent_id: filter.intent_id.into(),
                    fill_volume: Some(filter.volume_filled),
                }])))
            }

            _ => None,
        }
    }
}

#[async_trait]
impl LimitOrderSource for LimitOrderBookSource {
    async fn get_new_limit_order_intents_stream(&self) -> Result<CollectorStream<'_, Event>> {
        let event_fetcher = EventFetcher::new(
            String::from("CrossChainOrderBook"),
            self.rpc_client.clone(),
            self.clone(),
        );

        event_fetcher.fetch_events().await
    }
}
