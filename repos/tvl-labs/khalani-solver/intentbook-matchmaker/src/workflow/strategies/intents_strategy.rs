use anyhow::Result;
use artemis_core::types::Strategy;
use async_trait::async_trait;
use futures::lock::Mutex;
use std::sync::Arc;
use std::vec;
use tracing::{info, warn};

use crate::workflow::action::Action;
use crate::workflow::event::Event;
use crate::workflow::state::state_manager::StateManager;

pub struct IntentsStrategy<S: StateManager> {
    state_manager: Arc<Mutex<S>>,
}

impl<S> IntentsStrategy<S>
where
    S: StateManager + Sync + Send,
{
    pub fn new(state_manager: Arc<Mutex<S>>) -> Self {
        Self { state_manager }
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
            Event::NewIntent(intent) => {
                info!(?intent, "New intent");
                self.state_manager
                    .lock()
                    .await
                    .create_intent_state(intent.clone());
                Vec::default()
            }
            Event::NewMatchedIntent(intent_bid) => {
                let intent_id = intent_bid.intent_id();
                info!(?intent_id, "Intent matched");
                let intent = self
                    .state_manager
                    .lock()
                    .await
                    .update_intent_state(intent_id, |intent| {
                        intent.handle_match(intent_bid.clone())
                    });
                if intent.is_none() {
                    warn!(?intent_id, "Unknown intent ID")
                }
                Vec::default()
            }
            Event::NewProofReceived(intent_id, proof_id) => {
                info!(?intent_id, "New proof received");
                let mut state_mutex = self.state_manager.lock().await;
                let intent = state_mutex.update_intent_state(intent_id, |intent| {
                    intent.received_proofs.insert(proof_id);
                });

                if let Some(intent_state) = intent {
                    if intent_state.is_ready_to_settle() {
                        info!(?intent_id, "Intent ready to be settled");
                        return vec![Action::Settle(intent_state.intent)];
                    }
                } else {
                    warn!(?intent_id, "Unknown intent ID")
                }

                Vec::default()
            }
            Event::IntentSettled(settle_intent_handler_result) => {
                info!(?settle_intent_handler_result, "Intent settled");
                Vec::default()
            }
        };
    }
}
