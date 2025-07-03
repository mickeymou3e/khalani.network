use crate::config::chain::ChainId;
use ethers::types::Address;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct TokenConfigRaw {
    pub address: String,
}

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub struct TokenConfig {
    pub chain_id: ChainId,
    pub address: Address,
}
