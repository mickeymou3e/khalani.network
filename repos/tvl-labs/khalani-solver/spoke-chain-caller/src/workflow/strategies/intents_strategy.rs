use std::sync::Arc;
use std::vec;

use anyhow::Result;
use artemis_core::types::Strategy;
use async_trait::async_trait;
use futures::lock::Mutex;
use intentbook_matchmaker::types::intent::Intent;
use intentbook_matchmaker::types::spoke_chain_call_bid::SpokeChainCallBid;
use solver_common::connectors::Connector;
use tracing::info;

use crate::workflow::action::Action;
use crate::workflow::event::Event;
use crate::workflow::state::state_manager::StateManager;

pub struct IntentsStrategy<S: StateManager> {
    state_manager: Arc<Mutex<S>>,
    connector: Arc<Connector>,
}

impl<S> IntentsStrategy<S>
where
    S: StateManager + Sync + Send,
{
    pub fn new(state_manager: Arc<Mutex<S>>, connector: Arc<Connector>) -> Self {
        Self {
            state_manager,
            connector,
        }
    }
}

#[async_trait]
impl<S> Strategy<Event, Action> for IntentsStrategy<S>
where
    S: StateManager + Sync + Send,
{
    async fn sync_state(&mut self) -> Result<()> {
        info!("Syncing state");
        Ok(())
    }

    async fn process_event(&mut self, event: Event) -> Vec<Action> {
        return match event {
            Event::NewSpokeChainCall(spoke_chain_call) => {
                info!(?spoke_chain_call, "New Spoke Chain Call intent");
                self.state_manager
                    .lock()
                    .await
                    .create_intent_state(spoke_chain_call.clone());

                let spoke_chain_call_bid = SpokeChainCallBid::new(
                    spoke_chain_call.intent_id,
                    self.connector.get_address(),
                );
                vec![Action::MatchIntent(spoke_chain_call, spoke_chain_call_bid)]
            }
            Event::IntentMatched(match_intent_handler_result) => {
                info!(?match_intent_handler_result, "Spoke Chain Call matched");
                if let Intent::SpokeChainCall(spoke_chain_call) = match_intent_handler_result.intent
                {
                    vec![Action::CallSpoke(spoke_chain_call)]
                } else {
                    vec![]
                }
            }
            Event::CallSpokeConfirmed(call_spoke_handler_result) => {
                info!(?call_spoke_handler_result, "Spoke Chain Call confirmed");
                vec![]
            }
        };
    }
}
