use std::sync::Arc;

use crate::workflow::action::Action;
use crate::workflow::event::Event;
use crate::workflow::strategies::intents_strategy::IntentsStrategy;

use crate::workflow::executors::call_spoke_executor::CallSpokeExecutor;
use crate::workflow::executors::ethereum::send_transaction_call_spoke_handler::SendTransactionCallSpokeHandler;
use crate::workflow::state::in_memory_state_manager::InMemoryStateManager;
use artemis_core::engine::Engine;
use artemis_core::types::{Collector, CollectorMap, ExecutorMap};

use futures::lock::Mutex;
use intentbook_matchmaker::types::intent::Intent;
use intentbook_matchmaker::types::intent_bid::IntentBid;
use intentbook_matchmaker::workflow::action::Action as MatchmakerAction;
use intentbook_matchmaker::workflow::collectors::ethereum::new_intentbook_source::NewIntentbookIntentSource;
use intentbook_matchmaker::workflow::collectors::new_intent_collector::NewIntentCollector;
use intentbook_matchmaker::workflow::event::Event as MatchmakerEvent;
use intentbook_matchmaker::workflow::executors::ethereum::send_transaction_match_intent_handler::SendTransactionMatchIntentHandler;
use intentbook_matchmaker::workflow::executors::match_intent_executor::MatchIntentExecutor;
use solver_common::config::addresses::IntentbookType;
use solver_common::config::Config;
use solver_common::connectors::Connector;
use solver_common::workflow::collector_filter_map::CollectorFilterMap;

pub fn configure_engine(
    config: &Config,
    connector: Arc<Connector>,
    state_manager: InMemoryStateManager,
) -> Engine<Event, Action> {
    // Set up SpokeChainCall specific intent source.
    let state_manager = Arc::new(Mutex::new(state_manager));

    let send_transaction_match_intent_handler =
        SendTransactionMatchIntentHandler::new(config.addresses.clone(), connector.clone());

    let call_spoke_handler =
        SendTransactionCallSpokeHandler::new(config.addresses.clone(), connector.clone());

    let mut engine = Engine::<Event, Action>::default();

    // Set up collectors.
    let new_intent_collector = NewIntentCollector::new(NewIntentbookIntentSource::new(
        connector.clone(),
        config
            .addresses
            .intentbook_addresses
            .spoke_chain_call_intentbook,
        IntentbookType::SpokeChainCallIntentBook,
    ));
    let new_intent_collector: Box<dyn Collector<Event>> = Box::new(CollectorFilterMap::new(
        Box::new(new_intent_collector),
        |event| match event {
            MatchmakerEvent::NewIntent(intent) => match &intent {
                Intent::SpokeChainCall(spoke_chain_call) => {
                    Some(Event::NewSpokeChainCall(spoke_chain_call.clone()))
                }
                Intent::LimitOrder(_) => None,
                Intent::SwapIntent(_) => None,
            },
            _ => None,
        },
    ));
    engine.add_collector(new_intent_collector);

    // Set up strategies.
    let intents_strategy = Box::new(IntentsStrategy::new(state_manager, connector.clone()));
    engine.add_strategy(intents_strategy);

    // Set up executors.
    let (call_spoke_executor, call_spoke_executor_confirmation_collector) =
        CallSpokeExecutor::new(call_spoke_handler);
    engine.add_executor(Box::new(call_spoke_executor));
    engine.add_collector(call_spoke_executor_confirmation_collector);

    let (match_intent_executor, match_intent_executor_collector) =
        MatchIntentExecutor::new(send_transaction_match_intent_handler);
    let match_intent_executor = Box::new(ExecutorMap::new(
        Box::new(match_intent_executor),
        |action| match action {
            Action::MatchIntent(spoke_chain_call, spoke_chain_call_bid) => {
                Some(MatchmakerAction::MatchIntent(
                    Intent::SpokeChainCall(spoke_chain_call),
                    IntentBid::SpokeChainCallBid(spoke_chain_call_bid),
                ))
            }
            _ => None,
        },
    ));
    let match_intent_executor_collector = Box::new(CollectorMap::new(
        match_intent_executor_collector,
        Event::IntentMatched,
    ));
    engine.add_executor(match_intent_executor);
    engine.add_collector(match_intent_executor_collector);

    engine
}
