use ethers::types::Address;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CCMMConfig {
    pub address: Address,
    pub base_token: Address,
    pub quote_token: Address,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CCMMConfigRaw {
    pub address: String,
    pub base_token: String,
    pub quote_token: String,
}
