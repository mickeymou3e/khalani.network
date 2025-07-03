use intentbook_matchmaker::types::spoke_chain_call::SpokeChainCall;
use intentbook_matchmaker::types::spoke_chain_call_bid::SpokeChainCallBid;

/// Core Action enum.
#[derive(Debug, Clone)]
pub enum Action {
    MatchIntent(SpokeChainCall, SpokeChainCallBid),
    CallSpoke(SpokeChainCall),
}
