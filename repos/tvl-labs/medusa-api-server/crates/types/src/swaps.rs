use alloy::primitives::{bytes::buf::Chain, Signature};
use serde::{Deserialize, Serialize};

use crate::common::*;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SwapInquiry {
    pub author: Address,
    pub src_chain: ChainId,
    pub dest_chain: ChainId,
    pub src_token: Address,
    pub dest_tkn: Address,
    pub src_amt: TokenAmt,
    pub ttl: BlockTime,
    pub nonce: uuid::Uuid,
    pub sig: Option<Signature>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SwapOffer {
    inquiry_hash: B256,
    solver: Address,
    dest_amt: TokenAmt,
    offer_expiration: BlockTime,
    declared_filling_deadline: BlockTime,
    sig: Signature,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SwapIntent {
    inquiry_hash: B256,
    offer_hash: B256,
    permit2_sig: Signature,
    intent_sig: Signature,
}
