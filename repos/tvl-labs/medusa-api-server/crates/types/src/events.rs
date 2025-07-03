use crate::{common::*, conversion::RpcType};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct XChainEvent {
    pub(crate) publisher: Address,
    pub event_hash: B256,
    pub chain_id: ChainId,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AssetReserveDeposit {
    pub token: Address,
    pub amount: U256,
    pub depositor: Address,
}

impl RpcType for AssetReserveDeposit {}

impl RpcType for XChainEvent {}
