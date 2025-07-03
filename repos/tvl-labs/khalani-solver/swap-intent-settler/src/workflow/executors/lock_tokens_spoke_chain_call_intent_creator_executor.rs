use crate::workflow::action::Action;
use crate::workflow::event::Event;
use anyhow::Result;
use artemis_core::types::{Collector, CollectorMap, Executor};
use async_trait::async_trait;
use intentbook_matchmaker::types::spoke_chain_call::SpokeChainCall;
use intentbook_matchmaker::types::swap_intent::SwapIntent;
use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;
use tokio::sync::mpsc::{channel, Sender};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LockTokensSpokeChainCallIntentCreatorHandlerResult {
    pub spoke_chain_call: SpokeChainCall,
}

#[async_trait]
pub trait LockTokensSpokeChainCallIntentCreatorHandler {
    async fn create_spoke_chain_call_intent(
        &self,
        swap_intent: SwapIntent,
    ) -> Result<LockTokensSpokeChainCallIntentCreatorHandlerResult>;
}

pub struct LockTokensSpokeChainCallIntentCreatorExecutor<
    H: LockTokensSpokeChainCallIntentCreatorHandler,
> {
    handler: H,
    confirmation_sender: Sender<LockTokensSpokeChainCallIntentCreatorHandlerResult>,
}

impl<H: LockTokensSpokeChainCallIntentCreatorHandler>
    LockTokensSpokeChainCallIntentCreatorExecutor<H>
{
    pub fn new(handler: H) -> (Self, Box<dyn Collector<Event>>) {
        let (confirmation_sender, confirmation_receiver) = channel(512);
        let fill_action_confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));
        let fill_action_confirmation_collector: Box<dyn Collector<Event>> = Box::new(
            CollectorMap::new(fill_action_confirmation_collector, |intent| {
                Event::CreatedSpokeChainCallToLockTokensOnSourceChain(intent)
            }),
        );
        (
            LockTokensSpokeChainCallIntentCreatorExecutor {
                handler,
                confirmation_sender,
            },
            fill_action_confirmation_collector,
        )
    }

    pub fn create_lock_tokens_intent(&self) {}
}

#[async_trait]
impl<H: LockTokensSpokeChainCallIntentCreatorHandler + Sync + Send> Executor<Action>
    for LockTokensSpokeChainCallIntentCreatorExecutor<H>
{
    async fn execute(&self, action: Action) -> Result<()> {
        if let Action::CreateSpokeChainCallIntentToLockSwapIntentTokensOnSourceChain(swap_intent) =
            action
        {
            let lock_intent_tokens_handler_result = self
                .handler
                .create_spoke_chain_call_intent(swap_intent)
                .await?;
            self.confirmation_sender
                .send(lock_intent_tokens_handler_result)
                .await?;
        }
        Ok(())
    }
}
