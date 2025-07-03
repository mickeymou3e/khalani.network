use crate::models::{Intent, IntentErrorType, IntentHistory};
use anyhow::Result;
use ethers::types::{Address, U256};
use jsonrpsee::core::client::ClientT;
use jsonrpsee::http_client::HttpClient;
use jsonrpsee::rpc_params;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::broadcast::Sender;
use tracing::{error, info};

fn get_current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

#[derive(Clone, Debug)]
pub struct ApiClient {
    pub client: HttpClient,
    pub last_update: u64,
    pub sender: Sender<(Address, Address, U256)>,
}

impl ApiClient {
    pub fn new(medusa_api_url: String, sender: Sender<(Address, Address, U256)>) -> Self {
        ApiClient {
            client: HttpClient::builder()
                .build(medusa_api_url)
                .expect("Failed to create client"),
            last_update: get_current_timestamp(),
            sender,
        }
    }

    pub async fn start(&mut self) -> Result<()> {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(10));
        loop {
            interval.tick().await;
            let params = rpc_params![self.last_update];
            info!("Checking for failed intents");
            let histories: Vec<(IntentHistory, Intent)> = self
                .client
                .request("getFailedIntentsSince", params.clone())
                .await
                .unwrap();
            self.last_update = get_current_timestamp();
            info!(
                "Found {} history entries for failed intents at timestamp {}",
                histories.len(),
                self.last_update
            );
            for (history, intent) in histories {
                if history.error_type.is_none() {
                    error!("Intent history has no error type. this should never happen.",);
                } else {
                    let error_type = history.error_type.unwrap();
                    match error_type {
                        IntentErrorType::WithdrawToSpoke => {
                            let user_address = intent.author;
                            let token = intent.src_m_token;
                            let amount = intent.src_amount;
                            info!("Withdraw to spoke failed for intent: {:?}", intent);
                            self.sender.send((user_address, token, amount))?;
                        }
                        _ => {
                            info!("Intent history has error type {:?}. skipping.", error_type);
                        }
                    }
                }
            }
        }
    }

    // pub async fn get_failed_intent_histories_since_last_update(
    //     &mut self,
    // ) -> Result<Vec<(IntentHistory, Intent)>> {
    //     let params = rpc_params!(self.last_update);
    //     let histories = self.client.request("getFailedIntentsSince", params).await?;
    //     self.last_update = get_current_timestamp();
    //     Ok(histories)
    // }

    // pub async fn get_intent_history(&self, intent_id: &str) -> Result<(IntentHistory, Intent)> {
    //     let params = rpc_params!(intent_id);
    //     self.client
    //         .request::<(IntentHistory, Intent), _>("getHistory", params)
    //         .await
    //         .map_err(|e| anyhow::anyhow!("Failed to get intent history: {:?}", e))
    // }

    // pub async fn get_hyperlane_status(
    //     &self,
    //     tx_hash: &str,
    // ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    //     let url = format!(
    //         "{}?module=message&action=search-messages&query={}",
    //         self.hyperlane_api_url, tx_hash
    //     );
    //     let response = self.client.get(&url).send().await?;
    //     let data = response.json::<HyperlaneMessageStatusResponse>().await?;
    //     let status = data
    //         .result
    //         .first()
    //         .map_or("unknown".to_string(), |msg| msg.status.clone());
    //     info!("🔍 Hyperlane Status for TX {}: {}", tx_hash, status);

    //     Ok(status)
    // }
}
