use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use tracing::info;

use intentbook_matchmaker::types::swap_intent::SwapIntent;
use solver_common::inventory::amount::Amount;
use solver_common::inventory::Inventory;

use crate::quote::intent_quoter::IntentQuoter;
use crate::quote::quoted_swap_intent::QuotedSwapIntent;

pub struct OneToOneIntentQuoter {
    inventory: Arc<Inventory>,
}

impl OneToOneIntentQuoter {
    pub fn new(inventory: Arc<Inventory>) -> Self {
        Self { inventory }
    }
}

#[allow(unreachable_code)]
#[async_trait]
impl IntentQuoter for OneToOneIntentQuoter {
    async fn quote_intent(&self, swap_intent: SwapIntent) -> Result<QuotedSwapIntent> {
        info!(?swap_intent, "Quoting intent");

        let source_mirror_token = self
            .inventory
            .find_mirror_token(swap_intent.source_token, swap_intent.source_chain_id)?;

        let source_mirror_amount =
            Amount::from_token_base_units(swap_intent.source_amount, source_mirror_token);

        let destination_mirror_token = self.inventory.find_mirror_token(
            swap_intent.destination_token,
            swap_intent.destination_chain_id,
        )?;

        // TODO: use a real quoting strategy. Current this is just a 1 to 1 exchange rate.
        let destination_amount =
            source_mirror_amount.rescale_to_decimals(destination_mirror_token.decimals);

        return Ok(QuotedSwapIntent {
            swap_intent,
            destination_amount,
        });
    }
}
