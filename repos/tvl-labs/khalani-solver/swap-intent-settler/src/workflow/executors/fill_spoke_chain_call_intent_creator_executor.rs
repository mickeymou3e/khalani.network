use anyhow::Result;
use artemis_core::types::{Collector, CollectorMap, Executor};
use async_trait::async_trait;
use intentbook_matchmaker::types::spoke_chain_call::SpokeChainCall;
use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;
use tokio::sync::mpsc::{channel, Sender};

use crate::quote::quoted_swap_intent::QuotedSwapIntent;
use crate::workflow::action::Action;
use crate::workflow::event::Event;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FillSpokeChainCallIntentCreatorHandlerResult {
    pub spoke_chain_call: SpokeChainCall,
}

#[async_trait]
pub trait FillSpokeChainCallIntentCreatorHandler {
    async fn create_swap_intent_filler(
        &self,
        quoted_intent: QuotedSwapIntent,
    ) -> Result<FillSpokeChainCallIntentCreatorHandlerResult>;
}

pub struct FillSpokeChainCallIntentCreatorExecutor<H: FillSpokeChainCallIntentCreatorHandler> {
    handler: H,
    confirmation_sender: Sender<FillSpokeChainCallIntentCreatorHandlerResult>,
}

impl<H: FillSpokeChainCallIntentCreatorHandler> FillSpokeChainCallIntentCreatorExecutor<H> {
    pub fn new(handler: H) -> (Self, Box<dyn Collector<Event>>) {
        let (confirmation_sender, confirmation_receiver) = channel(512);
        let fill_action_confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));
        let fill_action_confirmation_collector: Box<dyn Collector<Event>> =
            Box::new(CollectorMap::new(fill_action_confirmation_collector, |e| {
                Event::CreatedSpokeChainCallIntentToFillSwapIntentOnDestinationChain(e)
            }));
        (
            FillSpokeChainCallIntentCreatorExecutor {
                handler,
                confirmation_sender,
            },
            fill_action_confirmation_collector,
        )
    }
}

#[async_trait]
impl<H: FillSpokeChainCallIntentCreatorHandler + Sync + Send> Executor<Action>
    for FillSpokeChainCallIntentCreatorExecutor<H>
{
    async fn execute(&self, action: Action) -> Result<()> {
        if let Action::CreateSpokeChainCallIntentToFillSwapIntentOnDestinationChain(quoted_intent) =
            action
        {
            let filler_handler_result = self
                .handler
                .create_swap_intent_filler(quoted_intent)
                .await?;
            self.confirmation_sender.send(filler_handler_result).await?;
        }
        return Ok(());
    }
}
