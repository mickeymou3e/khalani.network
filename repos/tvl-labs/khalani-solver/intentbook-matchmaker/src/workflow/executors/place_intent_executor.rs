use crate::types::intent::Intent;
use anyhow::Result;
use artemis_core::types::{Collector, Executor};
use async_trait::async_trait;
use ethers::types::TxHash;
use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;
use tokio::sync::mpsc::{channel, Receiver, Sender};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PlaceIntentHandlerResult {
    pub placed_intent: Intent,
    pub tx_hash: TxHash,
}

#[async_trait]
pub trait PlaceIntentHandler {
    async fn post_intent(&self, intent: Intent) -> Result<PlaceIntentHandlerResult>;
}

pub struct PlaceIntentExecutor<H: PlaceIntentHandler> {
    handler: H,
    confirmation_sender: Sender<PlaceIntentHandlerResult>,
}

impl<H: PlaceIntentHandler> PlaceIntentExecutor<H> {
    pub fn new(handler: H) -> (Self, Box<dyn Collector<PlaceIntentHandlerResult>>) {
        let (confirmation_sender, confirmation_receiver): (
            Sender<PlaceIntentHandlerResult>,
            Receiver<PlaceIntentHandlerResult>,
        ) = channel(512);
        let action_confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));
        (
            PlaceIntentExecutor {
                handler,
                confirmation_sender,
            },
            action_confirmation_collector,
        )
    }
}

#[async_trait]
impl<H: PlaceIntentHandler + Sync + Send> Executor<Intent> for PlaceIntentExecutor<H> {
    async fn execute(&self, intent: Intent) -> Result<()> {
        let place_intent_result = self.handler.post_intent(intent).await?;
        self.confirmation_sender.send(place_intent_result).await?;
        Ok(())
    }
}
