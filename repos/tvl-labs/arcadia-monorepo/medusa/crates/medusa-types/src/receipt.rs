use serde::{Deserialize, Serialize};

use crate::common::*;
use crate::conversion::RpcType;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Receipt {
    pub m_token: Address,
    pub m_token_amount: U256,
    pub owner: Address,
    pub intent_hash: B256,
}

impl RpcType for Receipt {}
