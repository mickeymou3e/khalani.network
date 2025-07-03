mod jsonrpc;
mod payload_types;
#[cfg(test)]
mod tests;
mod ws;

use std::net::SocketAddr;
use std::sync::Arc;

use alloy::primitives::{Address, B256, U256};
use alloy::providers::{Provider, WalletProvider};
use jsonrpsee::core::RpcResult;
use jsonrpsee::proc_macros::rpc;
use jsonrpsee::server::Server;
use medusa_storage::StorageService;
use medusa_tx_worker::ChainService;
use medusa_types::{
    Intent, IntentHistory, IntentId, RefinementStatus, SignedIntent, SignedSolution,
    WsBroadcastMessage,
};
use serde::{Deserialize, Serialize};
use tokio::sync::broadcast::Sender;
use tracing::{Level, info, span};

use crate::jsonrpc::MedusaRpcImpl;
use crate::payload_types::{SignedPayloadAddress, SignedPayloadIntentId, SignedWithdrawalPayload};
use crate::ws::ws_serve;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum RpcIntentState {
    NonExistent,
    Open,
    Locked,
    Solved,
    Settled,
    Expired,
    Cancelled,
    Error,
}

#[rpc(server)]
pub trait MedusaRpc {
    #[method(name = "getSolution")]
    async fn get_solution_for_intent(&self, intent_id: B256) -> RpcResult<Option<SignedSolution>>;

    #[method(name = "getConnectedSolvers")]
    async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>>;

    #[method(name = "getIntentIdsByAuthor")]
    async fn get_intent_ids_by_author(&self, author: Address) -> RpcResult<Vec<IntentId>>;

    #[method(name = "getLiquidityIntentsByAuthor")]
    async fn get_liquidity_intents_by_author(&self, author: Address) -> RpcResult<Vec<Intent>>;

    #[method(name = "getBridgeIntentsByAuthor")]
    async fn get_bridge_intents_by_author(&self, author: Address) -> RpcResult<Vec<Intent>>;

    #[method(name = "getSolutionsForSolver")]
    async fn get_solutions_for_solver(
        &self,
        solver_address: Address,
    ) -> RpcResult<Vec<SignedSolution>>;

    #[method(name = "getIntent")]
    async fn get_intent(&self, intent_id: B256) -> RpcResult<Option<Intent>>;

    #[method(name = "getIntentStatus")]
    async fn get_intent_status(&self, intent_id: B256) -> RpcResult<Option<RpcIntentState>>;

    #[method(name = "proposeIntent")]
    async fn propose_intent(&self, intent: SignedIntent) -> RpcResult<(B256, IntentId)>;

    #[method(name = "createRefinement")]
    async fn create_refinement(&self, intent: Intent) -> RpcResult<IntentId>;

    #[method(name = "queryRefinement")]
    async fn query_refinement(&self, intent_id: IntentId) -> RpcResult<Option<RefinementStatus>>;

    #[method(name = "cancelIntent")]
    async fn cancel_intent(&self, signed_intent_id: SignedPayloadIntentId) -> RpcResult<B256>;

    #[method(name = "getHistory")]
    async fn get_history_for_intent(&self, intent_id: B256) -> RpcResult<(IntentHistory, Intent)>;

    #[method(name = "withdrawMtokens")]
    async fn withdraw_mtokens(&self, signed_payload: SignedWithdrawalPayload) -> RpcResult<B256>;

    #[method(name = "getFailedIntentsSince")]
    async fn get_failed_intents_since_timestamp(
        &self,
        timestamp: u64,
    ) -> RpcResult<Vec<(IntentHistory, Intent)>>;

    #[method(name = "getNonce")]
    async fn get_nonce(&self, user: Address) -> RpcResult<U256>;

    #[method(name = "requestAddSolver")]
    async fn request_add_solver(&self, signed_address: SignedPayloadAddress) -> RpcResult<()>;
}

pub async fn run_rpc_server<P: Provider + 'static + WalletProvider>(
    medusa_signer_address: Address,
    rpc_url: SocketAddr,
    ws_url: SocketAddr,
    chain: ChainService<P>,
    store: StorageService,
    ws_tx: Sender<WsBroadcastMessage>,
) {
    let span = span!(Level::INFO, "start running rpc server.");
    let _guard = span.enter();
    let chain = Arc::new(chain);
    info!("Starting RPC server at {}", rpc_url);
    let rpc_server = Server::builder().build(rpc_url).await.unwrap();
    let rpc_handle = rpc_server.start(
        MedusaRpcImpl::new(
            medusa_signer_address,
            chain.clone(),
            store.clone(),
            ws_tx.clone(),
        )
        .await
        .into_rpc(),
    );

    tokio::spawn(rpc_handle.stopped());

    info!("Starting WebSocket server at {}", ws_url);
    ws_serve(ws_url, chain, store, ws_tx).await;
}
