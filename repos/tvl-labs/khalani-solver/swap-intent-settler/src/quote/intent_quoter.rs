use crate::quote::quoted_swap_intent::QuotedSwapIntent;
use anyhow::Result;
use async_trait::async_trait;
use intentbook_matchmaker::types::swap_intent::SwapIntent;

#[async_trait]
pub trait IntentQuoter {
    async fn quote_intent(&self, swap_intent: SwapIntent) -> Result<QuotedSwapIntent>;
}
