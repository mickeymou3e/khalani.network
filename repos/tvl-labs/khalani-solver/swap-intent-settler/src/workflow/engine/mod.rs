use std::sync::Arc;

use artemis_core::engine::Engine;
use artemis_core::types::{CollectorMap, ExecutorMap};
use futures::lock::Mutex;
use intentbook_matchmaker::types::intent::Intent;
use intentbook_matchmaker::types::intent_bid::IntentBid;

use crate::quote::one_to_one_intent_quoter::OneToOneIntentQuoter;
use crate::workflow::action::Action;
use crate::workflow::event::Event;
use crate::workflow::executors::ethereum::fill_spoke_chain_call_intent_creator_handler::FillSpokeChainCallIntentCreatorHandlerImpl;
use crate::workflow::executors::ethereum::lock_tokens_spoke_chain_call_intent_creator_handler::LockTokensSpokeChainCallIntentCreatorHandlerImpl;
use crate::workflow::executors::ethereum::matched_swap_intent_bid_creator_handler_impl::MatchedSwapIntentBidCreatorHandlerImpl;
use crate::workflow::executors::fill_spoke_chain_call_intent_creator_executor::FillSpokeChainCallIntentCreatorExecutor;
use crate::workflow::executors::lock_tokens_spoke_chain_call_intent_creator_executor::LockTokensSpokeChainCallIntentCreatorExecutor;
use crate::workflow::executors::matched_swap_intent_bid_creator_executor::MatchedSwapIntentBidCreatorExecutor;
use crate::workflow::state::in_memory_state_manager::InMemoryStateManager;
use crate::workflow::strategies::intents_strategy::IntentsStrategy;
use intentbook_matchmaker::workflow::action::Action as MatchmakerAction;
use intentbook_matchmaker::workflow::collectors::ethereum::new_intentbook_source::NewIntentbookIntentSource;
use intentbook_matchmaker::workflow::collectors::new_intent_collector::NewIntentCollector;
use intentbook_matchmaker::workflow::executors::ethereum::send_transaction_match_intent_handler::SendTransactionMatchIntentHandler;
use intentbook_matchmaker::workflow::executors::ethereum::send_transaction_place_intent_handler::SendTransactionPlaceIntentHandler;
use intentbook_matchmaker::workflow::executors::match_intent_executor::MatchIntentExecutor;
use intentbook_matchmaker::workflow::executors::place_intent_executor::PlaceIntentExecutor;
use solver_common::config::addresses::IntentbookType;
use solver_common::config::Config;
use solver_common::connectors::Connector;
use solver_common::inventory::Inventory;
use solver_common::workflow::collector_filter_map::CollectorFilterMap;

pub fn configure_engine(
    config: &Config,
    state_manager: InMemoryStateManager,
    connector: Arc<Connector>,
    inventory: Arc<Inventory>,
) -> Engine<Event, Action> {
    // Set up Ethereum specific clients.
    let intent_quoter = OneToOneIntentQuoter::new(inventory.clone());

    let state_manager = Arc::new(Mutex::new(state_manager));

    let mut engine = Engine::<Event, Action>::default();

    // Set up collectors.
    let new_intentbook_source = NewIntentbookIntentSource::new(
        connector.clone(),
        config.addresses.intentbook_addresses.swap_intent_intentbook,
        IntentbookType::SwapIntentIntentBook,
    );
    let new_intent_collector = Box::new(NewIntentCollector::new(new_intentbook_source));
    let new_intent_collector = Box::new(CollectorFilterMap::new(new_intent_collector, |event| {
        if let intentbook_matchmaker::workflow::event::Event::NewIntent(Intent::SwapIntent(
            intent,
        )) = event
        {
            Some(Event::NewSwapIntent(intent))
        } else {
            None
        }
    }));
    engine.add_collector(new_intent_collector);

    // Set up strategies.
    let intents_strategy = Box::new(IntentsStrategy::new(state_manager.clone(), intent_quoter));
    engine.add_strategy(intents_strategy);

    // Set up executors.
    let (
        matched_swap_intent_bid_creator_executor,
        matched_swap_intent_bid_creator_executor_collector,
    ) = MatchedSwapIntentBidCreatorExecutor::new(MatchedSwapIntentBidCreatorHandlerImpl::new(
        connector.clone(),
    ));
    engine.add_executor(Box::new(matched_swap_intent_bid_creator_executor));
    engine.add_collector(matched_swap_intent_bid_creator_executor_collector);

    let send_transaction_match_intent_handler =
        SendTransactionMatchIntentHandler::new(config.addresses.clone(), connector.clone());
    let (match_intent_executor, match_intent_confirmation_collector) =
        MatchIntentExecutor::new(send_transaction_match_intent_handler);

    engine.add_executor(Box::new(ExecutorMap::new(
        Box::new(match_intent_executor),
        |action| match action {
            Action::MatchSwapIntent(intent, swap_intent_bid) => {
                Some(MatchmakerAction::MatchIntent(
                    Intent::SwapIntent(intent),
                    IntentBid::SwapIntentBid(swap_intent_bid),
                ))
            }
            _ => None,
        },
    )));
    engine.add_collector(Box::new(CollectorMap::new(
        match_intent_confirmation_collector,
        Event::IntentMatched,
    )));

    let place_intent_handler = SendTransactionPlaceIntentHandler::new(
        config.addresses.intentbook_addresses.clone(),
        connector.clone(),
    );
    let (place_intent_executor, place_intent_confirmation_collector) =
        PlaceIntentExecutor::new(place_intent_handler);
    engine.add_executor(Box::new(ExecutorMap::new(
        Box::new(place_intent_executor),
        |action| match action {
            Action::PlaceIntent(intent) => Some(intent),
            _ => None,
        },
    )));
    let place_intent_confirmation_collector = Box::new(CollectorMap::new(
        place_intent_confirmation_collector,
        Event::IntentPlaced,
    ));
    engine.add_collector(place_intent_confirmation_collector);

    let (
        lock_tokens_spoke_chain_call_intent_creator_executor,
        lock_tokens_spoke_chain_call_intent_creator_executor_result_collector,
    ) = LockTokensSpokeChainCallIntentCreatorExecutor::new(
        LockTokensSpokeChainCallIntentCreatorHandlerImpl::new(
            config.addresses.clone(),
            connector.clone(),
            inventory.clone(),
        ),
    );
    engine.add_executor(Box::new(
        lock_tokens_spoke_chain_call_intent_creator_executor,
    ));
    engine.add_collector(lock_tokens_spoke_chain_call_intent_creator_executor_result_collector);

    let (
        fill_spoke_chain_call_intent_creator_executor,
        fill_spoke_chain_call_intent_creator_executor_result,
    ) = FillSpokeChainCallIntentCreatorExecutor::new(
        FillSpokeChainCallIntentCreatorHandlerImpl::new(
            config.addresses.clone(),
            connector.clone(),
            inventory.clone(),
        ),
    );
    engine.add_executor(Box::new(fill_spoke_chain_call_intent_creator_executor));
    engine.add_collector(fill_spoke_chain_call_intent_creator_executor_result);

    engine
}
