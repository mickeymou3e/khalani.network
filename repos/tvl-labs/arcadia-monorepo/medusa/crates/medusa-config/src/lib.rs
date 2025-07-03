use std::collections::HashMap;
use std::net::SocketAddr;
use std::str::FromStr;

use alloy::json_abi::{ContractObject, JsonAbi};
use alloy::network::EthereumWallet;
use alloy::primitives::Address;
use alloy::signers::aws::AwsSigner;
use alloy::signers::local::LocalSigner;
use anyhow::Result;
use aws_config::BehaviorVersion;
use aws_types::region::Region;
use config::{Config, Environment};
use serde::{Deserialize, Serialize};

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
    pub gas_price: u64,
}

impl StrippedChainConfig {
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
            gas_price: self.gas_price,
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
    pub kms_region: String,
    pub kms_key_id: String,
    pub contracts_path: String,
    pub key: String,
    pub intent_book_address: Address,
    pub m_token_manager_address: Address,
    pub receipt_manager_address: Address,
    pub m_tokens: HashMap<String, Address>,
    pub arcadia_url: String,
    pub medusa_rpc_url: String,
    pub medusa_ws_url: String,
    /// The SocketAddr (not URL) for the metrics server to bind to.
    pub apm_url: String,
    pub db_path: String,
    pub hub_publisher_address: Address,
    pub gas_price: u64,
}

impl MedusaConfig {
    pub async fn to_wallet(&self) -> Result<EthereumWallet> {
        // use aws kms even in dev mode
        if self.mode == NetworkMode::Dev {
            Ok(EthereumWallet::new(LocalSigner::from_str(&self.key)?))
        } else {
            let aws_sdk_kms_config = aws_config::defaults(BehaviorVersion::v2025_01_17())
                .region(Region::new(self.kms_region.clone()))
                .load()
                .await;

            let kms_client = aws_sdk_kms::Client::new(&aws_sdk_kms_config);
            let signer = AwsSigner::new(kms_client, self.kms_key_id.clone(), None).await?;
            Ok(EthereumWallet::new(signer))
        }
    }

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

    pub fn make_chain_config(&self) -> StrippedChainConfig {
        StrippedChainConfig {
            intent_book_address: self.intent_book_address,
            m_token_manager_address: self.m_token_manager_address,
            receipt_manager_address: self.receipt_manager_address,
            m_tokens: self.m_tokens.clone(),
            rpc_url: self.arcadia_url.clone(),
            contracts_path: self.contracts_path.clone(),
            gas_price: self.gas_price,
        }
    }

    #[allow(dead_code)]
    pub fn default_local_chain_config(
        intent_book_address: Address,
        m_token_manager_address: Address,
        receipt_manager_address: Address,
        m_tokens: HashMap<String, Address>,
        rpc_url: String,
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
            gas_price,
        }
    }
}
