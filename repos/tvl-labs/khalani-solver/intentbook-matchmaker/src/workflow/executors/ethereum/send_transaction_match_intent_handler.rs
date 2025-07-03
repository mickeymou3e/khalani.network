use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use bindings_khalani::base_intent_book::BaseIntentBook;
use ethers::contract::ContractCall;
use tracing::info;

use solver_common::config::addresses::AddressesConfig;
use solver_common::config::chain::ChainId;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::transaction::submit_transaction;

use crate::types::intent::Intent;
use crate::types::intent_bid::IntentBid;
use crate::workflow::executors::match_intent_executor::{
    MatchIntentHandler, MatchIntentHandlerResult,
};

pub struct SendTransactionMatchIntentHandler {
    connector: Arc<Connector>,
    addresses_config: AddressesConfig,
}

impl SendTransactionMatchIntentHandler {
    pub fn new(addresses_config: AddressesConfig, connector: Arc<Connector>) -> Self {
        Self {
            addresses_config,
            connector,
        }
    }
}

#[async_trait]
impl MatchIntentHandler for SendTransactionMatchIntentHandler {
    async fn match_intent(
        &self,
        intent: Intent,
        intent_bid: IntentBid,
    ) -> Result<MatchIntentHandlerResult> {
        info!(?intent, ?intent_bid, "Matching intent");
        let transaction = self.build_bid_intent_tx(&intent_bid)?;
        let receipt = submit_transaction(transaction).await?;
        let tx_hash = receipt.transaction_hash;
        info!(?intent, ?tx_hash, "Intent has been matched");
        Ok(MatchIntentHandlerResult {
            intent,
            intent_bid,
            matching_tx_hash: tx_hash,
        })
    }
}

impl SendTransactionMatchIntentHandler {
    fn build_bid_intent_tx(&self, intent_bid: &IntentBid) -> Result<ContractCall<RpcClient, ()>> {
        let rpc_client = self.connector.get_rpc_client(ChainId::Khalani)?;
        let intentbook_addresses = &self.addresses_config.intentbook_addresses;
        let intentbook_address = match intent_bid {
            IntentBid::SpokeChainCallBid(_) => intentbook_addresses.spoke_chain_call_intentbook,
            IntentBid::LimitOrderBid(_) => intentbook_addresses.limit_order_intentbook,
            IntentBid::SwapIntentBid(_) => intentbook_addresses.swap_intent_intentbook,
        };
        let intentbook = BaseIntentBook::new(intentbook_address, rpc_client);
        let mut call = intentbook.match_intent(intent_bid.clone().into());
        call.tx.set_chain_id(Into::<u32>::into(ChainId::Khalani));
        Ok(call)
    }
}
