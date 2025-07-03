use anyhow::Result;
use bindings_khalani::shared_types::IntentBid as ContractIntent;
use bindings_khalani::swap_intent_book::SwapIntentBid as ContractSwapIntentBid;
use ethers::abi::{encode_packed, AbiEncode, Token as AbiToken};
use ethers::types::{Address, BigEndianHash, Bytes, H256, U256};
use ethers::utils::keccak256;

use crate::types::intent_bid::calculate_intent_bid_id;
use solver_common::types::intent_id::{IntentBidId, IntentId, WithIntentIdAndBidId};
use solver_common::types::proof_id::ProofId;

use crate::types::swap_intent::{abi_decode_tuple, SwapIntent};

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SwapIntentBid {
    pub intent_bid_id: IntentBidId,
    pub intent_id: IntentId,
    pub filler: Address,
    pub fill_amount: U256,
}

impl SwapIntentBid {
    pub fn new(intent_id: IntentId, filler: Address, fill_amount: U256) -> Self {
        let bid = Self {
            intent_bid_id: Default::default(),
            intent_id,
            filler,
            fill_amount,
        };
        let intent_bid_id = calculate_intent_bid_id(bid.clone().into());
        Self {
            intent_bid_id,
            ..bid
        }
    }
}

impl TryFrom<WithIntentIdAndBidId<ContractIntent>> for SwapIntentBid {
    type Error = anyhow::Error;

    fn try_from(value: WithIntentIdAndBidId<ContractIntent>) -> Result<Self, Self::Error> {
        let (intent_id, intent_bid_id, intent_bid) = value;
        let value: ContractSwapIntentBid = abi_decode_tuple(intent_bid.bid)?;
        Ok(SwapIntentBid {
            intent_id,
            intent_bid_id,
            filler: value.filler,
            fill_amount: value.fill_amount,
        })
    }
}

impl From<SwapIntentBid> for ContractSwapIntentBid {
    fn from(value: SwapIntentBid) -> Self {
        Self {
            filler: value.filler,
            fill_amount: value.fill_amount,
        }
    }
}

impl From<SwapIntentBid> for bindings_khalani::base_intent_book::IntentBid {
    fn from(value: SwapIntentBid) -> Self {
        let bid: ContractSwapIntentBid = value.clone().into();
        Self {
            intent_id: value.intent_id.into(),
            bid: Bytes::from(bid.encode()),
        }
    }
}

impl SwapIntentBid {
    pub fn get_expected_proofs(&self, swap_intent: &SwapIntent) -> Result<Vec<ProofId>> {
        let swap_intent_id = swap_intent.calculate_swap_intent_id();
        Ok(vec![
            self.get_swap_intent_token_lock_proof_id(swap_intent_id),
            self.get_swap_intent_filled_proof_id(swap_intent_id),
        ])
    }

    fn get_swap_intent_token_lock_proof_id(&self, swap_intent_id: H256) -> ProofId {
        keccak256(
            encode_packed(&[
                AbiToken::String(String::from("SwapIntentTokenLock")),
                AbiToken::FixedBytes(swap_intent_id.to_fixed_bytes().to_vec()),
            ])
            .unwrap(),
        )
        .into()
    }

    fn get_swap_intent_filled_proof_id(&self, swap_intent_id: H256) -> ProofId {
        keccak256(
            encode_packed(&[
                AbiToken::String(String::from("SwapIntentFilled")),
                AbiToken::FixedBytes(Vec::from(swap_intent_id.as_bytes())),
                AbiToken::Address(self.filler),
                AbiToken::FixedBytes(H256::from_uint(&self.fill_amount).to_fixed_bytes().to_vec()),
            ])
            .unwrap(),
        )
        .into()
    }
}

#[cfg(test)]
mod tests {
    use ethers::abi::AbiDecode;
    use ethers::types::H256;

    use super::*;

    #[test]
    fn test_swap_intent_token_lock_hash() {
        let swap_intent_bid = SwapIntentBid {
            intent_id: Default::default(),
            intent_bid_id: Default::default(),
            filler: Default::default(),
            fill_amount: Default::default(),
        };
        let swap_intent_id =
            H256::decode_hex("0x897a3b81b3017617c14e99aba8c6373315c68ee8054aebb944c274710ad8b406")
                .unwrap();
        let proof_id = swap_intent_bid.get_swap_intent_token_lock_proof_id(swap_intent_id);
        let expected_proof_id = IntentId::from(
            H256::decode_hex("0xd1a8d584d0ae1ac3c487eca8a960349363db0e3253a584faf153dd8fdab6524c")
                .unwrap(),
        );
        assert_eq!(expected_proof_id, proof_id);
    }

    #[test]
    fn test_swap_intent_filled_event_hash() {
        let swap_intent_bid = SwapIntentBid {
            intent_id: Default::default(),
            intent_bid_id: Default::default(),
            filler: "0xe1AB8145F7E55DC933d51a18c793F901A3A0b276"
                .parse::<Address>()
                .unwrap(),
            fill_amount: U256::from_dec_str("321").unwrap(),
        };
        let swap_intent_id =
            H256::decode_hex("0x897a3b81b3017617c14e99aba8c6373315c68ee8054aebb944c274710ad8b406")
                .unwrap();
        let proof_id = swap_intent_bid.get_swap_intent_filled_proof_id(swap_intent_id);
        let expected_proof_id = IntentId::from(
            H256::decode_hex("0x4dfd3858737268a0f558625b161b74539cb6d484c870fc14bb30a4b73d00686a")
                .unwrap(),
        );
        assert_eq!(expected_proof_id, proof_id);
    }
}
