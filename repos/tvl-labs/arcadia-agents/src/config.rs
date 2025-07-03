use anyhow::Result;
use aws_config::BehaviorVersion;
use aws_sdk_secretsmanager::{self, config::ProvideCredentials};
use aws_types::region::Region;
use rustc_hash::FxHashMap as HashMap;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::{info, warn};

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

pub struct AWSClient {
    client: aws_sdk_secretsmanager::Client,
    asm_secret_name: String,
    asm_secret_key: String,
}

impl AWSClient {
    pub async fn new(asm_region: String, asm_secret_name: String, asm_secret_key: String) -> Self {
        let config = aws_config::defaults(BehaviorVersion::v2024_03_28())
            .region(Region::new(asm_region))
            .load()
            .await;
        if let Some(provider) = config.credentials_provider() {
            info!("AWS credentials provider found");
            match provider.provide_credentials().await {
                Ok(creds) => {
                    info!(
                        "Using credentials with access key ID: {}",
                        creds.access_key_id()
                    );
                }
                Err(e) => {
                    warn!("Failed to get credentials: {}", e);
                }
            }
        } else {
            warn!("No AWS credentials provider found");
        }
        Self {
            client: aws_sdk_secretsmanager::Client::new(&config),
            asm_secret_name,
            asm_secret_key,
        }
    }

    async fn get_secret(&self) -> Result<Option<String>> {
        info!("Getting secret: {}", self.asm_secret_name);
        let response = self
            .client
            .get_secret_value()
            .secret_id(&self.asm_secret_name)
            .send()
            .await?;
        Ok(response.secret_string().map(String::from))
    }
    pub async fn get_key(&self) -> Result<String> {
        info!("Getting key: {}", self.asm_secret_key);
        let secret = self.get_secret().await?;
        if secret.is_none() {
            return Err(anyhow::anyhow!("no secret found"));
        }
        let secret: Value = serde_json::from_str(&secret.unwrap())?;
        let key = secret[&self.asm_secret_key].as_str();
        if key.is_none() {
            return Err(anyhow::anyhow!("no key found"));
        }
        Ok(key.unwrap().to_string())
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub mode: NetworkMode,
    pub dev: HashMap<String, String>,
    pub testnet: HashMap<String, String>,
    pub mainnet: HashMap<String, String>,
}

pub enum KeyManager {
    Dev(String),
    Testnet(AWSClient),
    Mainnet(AWSClient),
}

impl KeyManager {
    pub async fn get_key(&self) -> Result<String> {
        match self {
            KeyManager::Dev(key) => Ok(key.clone()),
            KeyManager::Testnet(client) => client.get_key().await,
            KeyManager::Mainnet(client) => client.get_key().await,
        }
    }
}

pub struct AppConfig {
    pub key_manager: KeyManager,
    pub medusa_api_url: String,
}

impl Config {
    pub async fn to_app_config(&self) -> AppConfig {
        let medusa_api_url = match self.mode {
            NetworkMode::Dev => self.dev.get("medusa_api_url").unwrap().clone(),
            NetworkMode::Testnet => self.testnet.get("medusa_api_url").unwrap().clone(),
            NetworkMode::Mainnet => self.mainnet.get("medusa_api_url").unwrap().clone(),
        };
        let key_manager = match self.mode {
            NetworkMode::Dev => {
                KeyManager::Dev(self.dev.get("refund_private_key").unwrap().clone())
            }
            NetworkMode::Testnet => KeyManager::Testnet(
                AWSClient::new(
                    self.testnet.get("asm_region").unwrap().clone(),
                    self.testnet.get("asm_secret_name").unwrap().clone(),
                    self.testnet.get("asm_secret_key").unwrap().clone(),
                )
                .await,
            ),
            NetworkMode::Mainnet => KeyManager::Mainnet(
                AWSClient::new(
                    self.mainnet.get("asm_region").unwrap().clone(),
                    self.mainnet.get("asm_secret_name").unwrap().clone(),
                    self.mainnet.get("asm_secret_key").unwrap().clone(),
                )
                .await,
            ),
        };
        info!("App config created");
        AppConfig {
            key_manager,
            medusa_api_url,
        }
    }
}
