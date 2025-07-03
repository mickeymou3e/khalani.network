use std::sync::Arc;
use std::vec;

use anyhow::Result;
use artemis_core::types::Strategy;
use async_trait::async_trait;
use futures::lock::Mutex;
use tracing::{error, info};

use intentbook_matchmaker::types::intent::Intent;

use crate::quote::intent_quoter::IntentQuoter;
use crate::workflow::action::Action;
use crate::workflow::event::Event;
use crate::workflow::state::state_manager::StateManager;

pub struct IntentsStrategy<S: StateManager, Q: IntentQuoter> {
    state_manager: Arc<Mutex<S>>,
    intent_quoter: Q,
}

impl<S, Q> IntentsStrategy<S, Q>
where
    S: StateManager + Sync + Send,
    Q: IntentQuoter + Sync + Send,
{
    pub fn new(state_manager: Arc<Mutex<S>>, intent_quoter: Q) -> Self {
        Self {
            state_manager,
            intent_quoter,
        }
    }
}

#[async_trait]
impl<S, Q> Strategy<Event, Action> for IntentsStrategy<S, Q>
where
    S: StateManager + Sync + Send,
    Q: IntentQuoter + Sync + Send,
{
    async fn sync_state(&mut self) -> Result<()> {
        info!("Syncing state");
        Ok(())
    }

    async fn process_event(&mut self, event: Event) -> Vec<Action> {
        return match event {
            Event::NewSwapIntent(swap_intent) => {
                info!(?swap_intent, "Received new swap intent");
                self.state_manager
                    .lock()
                    .await
                    .create_intent_state(swap_intent.clone());
                info!(?swap_intent, "Quoting the swap intent");
                match self.intent_quoter.quote_intent(swap_intent.clone()).await {
                    Ok(quoted_intent) => {
                        return self.process_event(Event::IntentQuoted(quoted_intent)).await;
                    }
                    Err(e) => {
                        error!(?swap_intent, ?e, "Failed to quote the swap intent");
                    }
                }
                vec![]
            }
            Event::IntentQuoted(quoted_intent) => {
                info!(?quoted_intent, "Intent is quoted");
                self.state_manager
                    .lock()
                    .await
                    .update_intent_state(quoted_intent.clone().swap_intent.intent_id, |intent| {
                        intent.quoted_intent = Some(quoted_intent.clone())
                    });
                vec![Action::CreateMatchedBid(quoted_intent)]
            }
            Event::CreatedMatchedIntentBid(result) => {
                info!(?result, "Created matched intent bid");
                vec![Action::MatchSwapIntent(
                    result.swap_intent,
                    result.swap_intent_bid,
                )]
            }
            Event::IntentMatched(match_result) => {
                info!(?match_result, "SwapIntent is matched, creating sub intents");
                let intent_id = match_result.intent.id();
                let intent_state =
                    self.state_manager
                        .lock()
                        .await
                        .update_intent_state(intent_id, |intent| {
                            intent.is_matched = true;
                        });
                if let Some(intent_state) = intent_state {
                    if let Some(quoted_intent) = intent_state.quoted_intent {
                        return vec![
                            Action::CreateSpokeChainCallIntentToLockSwapIntentTokensOnSourceChain(
                                quoted_intent.clone().swap_intent,
                            ),
                            Action::CreateSpokeChainCallIntentToFillSwapIntentOnDestinationChain(
                                quoted_intent,
                            ),
                        ];
                    }
                }
                vec![]
            }
            Event::CreatedSpokeChainCallToLockTokensOnSourceChain(result) => {
                info!(
                    ?result,
                    "Created SpokeChainCall intent to lock tokens in the Escrow on the source chain, now placing it into the SpokeChainCall intentbook"
                );
                vec![Action::PlaceIntent(Intent::SpokeChainCall(
                    result.spoke_chain_call,
                ))]
            }
            Event::CreatedSpokeChainCallIntentToFillSwapIntentOnDestinationChain(result) => {
                info!(
                    ?result,
                    "Created SpokeChainCall intent to fill SwapIntent on destination chain, now placing it into the SpokeChainCall intentbook"
                );
                vec![Action::PlaceIntent(Intent::SpokeChainCall(
                    result.spoke_chain_call,
                ))]
            }
            Event::IntentPlaced(place_intent_result) => {
                info!(?place_intent_result, "Intent placed");
                Vec::default()
            }
        };
    }
}
