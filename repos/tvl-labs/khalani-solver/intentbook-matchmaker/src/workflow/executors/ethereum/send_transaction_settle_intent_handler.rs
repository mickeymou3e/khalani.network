use std::sync::Arc;

use crate::workflow::executors::settle_intent_executor::SettleIntentHandlerResult;
use anyhow::Result;
use async_trait::async_trait;
use bindings_khalani::base_intent_book::BaseIntentBook;
use ethers::contract::ContractCall;
use solver_common::config::addresses::IntentbookAddresses;
use tracing::info;

use crate::types::intent::Intent;
use solver_common::config::chain::ChainId;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::error::ChainError;
use solver_common::ethereum::transaction::submit_transaction;

use crate::workflow::executors::settle_intent_executor::SettleIntentHandler;

pub struct SendTransactionSettleIntentHandler {
    connector: Arc<Connector>,
    intentbook_addresses: IntentbookAddresses,
}

impl SendTransactionSettleIntentHandler {
    pub fn new(intentbook_addresses: IntentbookAddresses, connector: Arc<Connector>) -> Self {
        Self {
            intentbook_addresses,
            connector,
        }
    }
}

#[async_trait]
impl SettleIntentHandler for SendTransactionSettleIntentHandler {
    async fn process_settle_intent(&self, intent: Intent) -> Result<SettleIntentHandlerResult> {
        info!(?intent, "Settling intent");
        let transaction = self.build_settle_intent_tx(&intent)?;
        let receipt = submit_transaction(transaction).await?;
        let tx_hash = receipt.transaction_hash;
        info!(?intent, ?tx_hash, "Intent has been settled");
        Ok(SettleIntentHandlerResult {
            settled_intent: intent,
            settlement_tx_hash: tx_hash,
        })
    }
}

impl SendTransactionSettleIntentHandler {
    fn build_settle_intent_tx(
        &self,
        intent: &Intent,
    ) -> Result<ContractCall<RpcClient, ()>, ChainError> {
        let rpc_client = self.connector.get_rpc_client(ChainId::Khalani)?;
        let intent_id = intent.id();
        let intentbook_address = match intent {
            Intent::SpokeChainCall(_) => self.intentbook_addresses.spoke_chain_call_intentbook,
            Intent::LimitOrder(_) => self.intentbook_addresses.limit_order_intentbook,
            Intent::SwapIntent(_) => self.intentbook_addresses.swap_intent_intentbook,
        };
        let intentbook = BaseIntentBook::new(intentbook_address, rpc_client);
        let mut call = intentbook.settle_intent(intent_id.into());
        call.tx.set_chain_id(Into::<u32>::into(ChainId::Khalani));
        Ok(call)
    }
}
