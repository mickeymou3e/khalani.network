use crate::types::intent::Intent;
use crate::types::intent_bid::IntentBid;
use crate::workflow::action::Action;
use anyhow::Result;
use artemis_core::types::{Collector, Executor};
use async_trait::async_trait;
use ethers::types::TxHash;
use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;
use tokio::sync::mpsc::{channel, Sender};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MatchIntentHandlerResult {
    pub intent: Intent,
    pub intent_bid: IntentBid,
    pub matching_tx_hash: TxHash,
}

#[async_trait]
pub trait MatchIntentHandler {
    async fn match_intent(
        &self,
        intent: Intent,
        intent_bid: IntentBid,
    ) -> Result<MatchIntentHandlerResult>;
}

pub struct MatchIntentExecutor<H: MatchIntentHandler> {
    handler: H,
    confirmation_sender: Sender<MatchIntentHandlerResult>,
}

impl<H: MatchIntentHandler> MatchIntentExecutor<H> {
    pub fn new(handler: H) -> (Self, Box<dyn Collector<MatchIntentHandlerResult>>) {
        let (confirmation_sender, confirmation_receiver) = channel(512);
        let action_confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));
        (
            MatchIntentExecutor {
                handler,
                confirmation_sender,
            },
            action_confirmation_collector,
        )
    }
}

#[async_trait]
impl<H: MatchIntentHandler + Sync + Send> Executor<Action> for MatchIntentExecutor<H> {
    async fn execute(&self, action: Action) -> Result<()> {
        if let Action::MatchIntent(intent, intent_bid) = action {
            let match_intent_handler_result = self.handler.match_intent(intent, intent_bid).await?;
            self.confirmation_sender
                .send(match_intent_handler_result)
                .await?;
        }
        Ok(())
    }
}
