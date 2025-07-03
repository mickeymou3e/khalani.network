use std::sync::Arc;

use anyhow::{anyhow, Result};
use async_trait::async_trait;
use bindings_khalani::swap_intent_filler::SwapIntentFiller;

use intentbook_matchmaker::types::spoke_chain_call::{SpokeChainCall, SpokeChainCallStub};
use solver_common::config::addresses::AddressesConfig;
use solver_common::connectors::Connector;
use solver_common::error::ConfigError;
use solver_common::inventory::Inventory;

use crate::quote::quoted_swap_intent::QuotedSwapIntent;
use crate::workflow::executors::fill_spoke_chain_call_intent_creator_executor::{
    FillSpokeChainCallIntentCreatorHandler, FillSpokeChainCallIntentCreatorHandlerResult,
};

pub struct FillSpokeChainCallIntentCreatorHandlerImpl {
    connector: Arc<Connector>,
    addresses_config: AddressesConfig,
    inventory: Arc<Inventory>,
}

impl FillSpokeChainCallIntentCreatorHandlerImpl {
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
impl FillSpokeChainCallIntentCreatorHandler for FillSpokeChainCallIntentCreatorHandlerImpl {
    async fn create_swap_intent_filler(
        &self,
        quoted_intent: QuotedSwapIntent,
    ) -> Result<FillSpokeChainCallIntentCreatorHandlerResult> {
        let spoke_chain_call = self.create_spoke_chain_call_intent(&quoted_intent).await?;
        Ok(FillSpokeChainCallIntentCreatorHandlerResult { spoke_chain_call })
    }
}

impl FillSpokeChainCallIntentCreatorHandlerImpl {
    async fn create_spoke_chain_call_intent(
        &self,
        quoted_intent: &QuotedSwapIntent,
    ) -> Result<SpokeChainCall> {
        let settler_address = self.connector.get_address();
        let destination_chain_id = quoted_intent.swap_intent.destination_chain_id;
        let swap_intent_filler_address = self
            .addresses_config
            .swap_intent_fillers
            .get(&destination_chain_id)
            .ok_or_else(|| {
                ConfigError::ContractAddressNotFound(
                    String::from("Swap intent filler"),
                    destination_chain_id.into(),
                )
            })?;
        let rpc_client = self.connector.get_rpc_client(destination_chain_id)?;
        let swap_intent_filler_contract =
            SwapIntentFiller::new(*swap_intent_filler_address, rpc_client);
        let call_data = swap_intent_filler_contract
            .fill_swap_intent(
                quoted_intent.swap_intent.clone().into(),
                settler_address,
                quoted_intent.destination_amount.base_units,
            )
            .calldata()
            .ok_or(anyhow!("Unable to encode SwapIntentFiller"))?;

        let destination_chain_mirror_token = self.inventory.find_mirror_token(
            quoted_intent.swap_intent.destination_token,
            quoted_intent.swap_intent.destination_chain_id,
        )?;

        // TODO: currently, the effective Filler agent receives the same reward as to what it delivers on the spoke chain,
        //  meaning that it does not do any profit.
        let reward_token = destination_chain_mirror_token.address;
        let reward_amount = quoted_intent.clone().destination_amount;
        SpokeChainCall::create_signed(
            self.connector.clone(),
            SpokeChainCallStub {
                chain_id: destination_chain_id,
                contract_to_call: *swap_intent_filler_address,
                call_data,
                token: quoted_intent.swap_intent.destination_token,
                amount: quoted_intent.destination_amount.base_units,
                reward_token,
                reward_amount: reward_amount.base_units,
            },
        )
        .await
    }
}
