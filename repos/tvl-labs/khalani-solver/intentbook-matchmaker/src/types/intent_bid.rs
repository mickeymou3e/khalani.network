use ethers::abi::{encode_packed, Token};
use ethers::utils::keccak256;

use solver_common::types::intent_id::{IntentBidId, IntentId};

use crate::types::limit_order_intent_bid::LimitOrderIntentBid;
use crate::types::spoke_chain_call_bid::SpokeChainCallBid;
use crate::types::swap_intent_bid::SwapIntentBid;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum IntentBid {
    SpokeChainCallBid(SpokeChainCallBid),
    LimitOrderBid(LimitOrderIntentBid),
    SwapIntentBid(SwapIntentBid),
}

impl IntentBid {
    pub fn intent_id(&self) -> IntentId {
        match self {
            IntentBid::SpokeChainCallBid(spoke_chain_caller) => spoke_chain_caller.intent_id,
            IntentBid::LimitOrderBid(limit_order_intent) => limit_order_intent.intent_id,
            IntentBid::SwapIntentBid(swap_intent) => swap_intent.intent_id,
        }
    }

    pub fn intent_bid_id(&self) -> IntentBidId {
        match self {
            IntentBid::SpokeChainCallBid(spoke_chain_caller) => spoke_chain_caller.intent_bid_id,
            IntentBid::LimitOrderBid(limit_order_intent) => limit_order_intent.intent_bid_id,
            IntentBid::SwapIntentBid(swap_intent) => swap_intent.intent_bid_id,
        }
    }
}

impl From<IntentBid> for bindings_khalani::base_intent_book::IntentBid {
    fn from(value: IntentBid) -> Self {
        match value {
            IntentBid::SpokeChainCallBid(bid) => bid.into(),
            IntentBid::LimitOrderBid(bid) => bid.into(),
            IntentBid::SwapIntentBid(bid) => bid.into(),
        }
    }
}

pub fn calculate_intent_bid_id(
    intent_bid: bindings_khalani::base_intent_book::IntentBid,
) -> IntentBidId {
    keccak256(
        encode_packed(&[
            Token::FixedBytes(Vec::from(intent_bid.intent_id)),
            Token::Bytes(intent_bid.bid.to_vec()),
        ])
        .unwrap(),
    )
    .into()
}

#[cfg(test)]
mod tests {
    use ethers::abi::AbiDecode;
    use ethers::types::{Address, H256, U256};

    use crate::types::swap_intent_bid::SwapIntentBid;

    use super::*;

    #[test]
    fn test_calculate_intent_bid_id() {
        let swap_intent_bid = SwapIntentBid {
            intent_id: IntentId::from(
                H256::decode_hex(
                    "0x76347f79cb00041c374090d5368c061abd8ee93081c67a2318b35f7bb65192a3",
                )
                .unwrap(),
            ),
            filler: "0xe1AB8145F7E55DC933d51a18c793F901A3A0b276"
                .parse::<Address>()
                .unwrap(),
            fill_amount: U256::from_dec_str("321").unwrap(),
            intent_bid_id: Default::default(),
        };
        let intent_bid: bindings_khalani::base_intent_book::IntentBid = swap_intent_bid.into();
        let intent_bid_id = calculate_intent_bid_id(intent_bid);
        let expected_intent_bid_id = IntentId::from(
            H256::decode_hex("0x98fce71edb803e8602d178e017d0f843fa93cda2223449f4d6c1e2d8b81fd428")
                .unwrap(),
        );
        assert_eq!(expected_intent_bid_id, intent_bid_id);
    }
}
