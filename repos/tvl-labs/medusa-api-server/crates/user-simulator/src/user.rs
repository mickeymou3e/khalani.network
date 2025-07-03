use alloy::primitives::{Address, B256, U256};
use alloy::providers::ext::DebugApi;
use alloy::providers::ProviderBuilder;
use alloy::rpc::types::trace::geth::{GethDebugTracingOptions, GethTrace};
use anyhow::Result;
use dotenv::dotenv;
use jsonrpsee::core::client::ClientT;
use jsonrpsee::http_client::HttpClient;
use jsonrpsee::rpc_params;
use medusa_types::*;
use rustc_hash::FxHashMap as HashMap;
use serde::{Deserialize, Serialize};
use tracing::{error, info, warn};
pub struct User {
    http_client: HttpClient,
}
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum RpcIntentState {
    Open,
    Solved,
    Expired,
    Cancelled,
}

#[derive(Default, Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct IntentHistory {
    publish_timestamp: Option<u64>,
    publish_tx_hash: Option<B256>,
    solve_timestamp: Option<u64>,
    solve_tx_hash: Option<B256>,
    redeem_timestamp: Option<u64>,
    redeem_tx_hash: Option<B256>,
    pub withdraw_timestamp: Option<u64>,
    pub withdraw_tx_hash: Option<B256>,
    cancel_timestamp: Option<u64>,
    cancel_tx_hash: Option<B256>,
    remaining_intent_id: Option<IntentId>,
    error_timestamp: Option<u64>,
    error_tx_hash: Option<B256>,
    error_type: Option<IntentErrorType>,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum IntentErrorType {
    Publish,
    Cancel,
    Redeem,
    Withdraw,
}

#[derive(Default, Clone, Debug, Serialize, Deserialize)]
pub struct RpcIntentHistory {
    publish_timestamp: Option<u64>,
    publish_tx_hash: Option<B256>,
    solve_timestamp: Option<u64>,
    solve_tx_hash: Option<B256>,
    redeem_timestamp: Option<u64>,
    redeem_tx_hash: Option<B256>,
    withdraw_timestamp: Option<u64>,
    withdraw_tx_hash: Option<B256>,
    state_changes: HashMap<u64, (IntentState, B256)>,
    remaining_intent_id: Option<IntentId>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SignedAddress {
    pub address: Address,
    pub signature: alloy::primitives::Signature,
}

impl User {
    pub async fn new(url: String) -> Self {
        dotenv().ok();

        Self {
            http_client: HttpClient::builder()
                .build(url)
                .expect("Failed to create http client"),
        }
    }

    pub async fn request_add_solver(&self, addr: SignedAddress) -> Result<()> {
        let params = rpc_params![addr];
        let _ = self
            .http_client
            .request::<String, _>("requestAddSolver", params)
            .await?;
        Ok(())
    }

    pub async fn get_new_nonce(&self, address: Address) -> Result<U256> {
        let start = tokio::time::Instant::now();
        let params = rpc_params![address];
        info!("Getting nonce for address: {}", address);
        let res = self
            .http_client
            .request::<U256, _>("getNonce", params)
            .await;
        if res.is_err() {
            error!("Failed to get nonce for address: {}", address);
        }
        let nonce = res.unwrap();
        let duration = start.elapsed();
        info!(
            "Time taken to get nonce: {:?}, address: {}",
            duration, address
        );
        info!("Nonce for address {} is {}", address, nonce);
        Ok(nonce + U256::from(1))
    }

    pub async fn publish_intent(&self, intent: &SignedIntent) -> Result<()> {
        let start = tokio::time::Instant::now();
        let params = rpc_params![intent];
        let res = self
            .http_client
            .request::<(), _>("proposeIntent", params)
            .await;
        if res.is_err() {
            error!("Intent published failed with error: {}", res.err().unwrap());
        }
        info!("Intent published: {}", intent.intent.intent_id());
        let duration = start.elapsed();
        warn!(
            "Time taken to publish intent: {:?}, intent_id: {}",
            duration,
            intent.intent.intent_id(),
        );
        Ok(())
    }

    pub async fn cancel_intent(&self, intent_id: &SignedIntentId) -> Result<()> {
        let start = tokio::time::Instant::now();
        let params = rpc_params![intent_id];
        let res = self
            .http_client
            .request::<B256, _>("cancelIntent", params)
            .await;
        if res.is_err() {
            error!("Intent cancelled failed with error: {}", res.err().unwrap());
        }
        info!("Intent cancelled. {}", intent_id.intent_id);
        let duration = start.elapsed();
        warn!(
            "Time taken to cancel intent: {:?}, intent_id: {}",
            duration, intent_id.intent_id,
        );
        Ok(())
    }

    pub async fn check_intent_status(&self, intent_id: IntentId) -> Result<RpcIntentState> {
        let params = rpc_params![intent_id];
        let state = self
            .http_client
            .request::<RpcIntentState, _>("getIntentStatus", params)
            .await?;
        info!("The status of intent {} is {:#?}", intent_id, state);
        Ok(state)
    }

    pub async fn check_intent_history(&self, intent_id: IntentId) -> Result<RpcIntentHistory> {
        let params = rpc_params![intent_id];
        let history = self
            .http_client
            .request::<RpcIntentHistory, _>("getIntentStatus", params)
            .await?;
        info!("The history of intent {} is {:#?}", intent_id, history);
        Ok(history)
    }

    pub async fn request_refinement(&self, partial_intent: &Intent) -> Result<()> {
        let params = rpc_params![partial_intent];
        let id = self
            .http_client
            .request::<IntentId, _>("createRefinement", params)
            .await?;
        info!("refinement created for {}", id);
        Ok(())
    }

    pub async fn get_refinement_status(
        &self,
        intent_id: IntentId,
    ) -> Result<Option<RefinementStatus>> {
        let params = rpc_params![intent_id];
        let result = self.http_client.request("queryRefinement", params).await?;
        let refinement: Option<RefinementStatus> = serde_json::from_value(result)
            .map_err(|err| err.to_string())
            .unwrap();
        Ok(refinement)
    }

    pub async fn get_solution_for_intent(
        &self,
        intent_id: IntentId,
    ) -> Result<Option<SignedSolution>> {
        let params = rpc_params![intent_id];
        let result = self.http_client.request("getSolution", params).await?;
        let solution: Option<SignedSolution> = serde_json::from_value(result)
            .map_err(|err| err.to_string())
            .unwrap();
        Ok(solution)
    }
    pub async fn get_intent_history(&self, intent_id: IntentId) -> Result<(IntentHistory, Intent)> {
        let params = rpc_params![intent_id];
        let result = self.http_client.request("getHistory", params).await?;
        let history: (IntentHistory, Intent) = serde_json::from_value(result)
            .map_err(|err| err.to_string())
            .unwrap();
        Ok(history)
    }
    // pub async fn get_trace(&self) -> Result<GethTrace> {
    //     let hash = b256!("d69dec42fa91b3c5d6666eebb53d10ca238120451c8eae37cb79b0be359e9a79");
    //     let provider = ProviderBuilder::new().on_http("http://127.0.0.1:8545".parse().unwrap());
    //     // Trace with the default tracer.
    //     let default_options = GethDebugTracingOptions::default();
    //     let result = provider
    //         .debug_trace_transaction(hash, default_options)
    //         .await?;
    //     Ok(result)
    // }
}
