use alloy::{
    json_abi::{ContractObject, JsonAbi},
    primitives::{Address, U256},
};

use config::{Config, Environment, File};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::error::Error;
use std::net::SocketAddr;
use std::sync::OnceLock;

#[derive(Debug, Clone)]
pub struct GlobalConfigs {
    pub hub_publisher_address: Address,
    pub spoke_chains: HashMap<U256, String>,
    pub spoke_asset_reserve_addresses: HashMap<U256, Address>,
}

static GLOBAL_ADDRESSES: OnceLock<GlobalConfigs> = OnceLock::new();

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LightContract {
    pub address: Address,
    pub abi: JsonAbi,
}

impl LightContract {
    pub fn new(address: Address, path_to_abi: String) -> Self {
        let contract: ContractObject =
            serde_json::from_str(&std::fs::read_to_string(path_to_abi.clone()).unwrap())
                .unwrap_or_else(|_| panic!("Failed to load {}", path_to_abi));

        Self {
            address,
            abi: contract.abi.unwrap(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChainConfig {
    pub intent_book: LightContract,
    pub m_token_manager: LightContract,

    pub m_tokens: HashMap<String, LightContract>,
    pub receipt_manager: LightContract,

    pub rpc_url: String,
    pub hyperlane_api_url: String,
    pub gas_price: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StrippedChainConfig {
    pub intent_book_address: Address,
    pub m_token_manager_address: Address,
    pub receipt_manager_address: Address,

    pub rpc_url: String,
    pub m_tokens: HashMap<String, Address>,
    pub contracts_path: String,
    pub hyperlane_api_url: String,
    pub gas_price: u64,
}

impl StrippedChainConfig {
    #[allow(dead_code)]
    pub fn dev_from_file() -> Self {
        let file_content =
            std::fs::read_to_string("config/chain/dev.toml").expect("Failed to read config file");
        println!("Raw TOML content:\n{}", file_content);

        let config_builder = Config::builder()
            .add_source(File::with_name("config/chain/dev.toml"))
            .build()
            .unwrap();
        let result = config_builder.try_deserialize::<Self>();
        match result {
            Ok(config) => {
                println!("Successfully parsed config: {:?}", config);
                config
            }
            Err(e) => {
                println!("Error parsing config: {:?}", e);
                if let Some(source) = e.source() {
                    println!("Caused by: {:?}", source);
                }
                panic!("Failed to parse config");
            }
        }
    }

    pub fn dev_from_env() -> Self {
        let _contracts_path = "contracts/arcadia-core-contracts".to_string();
        let config_builder = Config::builder()
            .add_source(
                Environment::with_prefix("MEDUSA")
                    .separator("__")
                    .list_separator(" "),
            )
            .build()
            .unwrap();
        config_builder.try_deserialize::<Self>().unwrap()
    }

    pub fn to_chain_config(&self) -> ChainConfig {
        let contracts_path = self.contracts_path.clone();
        let intent_book = LightContract::new(
            self.intent_book_address,
            format!("{}/out/IntentBook.sol/IntentBook.json", contracts_path),
        );
        let m_token_manager = LightContract::new(
            self.m_token_manager_address,
            format!(
                "{}/out/MTokenManager.sol/MTokenManager.json",
                contracts_path
            ),
        );
        let receipt_manager = LightContract::new(
            self.receipt_manager_address,
            format!(
                "{}/out/ReceiptManager.sol/ReceiptManager.json",
                contracts_path
            ),
        );
        let m_tokens = self
            .m_tokens
            .clone()
            .into_iter()
            .map(|(name, address)| {
                (
                    name,
                    LightContract::new(
                        address,
                        format!("{}/out/MToken.sol/MToken.json", contracts_path),
                    ),
                )
            })
            .collect();
        ChainConfig {
            intent_book,
            m_token_manager,
            m_tokens,
            receipt_manager,
            rpc_url: self.rpc_url.clone(),
            hyperlane_api_url: self.hyperlane_api_url.clone(),
            gas_price: self.gas_price.clone(),
        }
    }
}

impl From<StrippedChainConfig> for ChainConfig {
    fn from(config: StrippedChainConfig) -> Self {
        config.to_chain_config()
    }
}

#[derive(Clone, Default, PartialEq, Debug, Serialize, Deserialize)]
pub enum NetworkMode {
    #[default]
    #[serde(rename = "dev")]
    Dev,
    #[serde(rename = "testnet")]
    Testnet,
    #[serde(rename = "mainnet")]
    Mainnet,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct MedusaConfig {
    pub mode: NetworkMode,
    pub asm_region: String,
    pub asm_secret_name: String,
    pub asm_secret_key: String,
    pub contracts_path: String,
    pub key: String,
    pub intent_book_address: Address,
    pub m_token_manager_address: Address,
    pub receipt_manager_address: Address,
    pub m_tokens: HashMap<String, Address>,
    pub arcadia_url: String,
    pub medusa_rpc_url: String,
    pub medusa_ws_url: String,
    pub apm_url: String,
    pub db_path: String,
    pub hyperlane_api_url: String,
    pub hub_publisher_address: Address,
    pub spoke_asset_reserve_addresses: HashMap<U256, Address>,
    pub spoke_rpc_urls: HashMap<U256, String>,
    pub gas_price: u64,
}

impl MedusaConfig {
    pub fn medusa_rpc_url(&self) -> SocketAddr {
        self.medusa_rpc_url.parse().unwrap()
    }

    pub fn medusa_ws_url(&self) -> SocketAddr {
        self.medusa_ws_url.parse().unwrap()
    }

    #[allow(dead_code)]
    pub fn dev_from_env() -> Self {
        let _contracts_path = "contracts/arcadia-core-contracts".to_string();
        let config_builder = Config::builder()
            .add_source(
                Environment::with_prefix("medusa")
                    .separator("__")
                    .list_separator(" "),
            )
            .build()
            .unwrap();
        config_builder.try_deserialize::<Self>().unwrap()
    }

    #[allow(dead_code)]
    pub fn dev() -> Self {
        let _contracts_path = "contracts/arcadia-core-contracts".to_string();
        let config_builder = Config::builder()
            .add_source(File::with_name("config/dev.toml"))
            .add_source(Environment::with_prefix("MEDUSA"))
            .build()
            .unwrap();
        config_builder.try_deserialize::<Self>().unwrap()
    }

    #[allow(dead_code)]
    pub fn dev_chain_config(&self) -> ChainConfig {
        let stripped_chain_config = StrippedChainConfig::dev_from_env();
        stripped_chain_config.to_chain_config()
    }

    pub fn make_chain_config(&self) -> StrippedChainConfig {
        let global_configs = GlobalConfigs {
            hub_publisher_address: self.hub_publisher_address,
            spoke_chains: self.spoke_rpc_urls.clone(),
            spoke_asset_reserve_addresses: self.spoke_asset_reserve_addresses.clone(),
        };

        GLOBAL_ADDRESSES.get_or_init(|| global_configs);

        StrippedChainConfig {
            intent_book_address: self.intent_book_address,
            m_token_manager_address: self.m_token_manager_address,
            receipt_manager_address: self.receipt_manager_address,
            m_tokens: self.m_tokens.clone(),
            rpc_url: self.arcadia_url.clone(),
            contracts_path: self.contracts_path.clone(),
            hyperlane_api_url: self.hyperlane_api_url.clone(),
            gas_price: self.gas_price.clone(),
        }
    }

    #[allow(dead_code)]
    pub fn default_local_chain_config(
        intent_book_address: Address,
        m_token_manager_address: Address,
        receipt_manager_address: Address,
        m_tokens: HashMap<String, Address>,
        rpc_url: String,
        hyperlane_api_url: String,
        gas_price: u64,
    ) -> ChainConfig {
        let contracts_path = "contracts".to_string();
        let intent_book = LightContract::new(
            intent_book_address,
            format!(
                "{}/out/ClearanceEngine.sol/ClearanceEngine.json",
                contracts_path
            ),
        );
        let m_token_manager = LightContract::new(
            m_token_manager_address,
            format!(
                "{}/out/MTokenManager.sol/MTokenManager.json",
                contracts_path
            ),
        );
        let receipt_manager = LightContract::new(
            receipt_manager_address,
            format!(
                "{}/out/ReceiptManager.sol/ReceiptManager.json",
                contracts_path
            ),
        );
        let m_tokens = m_tokens
            .into_iter()
            .map(|(name, address)| {
                (
                    name,
                    LightContract::new(
                        address,
                        format!("{}/out/MToken.sol/MToken.json", contracts_path),
                    ),
                )
            })
            .collect();
        ChainConfig {
            intent_book,
            m_token_manager,
            m_tokens,
            receipt_manager,
            rpc_url: rpc_url.parse().unwrap(),
            hyperlane_api_url: hyperlane_api_url.clone(),
            gas_price: gas_price.clone(),
        }
    }

    // pub fn test_mode_config(key: Option<String>) -> Self {
    //     Self {
    //         solver_whitelist: None,
    //         mode: NetworkMode::Local,
    //         contracts_path: "contracts".to_string(),
    //         key,
    //     }
    // }
}

pub fn get_hub_publisher_address() -> Address {
    GLOBAL_ADDRESSES
        .get()
        .unwrap()
        .hub_publisher_address
        .clone()
}

pub fn get_spoke_chains() -> HashMap<U256, String> {
    GLOBAL_ADDRESSES.get().unwrap().spoke_chains.clone()
}

pub fn get_spoke_asset_reserve_addresses() -> HashMap<U256, Address> {
    GLOBAL_ADDRESSES
        .get()
        .unwrap()
        .spoke_asset_reserve_addresses
        .clone()
}
