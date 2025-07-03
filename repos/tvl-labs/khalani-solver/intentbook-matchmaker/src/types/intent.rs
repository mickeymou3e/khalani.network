use ethers::abi::{encode_packed, Token};
use ethers::utils::keccak256;

use solver_common::types::intent_id::IntentId;

use crate::types::limit_order_intent::LimitOrderIntent;
use crate::types::spoke_chain_call::SpokeChainCall;
use crate::types::swap_intent::SwapIntent;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Intent {
    SpokeChainCall(SpokeChainCall),
    LimitOrder(LimitOrderIntent),
    SwapIntent(SwapIntent),
}

impl Intent {
    pub fn id(&self) -> IntentId {
        match self {
            Intent::SpokeChainCall(spoke_chain_caller) => spoke_chain_caller.intent_id,
            Intent::LimitOrder(limit_order_intent) => limit_order_intent.intent_id,
            Intent::SwapIntent(swap_intent) => swap_intent.intent_id,
        }
    }
}

impl From<Intent> for bindings_khalani::base_intent_book::Intent {
    fn from(value: Intent) -> Self {
        match value {
            Intent::SpokeChainCall(spoke_chain_call) => spoke_chain_call.into(),
            Intent::LimitOrder(limit_order_intent) => limit_order_intent.into(),
            Intent::SwapIntent(swap_intent) => swap_intent.into(),
        }
    }
}

pub fn calculate_intent_id(intent: bindings_khalani::base_intent_book::Intent) -> IntentId {
    keccak256(
        encode_packed(&[
            Token::Bytes(intent.intent.to_vec()),
            Token::Bytes(intent.signature.to_vec()),
        ])
        .unwrap(),
    )
    .into()
}

#[cfg(test)]
mod tests {
    use ethers::abi::AbiDecode;
    use ethers::types::{Address, Bytes, H256};
    use ethers::utils::hex::FromHex;

    use solver_common::config::chain::ChainId;

    use crate::types::intent::SwapIntent;

    use super::*;

    #[test]
    fn test_calculate_intent_id() {
        let swap_intent = SwapIntent {
            intent_id: Default::default(),
            signature: Bytes::from_hex("0x03085e995510aaafc8ed856644f749594f4a5841798f204215a35f9f12db14ad516e0af477c5401f0a4562cae3a2eaef8547180d2082806a850b6a3e420111501c").unwrap(),
            source_chain_id: ChainId::Sepolia,

            destination_chain_id: ChainId::Fuji,
            author: "0x7f6371EC539b3b47A75FAa609748fC10C8bB6791"
                .parse::<Address>()
                .unwrap(),
            source_token: "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF"
                .parse::<Address>()
                .unwrap(),
            destination_token: "0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69"
                .parse::<Address>()
                .unwrap(),
            source_amount: Default::default(),
            source_permit_2: Bytes::from_hex("0xabcd").unwrap(),
            deadline: Default::default(),
            nonce: Default::default(),
        };
        let contract_intent: bindings_khalani::base_intent_book::Intent = swap_intent.into();
        let intent_id = calculate_intent_id(contract_intent);
        let expected_intent_id = IntentId::from(
            H256::decode_hex("0x18a6f26d500a8a4534277587f56f3d435c34b373522f97215bb5502d7bc286d0")
                .unwrap(),
        );
        assert_eq!(expected_intent_id, intent_id);
    }
}
