use std::sync::Arc;

use artemis_core::engine::Engine;
use futures::lock::Mutex;

use solver_common::config::chain::ChainId;
use solver_common::config::Config;
use solver_common::connectors::Connector;
use solver_common::inventory::token_balance_query::TokenBalanceQuery;
use solver_common::inventory::Inventory;

use crate::action::Action;
use crate::collectors::{
    limit_order_collector::LimitOrderCollector, order_book_source::LimitOrderBookSource,
};
use crate::event::Event;
use crate::executors::post_limit_order_executor::PostLimitOrderExecutor;
use crate::executors::send_transaction_limit_order_handler::SendTransactionPostLimitOrderHandler;
use crate::state::in_memory::InMemoryStateManager;
use crate::strategy::CCMMStrategy;

pub async fn configure_engine(
    config: &Config,
    state_manager: InMemoryStateManager,
    connector: Arc<Connector>,
    inventory: Arc<Inventory>,
) -> Engine<Event, Action> {
    let ccmm_address = config.ccmm.address;
    let base_token = inventory
        .find_token_by_address(config.ccmm.base_token, ChainId::Khalani)
        .cloned()
        .unwrap();
    let quote_token = inventory
        .find_token_by_address(config.ccmm.quote_token, ChainId::Khalani)
        .cloned()
        .unwrap();
    let base_token_balance = inventory
        .get_balance(&base_token, ccmm_address)
        .await
        .unwrap();
    let quote_token_balance = inventory
        .get_balance(&quote_token, ccmm_address)
        .await
        .unwrap();

    let intents_mempool_source = LimitOrderBookSource::new(
        Arc::clone(&connector),
        inventory,
        config.addresses.intentbook_addresses.clone(),
    );

    let state_manager = Arc::new(Mutex::new(state_manager));

    let mut engine = Engine::<Event, Action>::default();

    // Set up collectors.
    let intents_collector = Box::new(LimitOrderCollector::new(intents_mempool_source));
    engine.add_collector(intents_collector);

    // Set up strategies.
    let signer = connector
        .get_rpc_client(ChainId::Khalani)
        .unwrap()
        .signer()
        .clone();
    let intents_strategy = Box::new(CCMMStrategy::new(
        ccmm_address,
        signer,
        state_manager.clone(),
        base_token,
        base_token_balance,
        quote_token,
        quote_token_balance,
    ));
    engine.add_strategy(intents_strategy);

    // Set up executors.
    let limit_order_intent_handler =
        SendTransactionPostLimitOrderHandler::new(config.addresses.clone(), connector);
    let (limit_order_executor, event_collector) =
        PostLimitOrderExecutor::new(limit_order_intent_handler);
    engine.add_executor(Box::new(limit_order_executor));
    engine.add_collector(event_collector);

    engine
}
