use crate::conversion::ToIntent;
use crate::intents::{FillStructure, Intent as RpcIntent, Outcome};
use crate::{common::*, intents::OutcomeAssetStructure};
use alloy::primitives::Signature;
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Inquiry {
    pub author: Address,
    pub src_chain: ChainId,
    pub dest_chain: ChainId,
    pub src_token: Address,
    pub dest_tkn: Address,
    pub src_amt: TokenAmt,
    pub ttl: BlockTime,
    pub nonce: U256,
    pub sig: Option<Signature>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Offer {
    inquiry_hash: B256,
    solver: Address,
    dest_amt: TokenAmt,
    offer_expiration: BlockTime,
    declared_filling_deadline: BlockTime,
    sig: Signature,
}

// #[derive(Debug, Serialize, Deserialize, Clone)]
// pub struct SwapIntent {
//     inquiry_hash: B256,
//     offer_hash: B256,
//     permit2_sig: Signature,
//     intent_sig: Signature,
// }

impl ToIntent for Inquiry {
    fn to_intent(&self) -> RpcIntent {
        let outcome = Outcome {
            m_tokens: vec![self.src_token],
            m_amounts: vec![self.src_amt.amt],
            outcome_asset_structure: OutcomeAssetStructure::AnySingle,
            fill_structure: FillStructure::Exact,
        };

        RpcIntent {
            author: self.author,
            ttl: self.ttl,
            nonce: self.nonce,
            src_m_token: self.src_token,
            src_amount: self.src_amt.amt,
            outcome,
            //sig: self.sig.expect("Error: missing signature on swap inquiry"),
        }
    }
}
