use std::sync::Arc;

use anyhow::{anyhow, Result};
use async_trait::async_trait;
use bindings_khalani::escrow::Escrow;
use ethers::prelude::U256;
use ethers::types::Address;
use tracing::info;

use bindings_khalani::shared_types::SwapIntent as ContractSwapIntent;
use intentbook_matchmaker::types::spoke_chain_call::{SpokeChainCall, SpokeChainCallStub};
use intentbook_matchmaker::types::swap_intent::SwapIntent;
use solver_common::config::addresses::AddressesConfig;
use solver_common::connectors::Connector;
use solver_common::error::ConfigError;
use solver_common::inventory::amount::Amount;
use solver_common::inventory::Inventory;

use crate::workflow::executors::lock_tokens_spoke_chain_call_intent_creator_executor::{
    LockTokensSpokeChainCallIntentCreatorHandler,
    LockTokensSpokeChainCallIntentCreatorHandlerResult,
};

pub struct LockTokensSpokeChainCallIntentCreatorHandlerImpl {
    connector: Arc<Connector>,
    inventory: Arc<Inventory>,
    addresses_config: AddressesConfig,
}

impl LockTokensSpokeChainCallIntentCreatorHandlerImpl {
    pub fn new(
        addresses_config: AddressesConfig,
        connector: Arc<Connector>,
        inventory: Arc<Inventory>,
    ) -> Self {
        Self {
            addresses_config,
            connector,
            inventory,
        }
    }
}

#[async_trait]
impl LockTokensSpokeChainCallIntentCreatorHandler
    for LockTokensSpokeChainCallIntentCreatorHandlerImpl
{
    async fn create_spoke_chain_call_intent(
        &self,
        swap_intent: SwapIntent,
    ) -> Result<LockTokensSpokeChainCallIntentCreatorHandlerResult> {
        info!(
            ?swap_intent,
            "Creating a SpokeChainCall intent to lock source tokens of the SwapIntent"
        );
        let spoke_chain_call = self.create_spoke_chain_call_intent(&swap_intent).await?;
        Ok(LockTokensSpokeChainCallIntentCreatorHandlerResult { spoke_chain_call })
    }
}

impl LockTokensSpokeChainCallIntentCreatorHandlerImpl {
    async fn create_spoke_chain_call_intent(
        &self,
        swap_intent: &SwapIntent,
    ) -> Result<SpokeChainCall> {
        let source_chain_id = swap_intent.source_chain_id;
        let escrow_address = self
            .addresses_config
            .escrows
            .get(&source_chain_id)
            .ok_or_else(|| {
                ConfigError::ContractAddressNotFound(String::from("Escrow"), source_chain_id.into())
            })?;
        let rpc_client = self.connector.get_rpc_client(source_chain_id)?;
        let escrow = Escrow::new(*escrow_address, rpc_client);

        let contract_swap_intent: ContractSwapIntent = swap_intent.clone().into();
        let call_data = escrow
            .lock_tokens(contract_swap_intent)
            .calldata()
            .ok_or(anyhow!("Unable to encode Escrow call"))?;

        let source_chain_mirror_token = self
            .inventory
            .find_mirror_token(swap_intent.source_token, swap_intent.source_chain_id)?;

        // TODO: currently, the reward for the Spoke Chain Call is 1 USD denominated in the source mirror tokens.
        let reward_token = source_chain_mirror_token.address;
        let reward_amount = Amount::from_user_units_token(
            U256::from_dec_str("1").unwrap(),
            source_chain_mirror_token,
        );
        SpokeChainCall::create_signed(
            self.connector.clone(),
            SpokeChainCallStub {
                chain_id: source_chain_id,
                contract_to_call: *escrow_address,
                call_data,
                token: Address::zero(),
                amount: U256::zero(),
                reward_token,
                reward_amount: reward_amount.base_units,
            },
        )
        .await
    }
}
