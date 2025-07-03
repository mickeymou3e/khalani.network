use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use bindings_khalani::limit_order_intent_book::LimitOrderIntentBook;
use ethers::contract::ContractCall;
use ethers::types::H256;
use intentbook_matchmaker::types::limit_order_intent::LimitOrderIntent;
use tracing::info;

use solver_common::config::addresses::AddressesConfig;
use solver_common::config::chain::ChainId;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::transaction::submit_transaction;

use crate::action::Action;
use crate::executors::post_limit_order_executor::{
    PostLimitOrderHandler, PostLimitOrderHandlerResult,
};

/// The post limit order handler which sends the transaction to the aim chain.
pub struct SendTransactionPostLimitOrderHandler {
    connector: Arc<Connector>,
    addresses_config: AddressesConfig,
}

impl SendTransactionPostLimitOrderHandler {
    /// Create a new post limit order handler with the address config and connector.
    pub fn new(addresses_config: AddressesConfig, connector: Arc<Connector>) -> Self {
        Self {
            addresses_config,
            connector,
        }
    }
}

#[async_trait]
impl PostLimitOrderHandler for SendTransactionPostLimitOrderHandler {
    async fn post_limit_orders(
        &self,
        limit_orders: Vec<LimitOrderIntent>,
    ) -> Result<PostLimitOrderHandlerResult> {
        info!(?limit_orders, "Fill the limit orders action");

        let transaction = self.build_post_limit_order_tx(&limit_orders)?;
        let receipt = submit_transaction(transaction).await?;
        let tx_hash = receipt.transaction_hash;

        info!(?limit_orders, ?tx_hash, "Limit Order has been posted");

        Ok(PostLimitOrderHandlerResult {
            limit_order_action: Action::PlaceLimitOrders(limit_orders),
            limit_order_post_tx_hash: tx_hash,
        })
    }

    async fn cancel_limit_orders(&self, hashes: Vec<H256>) -> Result<PostLimitOrderHandlerResult> {
        info!(?hashes, "calling the limit order");

        let transaction = self.build_cancel_limit_order_tx(&hashes)?;
        let receipt = submit_transaction(transaction).await?;
        let tx_hash = receipt.transaction_hash;

        info!(?hashes, ?tx_hash, "Cancellation request has been posted");

        Ok(PostLimitOrderHandlerResult {
            limit_order_action: Action::CancelLimitOrders(hashes),
            limit_order_post_tx_hash: tx_hash,
        })
    }
}

impl SendTransactionPostLimitOrderHandler {
    fn build_post_limit_order_tx(
        &self,
        orders: &[LimitOrderIntent],
    ) -> Result<ContractCall<RpcClient, Vec<[u8; 32]>>> {
        let rpc_client = self.connector.get_rpc_client(ChainId::Khalani)?;
        let intent_book_address = self
            .addresses_config
            .intentbook_addresses
            .limit_order_intentbook;
        let intent_book = LimitOrderIntentBook::new(intent_book_address, rpc_client);
        let mut call =
            intent_book.place_batch_intent(orders.iter().cloned().map(Into::into).collect());
        call.tx.set_chain_id(Into::<u32>::into(ChainId::Khalani));
        Ok(call)
    }

    fn build_cancel_limit_order_tx(&self, hashes: &[H256]) -> Result<ContractCall<RpcClient, ()>> {
        let rpc_client = self.connector.get_rpc_client(ChainId::Khalani)?;
        let intent_book_address = self
            .addresses_config
            .intentbook_addresses
            .limit_order_intentbook;
        let intent_book = LimitOrderIntentBook::new(intent_book_address, rpc_client);
        let mut call = intent_book.cancel_batch_intent(hashes.iter().map(|h| h.0).collect());
        call.tx.set_chain_id(Into::<u32>::into(ChainId::Khalani));
        Ok(call)
    }
}
