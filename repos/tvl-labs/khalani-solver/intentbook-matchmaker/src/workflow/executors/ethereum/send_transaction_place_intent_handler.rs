use std::sync::Arc;

use crate::types::intent::Intent;
use crate::workflow::executors::place_intent_executor::{
    PlaceIntentHandler, PlaceIntentHandlerResult,
};
use anyhow::Result;
use async_trait::async_trait;
use bindings_khalani::base_intent_book::BaseIntentBook;
use ethers::contract::ContractCall;
use solver_common::config::addresses::IntentbookAddresses;
use solver_common::config::chain::ChainId;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::transaction::submit_transaction;
use tracing::info;

pub struct SendTransactionPlaceIntentHandler {
    connector: Arc<Connector>,
    intentbook_addresses: IntentbookAddresses,
}

impl SendTransactionPlaceIntentHandler {
    pub fn new(intentbook_addresses: IntentbookAddresses, connector: Arc<Connector>) -> Self {
        Self {
            intentbook_addresses,
            connector,
        }
    }
}

#[async_trait]
impl PlaceIntentHandler for SendTransactionPlaceIntentHandler {
    async fn post_intent(&self, intent: Intent) -> Result<PlaceIntentHandlerResult> {
        info!(?intent, "Placing new intent");
        let transaction = self.build_place_intent_tx(intent.clone())?;
        let receipt = submit_transaction(transaction).await?;
        let tx_hash = receipt.transaction_hash;
        info!(?intent, ?tx_hash, "Intent has been placed");
        Ok(PlaceIntentHandlerResult {
            tx_hash,
            placed_intent: intent,
        })
    }
}

impl SendTransactionPlaceIntentHandler {
    fn build_place_intent_tx(&self, intent: Intent) -> Result<ContractCall<RpcClient, [u8; 32]>> {
        let rpc_client = self.connector.get_rpc_client(ChainId::Khalani)?;
        let intentbook_addresses = &self.intentbook_addresses;
        let intentbook_address = match intent {
            Intent::SpokeChainCall(_) => intentbook_addresses.spoke_chain_call_intentbook,
            Intent::LimitOrder(_) => intentbook_addresses.limit_order_intentbook,
            Intent::SwapIntent(_) => intentbook_addresses.swap_intent_intentbook,
        };
        let intentbook = BaseIntentBook::new(intentbook_address, rpc_client);
        let mut call = intentbook.place_intent(intent.into());
        call.tx.set_chain_id(Into::<u32>::into(ChainId::Khalani));
        Ok(call)
    }
}
