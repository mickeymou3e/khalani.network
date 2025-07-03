use intentbook_matchmaker::types::swap_intent::SwapIntent;
use intentbook_matchmaker::workflow::executors::match_intent_executor::MatchIntentHandlerResult;
use intentbook_matchmaker::workflow::executors::place_intent_executor::PlaceIntentHandlerResult;

use crate::quote::quoted_swap_intent::QuotedSwapIntent;
use crate::workflow::executors::fill_spoke_chain_call_intent_creator_executor::FillSpokeChainCallIntentCreatorHandlerResult;
use crate::workflow::executors::lock_tokens_spoke_chain_call_intent_creator_executor::LockTokensSpokeChainCallIntentCreatorHandlerResult;
use crate::workflow::executors::matched_swap_intent_bid_creator_executor::MatchedSwapIntentBidCreatorHandlerResult;

/// Core Event enum.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Event {
    NewSwapIntent(SwapIntent),
    IntentQuoted(QuotedSwapIntent),

    CreatedMatchedIntentBid(MatchedSwapIntentBidCreatorHandlerResult),
    IntentMatched(MatchIntentHandlerResult),

    CreatedSpokeChainCallToLockTokensOnSourceChain(
        LockTokensSpokeChainCallIntentCreatorHandlerResult,
    ),
    CreatedSpokeChainCallIntentToFillSwapIntentOnDestinationChain(
        FillSpokeChainCallIntentCreatorHandlerResult,
    ),
    IntentPlaced(PlaceIntentHandlerResult),
}
