use crate::config::NetworkMode;
use anyhow::Result;
use aws_config::BehaviorVersion;
use aws_sdk_secretsmanager::{self, config::ProvideCredentials};
use aws_types::region::Region;
use serde_json::Value;
use tracing::{info, warn};

#[async_trait::async_trait]
pub trait KeyManagerTrait {
    async fn get_medusa_key(&self) -> Result<String>;
}

pub struct KeyManager {
    client: Option<aws_sdk_secretsmanager::Client>,
    key: String,
    network_mode: NetworkMode,
    asm_secret_name: Option<String>,
    asm_secret_key: Option<String>,
}
impl KeyManager {
    pub async fn new(
        key: String,
        network_mode: NetworkMode,
        asm_region: String,
        asm_secret_name: String,
        asm_secret_key: String,
    ) -> Self {
        if network_mode == NetworkMode::Dev {
            return Self {
                client: None,
                key,
                network_mode,
                asm_secret_name: None,
                asm_secret_key: None,
            };
        }

        let config = aws_config::defaults(BehaviorVersion::v2024_03_28())
            .region(Region::new(asm_region))
            .load()
            .await;

        // Log the credential provider info
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

        let client = aws_sdk_secretsmanager::Client::new(&config);
        Self {
            client: Some(client),
            key,
            network_mode,
            asm_secret_name: Some(asm_secret_name),
            asm_secret_key: Some(asm_secret_key),
        }
    }

    async fn get_secret(&self) -> Result<Option<String>> {
        if self.client.is_none() {
            return Err(anyhow::anyhow!("cannot get secret in dev mode"));
        }
        let response = self
            .client
            .as_ref()
            .unwrap()
            .get_secret_value()
            .secret_id(self.asm_secret_name.as_ref().unwrap())
            .send()
            .await?;
        Ok(response.secret_string().map(String::from))
    }
}
#[async_trait::async_trait]
impl KeyManagerTrait for KeyManager {
    async fn get_medusa_key(&self) -> Result<String> {
        match self.network_mode {
            NetworkMode::Dev => Ok(self.key.clone()),
            _ => {
                let secret = self.get_secret().await?;
                if secret.is_none() {
                    return Err(anyhow::anyhow!("no secret found"));
                }
                let secret: Value = serde_json::from_str(&secret.unwrap())?;
                let key = secret[self.asm_secret_key.as_ref().unwrap()].as_str();
                if key.is_none() {
                    return Err(anyhow::anyhow!("no key found"));
                }
                Ok(key.unwrap().to_string())
            }
        }
    }
}
