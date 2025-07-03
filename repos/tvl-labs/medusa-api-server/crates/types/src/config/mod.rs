use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use hsn_types::common::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    solver_whitelist: Vec<Address>,
    supported_chains: Vec<ChainId>,
    supported_tokens: HashMap<MetaTokenId, TokenConfig>,
    medusa_admin_key_path: String,
}

pub struct GeneratedConfig {
    config: Config,
    secret_key: Option<SecretKey>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash, Clone)]
pub struct MetaTokenId(String);

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenConfig {
    concrete_tokens: Vec<TokenInfo>,
}