use serde::de::{self, Deserializer};
use serde::Deserialize;
use std::collections::HashMap;
use std::str::FromStr;

pub fn deserialize_u32_map<'de, D>(deserializer: D) -> Result<HashMap<u32, String>, D::Error>
where
    D: Deserializer<'de>,
{
    // First, deserialize into a HashMap with String keys.
    let string_map: HashMap<String, String> = HashMap::deserialize(deserializer)?;
    let mut u32_map = HashMap::new();

    for (key, value) in string_map {
        let key_parsed = u32::from_str(&key).map_err(de::Error::custom)?;
        u32_map.insert(key_parsed, value);
    }
    Ok(u32_map)
}

#[derive(Debug, Clone, Deserialize)]
pub struct ChainConfig {
    #[serde(deserialize_with = "deserialize_u32_map")]
    pub rpc_urls: HashMap<u32, String>,
    #[serde(deserialize_with = "deserialize_u32_map")]
    pub ws_urls: HashMap<u32, String>,
    #[serde(deserialize_with = "deserialize_u32_map")]
    pub asset_reserves_addresses: HashMap<u32, String>,
    pub arcadia_rpc_url: String,
    pub arcadia_chain_id: u32,
    pub mtoken_manager_address: String,
    pub chains_to_listen: Vec<u32>,
}

impl ChainConfig {
    pub fn get_chain_ids(&self) -> Vec<u32> {
        self.chains_to_listen.clone()
    }

    pub fn get_rpc_url(&self, chain_id: u32) -> Option<&String> {
        self.rpc_urls.get(&chain_id)
    }

    pub fn get_ws_url(&self, chain_id: u32) -> Option<&String> {
        self.ws_urls.get(&chain_id)
    }

    pub fn get_asset_reserves_address(&self, chain_id: u32) -> Option<&String> {
        self.asset_reserves_addresses.get(&chain_id)
    }

    pub fn get_arcadia_rpc_url(&self) -> &String {
        &self.arcadia_rpc_url
    }

    pub fn get_mtoken_manager_address(&self) -> &String {
        &self.mtoken_manager_address
    }
}
