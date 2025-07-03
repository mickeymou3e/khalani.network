use crate::quote::quoted_swap_intent::QuotedSwapIntent;
use crate::workflow::action::Action;
use crate::workflow::event::Event;
use anyhow::Result;
use artemis_core::types::{Collector, CollectorMap, Executor};
use async_trait::async_trait;
use intentbook_matchmaker::types::swap_intent::SwapIntent;
use intentbook_matchmaker::types::swap_intent_bid::SwapIntentBid;
use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;
use tokio::sync::mpsc::{channel, Sender};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MatchedSwapIntentBidCreatorHandlerResult {
    pub swap_intent: SwapIntent,
    pub swap_intent_bid: SwapIntentBid,
}

#[async_trait]
pub trait MatchedSwapIntentBidCreatorHandler {
    async fn create_matched_bid(
        &self,
        quoted_swap_intent: QuotedSwapIntent,
    ) -> Result<MatchedSwapIntentBidCreatorHandlerResult>;
}

pub struct MatchedSwapIntentBidCreatorExecutor<H: MatchedSwapIntentBidCreatorHandler> {
    handler: H,
    confirmation_sender: Sender<MatchedSwapIntentBidCreatorHandlerResult>,
}

impl<H: MatchedSwapIntentBidCreatorHandler> MatchedSwapIntentBidCreatorExecutor<H> {
    pub fn new(handler: H) -> (Self, Box<dyn Collector<Event>>) {
        let (confirmation_sender, confirmation_receiver) = channel(512);
        let confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));
        let confirmation_collector: Box<dyn Collector<Event>> =
            Box::new(CollectorMap::new(confirmation_collector, |intent| {
                Event::CreatedMatchedIntentBid(intent)
            }));
        (
            MatchedSwapIntentBidCreatorExecutor {
                handler,
                confirmation_sender,
            },
            confirmation_collector,
        )
    }

    pub fn create_lock_tokens_intent(&self) {}
}

#[async_trait]
impl<H: MatchedSwapIntentBidCreatorHandler + Sync + Send> Executor<Action>
    for MatchedSwapIntentBidCreatorExecutor<H>
{
    async fn execute(&self, action: Action) -> Result<()> {
        if let Action::CreateMatchedBid(quoted_swap_intent) = action {
            let matched_handler_result =
                self.handler.create_matched_bid(quoted_swap_intent).await?;
            self.confirmation_sender
                .send(matched_handler_result)
                .await?;
        }
        Ok(())
    }
}
