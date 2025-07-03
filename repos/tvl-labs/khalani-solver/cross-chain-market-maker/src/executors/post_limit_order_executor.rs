use anyhow::Result;
use artemis_core::types::{Collector, CollectorMap, Executor};
use async_trait::async_trait;
use ethers::types::{TxHash, H256};
use intentbook_matchmaker::types::limit_order_intent::LimitOrderIntent;
use tokio::sync::mpsc::{channel, Sender};

use solver_common::workflow::action_confirmation_collector::ActionConfirmationCollector;

use crate::{action::Action, event::Event};

const POST_LIMIT_ORDER_BUFFER_SIZE: usize = 512;

/// The result of the post limit order by the handler.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PostLimitOrderHandlerResult {
    /// The original limit order executed action.
    pub limit_order_action: Action,
    /// The post transaction hash.
    pub limit_order_post_tx_hash: TxHash,
}

/// The post limit order handler trait.
#[async_trait]
pub trait PostLimitOrderHandler {
    /// Build and submit the post limit order transaction and return the transaction hash which
    /// included in the result.
    async fn post_limit_orders(
        &self,
        limit_orders: Vec<LimitOrderIntent>,
    ) -> Result<PostLimitOrderHandlerResult>;

    /// Build the cancel limit order transaction with th given hashes and return the transaction hash
    /// which included in the result.
    async fn cancel_limit_orders(&self, hashes: Vec<H256>) -> Result<PostLimitOrderHandlerResult>;
}

/// The post limit order executor.
pub struct PostLimitOrderExecutor<H: PostLimitOrderHandler> {
    handler: H,
    _confirmation_sender: Sender<PostLimitOrderHandlerResult>,
}

impl<H: PostLimitOrderHandler> PostLimitOrderExecutor<H> {
    /// Create a new post limit order executor.
    pub fn new(handler: H) -> (Self, Box<dyn Collector<Event>>) {
        let (_confirmation_sender, confirmation_receiver) =
            channel::<PostLimitOrderHandlerResult>(POST_LIMIT_ORDER_BUFFER_SIZE);
        _confirmation_sender
            .try_send(PostLimitOrderHandlerResult {
                limit_order_action: Action::PlaceLimitOrders(vec![]),
                limit_order_post_tx_hash: H256::zero(),
            })
            .unwrap();
        let fill_action_confirmation_collector =
            Box::new(ActionConfirmationCollector::new(confirmation_receiver));

        let fill_action_confirmation_collector: Box<dyn Collector<Event>> =
            Box::new(CollectorMap::new(
                fill_action_confirmation_collector,
                |handler_result: PostLimitOrderHandlerResult| {
                    if handler_result.limit_order_post_tx_hash.is_zero() {
                        Event::Init
                    } else {
                        unreachable!()
                    }
                },
            ));

        (
            PostLimitOrderExecutor {
                handler,
                _confirmation_sender,
            },
            fill_action_confirmation_collector,
        )
    }
}

#[async_trait]
impl<H: PostLimitOrderHandler + Sync + Send> Executor<Action> for PostLimitOrderExecutor<H> {
    async fn execute(&self, action: Action) -> Result<()> {
        match action {
            Action::PlaceLimitOrders(orders) => {
                let _res = self.handler.post_limit_orders(orders).await?;
            }
            Action::CancelLimitOrders(hashes) => {
                let _res = self.handler.cancel_limit_orders(hashes).await?;
            }
        }

        Ok(())
    }
}
