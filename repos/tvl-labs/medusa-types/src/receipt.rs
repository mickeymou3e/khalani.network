use crate::{common::*, conversion::RpcType};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Receipt {
    pub m_token: Address,
    pub m_token_amount: U256,
    pub owner: Address,
    pub intent_hash: B256,
}

impl RpcType for Receipt {}
