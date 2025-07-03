use anyhow::Result;
use artemis_core::types::{Collector, Executor};
use async_trait::async_trait;
use ethers::prelude::TxHash;
use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;
use tokio::sync::mpsc::{channel, Receiver, Sender};

use crate::types::intent::Intent;
use crate::workflow::action::Action;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SettleIntentHandlerResult {
    pub settled_intent: Intent,
    pub settlement_tx_hash: TxHash,
}

#[async_trait]
pub trait SettleIntentHandler {
    async fn process_settle_intent(&self, intent: Intent) -> Result<SettleIntentHandlerResult>;
}

pub struct SettleIntentExecutor<H: SettleIntentHandler> {
    handler: H,
    confirmation_sender: Sender<SettleIntentHandlerResult>,
}

impl<H: SettleIntentHandler> SettleIntentExecutor<H> {
    pub fn new(handler: H) -> (Self, Box<dyn Collector<SettleIntentHandlerResult>>) {
        let (confirmation_sender, confirmation_receiver): (
            Sender<SettleIntentHandlerResult>,
            Receiver<SettleIntentHandlerResult>,
        ) = channel(512);
        let action_confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));
        (
            SettleIntentExecutor {
                handler,
                confirmation_sender,
            },
            action_confirmation_collector,
        )
    }
}

#[async_trait]
impl<H: SettleIntentHandler + Send + Sync> Executor<Action> for SettleIntentExecutor<H> {
    async fn execute(&self, action: Action) -> Result<()> {
        match action {
            Action::Settle(intent) => {
                let settle_intent_handler_result =
                    self.handler.process_settle_intent(intent).await?;
                self.confirmation_sender
                    .send(settle_intent_handler_result)
                    .await?;
                Ok(())
            }
            _ => Ok(()),
        }
    }
}
