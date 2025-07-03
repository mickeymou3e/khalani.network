use crate::{key_manager::KeyManagerTrait, rpc::MedusaRpcServer, storage::StorageService};
use anyhow::anyhow;
use apm::*;
use medusa_types::{
    ws::WsBroadcastMessage, FillStructure, IntentId, RefinementStatus, SignedIntentId,
};
use tracing::{error, info, warn};

use alloy::{
    primitives::{Address, B256, U256},
    signers::local::PrivateKeySigner,
};
use jsonrpsee::{
    core::{async_trait, RpcResult},
    types::{ErrorCode, ErrorObjectOwned},
};
use medusa_types::{Intent, IntentState, SignedIntent, SignedSolution};
use medusa_types::{IntentErrorType, IntentHistory};
use tokio::sync::broadcast::Sender;

use crate::chain::TransactionError;

use std::sync::Arc;
use std::time::Instant;

use super::SignedAddress;
use crate::chain::ChainServiceTrait;
use crate::rpc::RpcIntentState;

fn convert_rpc_intent_state(state: IntentState) -> RpcIntentState {
    match state {
        IntentState::Open => RpcIntentState::Open,
        IntentState::Solved => RpcIntentState::Solved,
        IntentState::Expired => RpcIntentState::Expired,
        IntentState::Cancelled => RpcIntentState::Cancelled,
        IntentState::Error => RpcIntentState::Error,
    }
}

fn convert_intent_state_option(opt: Option<IntentState>) -> Option<RpcIntentState> {
    opt.map(convert_rpc_intent_state)
}

fn convert_intent_state_result(
    ret: RpcResult<Option<IntentState>>,
) -> RpcResult<Option<RpcIntentState>> {
    ret.map(convert_intent_state_option)
}

pub struct MedusaRpcImpl<C: ChainServiceTrait, K: KeyManagerTrait> {
    key_manager: K,
    chain: Arc<C>,
    store: Arc<StorageService>,
    ws_tx: Arc<Sender<WsBroadcastMessage>>,
}

impl<C: ChainServiceTrait, K: KeyManagerTrait> MedusaRpcImpl<C, K> {
    pub fn new(
        key_manager: K,
        chain: Arc<C>,
        store: Arc<StorageService>,
        ws_tx: Arc<Sender<WsBroadcastMessage>>,
    ) -> Self {
        Self {
            key_manager,
            chain,
            store,
            ws_tx,
        }
    }
}

#[async_trait]
impl<C: ChainServiceTrait, K: KeyManagerTrait + Send + Sync + 'static> MedusaRpcServer
    for MedusaRpcImpl<C, K>
{
    async fn get_liquidity_intents_by_author(&self, author: Address) -> RpcResult<Vec<Intent>> {
        let start = Instant::now();
        let ret = {
            let ids = self
                .store
                .get_intent_ids_by_author(author)
                .await
                .map_err(rpc_error)?;
            let mut intents = vec![];
            for id in ids {
                let intent = self.store.get_intent(&id).await.map_err(rpc_error)?;
                if intent.is_some()
                    && intent.as_ref().unwrap().outcome.fill_structure
                        == FillStructure::PercentageFilled
                {
                    intents.push(intent.unwrap());
                }
            }
            Ok(intents)
        };
        if ret.is_ok() {
            info!(author = ?author, "get_liquidity_intents_by_author succeeded");
            api_request_result_counter_vec_static()
                .getLiquidityIntentsByAuthor
                .success
                .inc();
        } else {
            error!(author = ?author, "get_liquidity_intents_by_author failed");
            api_request_result_counter_vec_static()
                .getLiquidityIntentsByAuthor
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getLiquidityIntentsByAuthor
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_bridge_intents_by_author(&self, author: Address) -> RpcResult<Vec<Intent>> {
        let start = Instant::now();
        let ret = {
            let ids = self
                .store
                .get_intent_ids_by_author(author)
                .await
                .map_err(rpc_error)?;
            let mut intents = vec![];
            for id in ids {
                let intent = self.store.get_intent(&id).await.map_err(rpc_error)?;
                if intent.is_some()
                    && intent.as_ref().unwrap().outcome.fill_structure
                        != FillStructure::PercentageFilled
                {
                    intents.push(intent.unwrap());
                }
            }
            Ok(intents)
        };
        if ret.is_ok() {
            info!(author = ?author, "get_liquidity_intents_by_author succeeded");
            api_request_result_counter_vec_static()
                .getLiquidityIntentsByAuthor
                .success
                .inc();
        } else {
            error!(author = ?author, "get_liquidity_intents_by_author failed");
            api_request_result_counter_vec_static()
                .getLiquidityIntentsByAuthor
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getLiquidityIntentsByAuthor
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_failed_intents_since_timestamp(
        &self,
        timestamp: u64,
    ) -> RpcResult<Vec<(IntentHistory, Intent)>> {
        let start = Instant::now();
        info!(timestamp = %timestamp, "received rpc request: get_failed_intent_histories_after_timestamp");
        let ret = self
            .store
            .get_failed_intents_after_timestamp(timestamp)
            .await
            .map_err(rpc_error);
        if ret.is_ok() {
            info!(timestamp = %timestamp, "get_failed_intents_after_timestamp succeeded");
            api_request_result_counter_vec_static()
                .getFailedIntentsSince
                .success
                .inc();
        } else {
            error!(timestamp = %timestamp, "get_failed_intents_after_timestamp failed");
            api_request_result_counter_vec_static()
                .getFailedIntentsSince
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getFailedIntentsSince
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_solution_for_intent(&self, intent_id: B256) -> RpcResult<Option<SignedSolution>> {
        info!(intent_id = %intent_id, "received rpc request: get_solution_for_intent");
        let start = Instant::now();

        let ret = self
            .store
            .get_solution_by_intent_id(&intent_id)
            .await
            .map_err(rpc_error);

        if ret.is_ok() {
            info!(intent_id = %intent_id, "get_solution_for_intent succeeded");
            api_request_result_counter_vec_static()
                .getSolutionForIntent
                .success
                .inc();
        } else {
            error!(intent_id = %intent_id, "get_solution_for_intent failed");
            api_request_result_counter_vec_static()
                .getSolutionForIntent
                .failure
                .inc();
        }

        api_request_time_histogram_static()
            .getSolutionForIntent
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_history_for_intent(
        &self,
        intent_id: IntentId,
    ) -> RpcResult<(IntentHistory, Intent)> {
        let start = Instant::now();
        info!(intent_id = %intent_id, "received rpc request: get_history_for_intent");
        let history = self
            .store
            .get_history_for_intent(&intent_id)
            .await
            .map_err(rpc_error);
        if history.is_err() {
            error!(intent_id = %intent_id, "get_history_for_intent failed in getting history object: {}", history.err().unwrap());
            api_request_result_counter_vec_static()
                .getHistoryForIntent
                .failure
                .inc();
            api_request_time_histogram_static()
                .getHistoryForIntent
                .observe(duration_to_sec(start.elapsed()));
            return Err(rpc_error(anyhow!("get_history_for_intent failed")));
        } else {
            let history = history.unwrap();
            if history == IntentHistory::default() {
                warn!(intent_id = %intent_id, "intent history does not exist");
                api_request_result_counter_vec_static()
                    .getHistoryForIntent
                    .failure
                    .inc();
                api_request_time_histogram_static()
                    .getHistoryForIntent
                    .observe(duration_to_sec(start.elapsed()));
                return Err(rpc_error(anyhow!("get_history_for_intent failed")));
            }
            let intent = self.store.get_intent(&intent_id).await.map_err(rpc_error)?;
            if intent.is_none() {
                warn!(intent_id = %intent_id, "intent does not exist");
                api_request_result_counter_vec_static()
                    .getHistoryForIntent
                    .failure
                    .inc();
                api_request_time_histogram_static()
                    .getHistoryForIntent
                    .observe(duration_to_sec(start.elapsed()));
                return Err(rpc_error(anyhow!("get_history_for_intent failed")));
            } else {
                info!(intent_id = %intent_id, "get_history_for_intent succeeded");
                api_request_result_counter_vec_static()
                    .getHistoryForIntent
                    .success
                    .inc();
                api_request_time_histogram_static()
                    .getHistoryForIntent
                    .observe(duration_to_sec(start.elapsed()));
                return Ok((history, intent.unwrap()));
            }
        }
    }

    async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>> {
        info!("received rpc request: get_connected_solvers");
        let start = Instant::now();
        let ret = self
            .store
            .get_connected_solvers(100)
            .await
            .map_err(rpc_error);

        if ret.is_ok() {
            api_request_result_counter_vec_static()
                .getConnectedSolvers
                .success
                .inc();
        } else {
            api_request_result_counter_vec_static()
                .getConnectedSolvers
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getConnectedSolvers
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_solutions_for_solver(
        &self,
        solver_address: Address,
    ) -> RpcResult<Vec<SignedSolution>> {
        info!(addr = ?solver_address, "received rpc request: get_solutions_for_solver");
        let start = Instant::now();
        let ret = self
            .store
            .get_solutions_by_solver(&solver_address)
            .await
            .map_err(rpc_error);

        if ret.is_ok() {
            info!(addr = ?solver_address, "get_solutions_for_solver succeeded");
            api_request_result_counter_vec_static()
                .getSolutionsForSolver
                .success
                .inc();
        } else {
            error!(addr = ?solver_address, "get_solutions_for_solver failed");
            api_request_result_counter_vec_static()
                .getSolutionsForSolver
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getSolutionsForSolver
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_intent(&self, intent_id: B256) -> RpcResult<Option<Intent>> {
        info!(intent_id = %intent_id, "received rpc request: get_intent");
        let start = Instant::now();
        let ret = self.store.get_intent(&intent_id).await.map_err(rpc_error);

        if ret.is_ok() {
            info!(intent_id = %intent_id, "get_intent succeeded");
            api_request_result_counter_vec_static()
                .getIntent
                .success
                .inc();
        } else {
            error!(intent_id = %intent_id, "get_intent failed");
            api_request_result_counter_vec_static()
                .getIntent
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getIntent
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_intent_status(&self, intent_id: B256) -> RpcResult<Option<RpcIntentState>> {
        info!(intent_id = %intent_id, "received rpc request: get_intent_status");
        let start = Instant::now();

        let ret = self
            .store
            .get_intent_status(&intent_id)
            .await
            .map_err(rpc_error);

        if ret.is_ok() {
            info!(intent_id = %intent_id, "get_intent_status succeeded");
            api_request_result_counter_vec_static()
                .getIntentStatus
                .success
                .inc();
        } else {
            error!(intent_id = %intent_id, "get_intent_status failed");
            api_request_result_counter_vec_static()
                .getIntentStatus
                .failure
                .inc();
        }

        api_request_time_histogram_static()
            .getIntentStatus
            .observe(duration_to_sec(start.elapsed()));
        convert_intent_state_result(ret)
    }

    async fn create_refinement(&self, intent: Intent) -> RpcResult<IntentId> {
        info!(intent = ?intent, "received rpc request: create_refinement");
        let start = Instant::now();
        let id = intent.intent_id();
        let ret = self.store.insert_refinement(id).await.map_err(rpc_error);
        if ret.is_ok() {
            info!(
                intent_id = %id,
                "database updated for new refinement."
            );
            self.ws_tx
                .send(WsBroadcastMessage::RefinementNeededForIntent(intent))
                .unwrap();
            info!(
                intent_id = %id,
                "refinement request broadcasted to solvers."
            );
            api_request_result_counter_vec_static()
                .createRefinement
                .success
                .inc();
            api_request_time_histogram_static()
                .createRefinement
                .observe(duration_to_sec(start.elapsed()));
            return Ok(id);
        } else {
            api_request_result_counter_vec_static()
                .createRefinement
                .failure
                .inc();
            api_request_time_histogram_static()
                .createRefinement
                .observe(duration_to_sec(start.elapsed()));
            return Err(rpc_error(anyhow!("create_refinement failed")));
        }
    }

    async fn query_refinement(&self, intent_id: IntentId) -> RpcResult<Option<RefinementStatus>> {
        info!(intent_id = %intent_id, "received rpc request: query_refinement");
        let start = Instant::now();
        let ret = self
            .store
            .get_refinement(intent_id)
            .await
            .map_err(rpc_error);
        if ret.is_ok() {
            api_request_result_counter_vec_static()
                .queryRefinement
                .success
                .inc();
        } else {
            api_request_result_counter_vec_static()
                .queryRefinement
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .queryRefinement
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn propose_intent(&self, intent: SignedIntent) -> RpcResult<(B256, IntentId)> {
        let intent_id = intent.intent.intent_id();
        info!(intent_id = %intent_id, "received rpc request: propose_intent");
        let start = Instant::now();

        let chain = Arc::clone(&self.chain);
        let store = Arc::clone(&self.store);
        let ws_tx = Arc::clone(&self.ws_tx);

        let ret = match chain.post_intent(&intent).await {
            Ok(tx_hash) => {
                api_request_result_counter_vec_static()
                    .proposeIntent
                    .success
                    .inc();
                info!(intent_id = %intent_id,tx_hash = %tx_hash, "`publishIntent`: contract call succeeded.");
                store
                    .record_published_intent(&intent, tx_hash)
                    .await
                    .map_err(rpc_error)?;
                open_intent_gauge().add(1);
                info!(intent_id = %intent_id, "database updated for new intent.");
                ws_tx
                    .send(WsBroadcastMessage::NewIntent(intent.intent.clone()))
                    .unwrap();
                info!(
                    intent_id = %intent_id,
                    "new intent broadcasted to solvers."
                );
                Ok((tx_hash, intent_id))
            }
            Err(error) => {
                api_request_result_counter_vec_static()
                    .proposeIntent
                    .failure
                    .inc();
                let transaction_error = error.downcast::<TransactionError>().unwrap_or_default();
                let tx_hash = transaction_error.tx_hash;
                let error_message = transaction_error.message;
                error!(intent_id = %intent_id, tx_hash = %tx_hash, "`publishIntent`: contract call failed.");
                failed_intent_gauge().add(1);
                store
                    .record_publishing_failure(&intent, tx_hash)
                    .await
                    .map_err(rpc_error)?;
                Err(rpc_error(anyhow!(
                    "post intent failed for intent id {}, transaction hash {}, revert message: {}",
                    intent_id,
                    tx_hash,
                    error_message
                )))
            }
        };
        api_request_time_histogram_static()
            .proposeIntent
            .observe(duration_to_sec(start.elapsed()));

        ret
    }

    async fn withdraw_mtokens(
        &self,
        signed_owner: SignedAddress,
        mtoken: Address,
        amount: U256,
    ) -> RpcResult<B256> {
        info!(signed_owner = ?signed_owner, mtoken = ?mtoken, amount = ?amount, "received rpc request: withdraw_mtokens");
        let owner = signed_owner.address;
        let sig = signed_owner.signature;
        if let Ok(sign_address) = sig.recover_address_from_msg(&owner) {
            if sign_address != owner {
                error!(owner = ?owner, sign_address = ?sign_address, "signature check failed.");
                return Err(rpc_error(anyhow!("Unauthorized mtoken withdrawal")));
            }
        } else {
            error!(owner = ?owner, "signature check failed.");
            return Err(rpc_error(anyhow!("Unauthorized mtoken withdrawal")));
        }
        let start = Instant::now();
        let chain = Arc::clone(&self.chain);
        let ret = chain
            .withdraw_mtokens(owner, mtoken, amount)
            .await
            .map_err(rpc_error);
        if ret.is_ok() {
            info!(owner = ?owner, mtoken = ?mtoken, amount = ?amount, "withdraw_mtokens succeeded");
            api_request_result_counter_vec_static()
                .withdrawMtokens
                .success
                .inc();
        } else {
            error!(owner = ?owner, mtoken = ?mtoken, amount = ?amount, "withdraw_mtokens failed");
            api_request_result_counter_vec_static()
                .withdrawMtokens
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .withdrawMtokens
            .observe(duration_to_sec(start.elapsed()));
        ret
    }
    async fn cancel_intent(&self, signed_intent_id: SignedIntentId) -> RpcResult<B256> {
        let intent_id = signed_intent_id.intent_id;
        info!(intent_id = %intent_id, "received rpc request: cancel_intent");
        let sig = signed_intent_id.signature;
        let start = Instant::now();
        let chain = Arc::clone(&self.chain);
        let store = Arc::clone(&self.store);
        let ws_tx = Arc::clone(&self.ws_tx);

        let intent = store.get_intent(&intent_id).await.map_err(rpc_error)?;
        match intent.as_ref() {
            Some(intent) => {
                let author = intent.author;
                if let Ok(addr) = sig.recover_address_from_msg(&intent_id) {
                    if addr != author {
                        error!(intent_id = ?intent_id, author = ?author, signer_addr = ?addr, "signature check failed.");
                        return Err(rpc_error(anyhow!("Unauthorized intent cancellation")));
                    }
                } else {
                    error!(intent_id = ?intent_id, signature = ?sig, "signature check failed.");
                    return Err(rpc_error(anyhow!("Unauthorized intent cancellation")));
                }
            }
            None => {
                error!(intent_id = ?intent_id, "Intent does not exist.");
                return Err(rpc_error(anyhow!("Intent does not exist")));
            }
        };

        let intent = intent.unwrap();
        let mtoken = intent.src_m_token;
        let amount = intent.src_amount;
        let author = intent.author;
        let ret = {
            match chain.cancel_intent(&intent_id).await {
                Ok(cancel_tx_hash) => {
                    store
                        .cancel_intent(&intent_id, cancel_tx_hash)
                        .await
                        .map_err(rpc_error)?;
                    info!(intent_id = %intent_id, intent_state = "cancelled", "database updated for intent state.");
                    ws_tx
                        .send(WsBroadcastMessage::IntentStatusUpdated(
                            intent_id,
                            IntentState::Cancelled,
                        ))
                        .unwrap();
                    info!(intent_id = %intent_id, "intent cancel message broadcasted to solvers.");
                    canceled_intent_gauge().add(1);
                    open_intent_gauge().sub(1);

                    tokio::spawn(async move {
                        match chain
                            .withdraw_intent(&intent_id, author, mtoken, amount, Arc::clone(&store))
                            .await
                        {
                            Ok(withdraw_tx_hash) => {
                                info!(intent_id = %intent_id, "withdrawal succeeded after cancellation.");
                                store
                                    .update_history_after_hub_withdrawal(
                                        &intent_id,
                                        withdraw_tx_hash,
                                    )
                                    .await
                                    .map_err(rpc_error)?;
                            }
                            Err(error) => {
                                info!(intent_id = %intent_id, "withdrawal failed after cancellation. {:?}", error);
                                let transaction_error =
                                    error.downcast::<TransactionError>().unwrap_or_default();
                                let withdraw_tx_hash = transaction_error.tx_hash;
                                failed_intent_gauge().add(1);
                                store
                                    .record_existing_intent_failure(
                                        &intent_id,
                                        IntentErrorType::Withdraw,
                                        withdraw_tx_hash,
                                    )
                                    .await
                                    .map_err(rpc_error)?;
                            }
                        };
                        Ok::<(), anyhow::Error>(())
                    });

                    Ok(cancel_tx_hash)
                }
                Err(error) => {
                    let transaction_error =
                        error.downcast::<TransactionError>().unwrap_or_default();
                    let tx_hash = transaction_error.tx_hash;
                    let error_message = transaction_error.message;
                    error!(intent_id = %intent_id, tx_hash = %tx_hash, error_message = %error_message, "`cancelIntent`: contract call failed.");
                    open_intent_gauge().sub(1);
                    failed_intent_gauge().add(1);
                    store
                        .record_existing_intent_failure(
                            &intent_id,
                            IntentErrorType::Cancel,
                            tx_hash,
                        )
                        .await
                        .map_err(rpc_error)?;
                    Err(rpc_error(anyhow!("post intent failed.")))
                }
            }
        };

        if ret.is_ok() {
            api_request_result_counter_vec_static()
                .cancelIntent
                .success
                .inc();
            info!(intent_id = %intent_id, "cancel_intent succeeded");
        } else {
            error!(intent_id = %intent_id, "cancel_intent failed");
            api_request_result_counter_vec_static()
                .cancelIntent
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .cancelIntent
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_nonce(&self, user: Address) -> RpcResult<U256> {
        let start = Instant::now();
        let ret = self.chain.get_nonce(user).await.map_err(rpc_error);
        info!(
            user_address = %user,
            "contract query succeeded."
        );
        if ret.is_ok() {
            info!(user_address = %user, "get_nonce succeeded, nonce: {}", ret.as_ref().unwrap());
            api_request_result_counter_vec_static()
                .getNonce
                .success
                .inc();
        } else {
            error!(user_address = %user, "get_nonce failed");
            api_request_result_counter_vec_static()
                .getNonce
                .failure
                .inc();
        }

        api_request_time_histogram_static()
            .getNonce
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn get_intent_ids_by_author(&self, author: Address) -> RpcResult<Vec<IntentId>> {
        info!(author = ?author, "received rpc request: get_intent_ids_by_author");
        let start = Instant::now();
        let ret = self
            .store
            .get_intent_ids_by_author(author)
            .await
            .map_err(rpc_error);
        if ret.is_ok() {
            info!(author = ?author, "get_intent_ids_by_author succeeded");
            api_request_result_counter_vec_static()
                .getIntentIdsByAuthor
                .success
                .inc();
        } else {
            error!(author = ?author, "get_intent_ids_by_author failed");
            api_request_result_counter_vec_static()
                .getIntentIdsByAuthor
                .failure
                .inc();
        }
        api_request_time_histogram_static()
            .getIntentIdsByAuthor
            .observe(duration_to_sec(start.elapsed()));
        ret
    }

    async fn request_add_solver(&self, signed_solver_address: SignedAddress) -> RpcResult<()> {
        info!(addr = ?signed_solver_address.address, "received rpc request: request_add_solver");
        let solver_address = signed_solver_address.address;
        let signer = signed_solver_address
            .signature
            .recover_address_from_msg(solver_address)
            .map_err(|e| rpc_error(anyhow!(e)))?;
        let key = self.key_manager.get_medusa_key().await.map_err(rpc_error)?;
        let authorized_signer: PrivateKeySigner = key.parse().unwrap();
        if signer == authorized_signer.address() {
            info!("address verification passed");
            let store = Arc::clone(&self.store);
            store
                .authorize_new_solver(solver_address)
                .await
                .map_err(rpc_error)?;
            Ok(())
        } else {
            warn!("address verification failed");
            Err(rpc_error(anyhow!("Unauthorized solver address")))
        }
    }
}

fn rpc_error(err: anyhow::Error) -> ErrorObjectOwned {
    error!(%err);
    ErrorObjectOwned::owned(ErrorCode::InternalError.code(), err.to_string(), Some(()))
}

#[cfg(test)]
mod tests {
    use alloy::signers::Signer;
    use std::str::FromStr;

    use super::*;
    use crate::rpc::test_utils::*;
    use mockall::mock;
    use tracing_subscriber::{fmt, EnvFilter};
    mock! {
        pub KeyManager {}

        #[async_trait::async_trait]
        impl KeyManagerTrait for KeyManager {
            async fn get_medusa_key(&self) -> anyhow::Result<String>;
        }
    }
    fn init_tracing() {
        static INIT: std::sync::Once = std::sync::Once::new();
        INIT.call_once(|| {
            let _ = fmt()
                .with_env_filter(
                    EnvFilter::from_default_env().add_directive("debug=info".parse().unwrap()),
                )
                .with_test_writer()
                .try_init();
        });
    }

    #[tokio::test]
    async fn test_propose_intent_success() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mock_key_manager = MockKeyManager::new();

        let sender = Arc::new(Sender::new(100));
        let mut receiver = sender.subscribe();

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
        let tx_hash = B256::random();
        mock_chain_service_inner
            .expect_post_intent()
            .returning(move |_| Ok(tx_hash));

        let rpc = MedusaRpcImpl::new(
            mock_key_manager,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::clone(&sender),
        );
        let intent = create_dummy_signed_intent(current_timestamp());
        let ret = rpc.propose_intent(intent.clone()).await;
        assert_eq!(ret, Ok((tx_hash, intent.intent.intent_id())));
        let msg = receiver.recv().await.unwrap();
        match msg {
            WsBroadcastMessage::NewIntent(intent) => {
                assert_eq!(intent.intent_id(), intent.intent_id());
            }
            _ => panic!("expected new intent"),
        }
        let stored_intent_status = mock_storage_service
            .get_intent_status(&intent.intent.intent_id())
            .await
            .unwrap()
            .unwrap();
        assert_eq!(stored_intent_status, IntentState::Open);
    }

    #[tokio::test]
    async fn test_propose_intent_failure() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mock_key_manager = MockKeyManager::new();

        let sender = Arc::new(Sender::new(100));
        let _receiver = sender.subscribe();

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
        mock_chain_service_inner
            .expect_post_intent()
            .returning(|_| Err(anyhow!(B256::random())));

        let rpc = MedusaRpcImpl::new(
            mock_key_manager,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::clone(&sender),
        );

        let intent = create_dummy_signed_intent(current_timestamp());
        let ret = rpc.propose_intent(intent.clone()).await;
        assert!(ret.is_err());

        let stored_intent_status = mock_storage_service
            .get_intent_status(&intent.intent.intent_id())
            .await
            .unwrap()
            .unwrap();
        assert_eq!(stored_intent_status, IntentState::Error);
    }

    #[tokio::test]
    async fn test_cancel_intent_success() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mock_key_manager = MockKeyManager::new();

        let sender = Arc::new(Sender::new(100));
        let mut receiver = sender.subscribe();

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
        mock_chain_service_inner
            .expect_post_intent()
            .returning(|_| Ok(B256::random()));
        mock_chain_service_inner
            .expect_cancel_intent()
            .returning(|_| Ok(B256::random()));
        mock_chain_service_inner
            .expect_withdraw_intent()
            .returning(|_, _, _, _, _| Ok(B256::random()));

        let rpc = MedusaRpcImpl::new(
            mock_key_manager,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::clone(&sender),
        );
        let key =
            String::from("0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6");
        let intent = create_mock_signed_intent(current_timestamp() + 1000, key.clone()).await;

        rpc.propose_intent(intent.clone()).await.unwrap();
        let msg = receiver.recv().await.unwrap();
        match msg {
            WsBroadcastMessage::NewIntent(_) => {}
            _ => panic!("expected new intent broadcast"),
        }
        let signer = PrivateKeySigner::from_str(&key).unwrap();
        let sig = signer
            .sign_message(intent.intent.intent_id().as_slice())
            .await
            .unwrap();
        let signed_intent_id = SignedIntentId {
            intent_id: intent.intent.intent_id(),
            signature: sig,
        };

        let ret = rpc.cancel_intent(signed_intent_id).await;
        assert!(ret.is_ok());
        // let tx_hashes = ret.unwrap();
        // assert_eq!(tx_hashes.len(), 2);
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
        let stored_intent_status = mock_storage_service
            .get_intent_status(&intent.intent.intent_id())
            .await
            .unwrap()
            .unwrap();
        assert_eq!(stored_intent_status, IntentState::Cancelled);
        let msg = receiver.recv().await.unwrap();
        match msg {
            WsBroadcastMessage::IntentStatusUpdated(intent_id, state) => {
                assert_eq!(intent_id, intent_id);
                assert_eq!(state, IntentState::Cancelled);
            }
            _ => panic!("expected intent status updated"),
        }
    }

    #[tokio::test]
    async fn test_cancel_intent_cancel_failure() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mock_key_manager = MockKeyManager::new();

        let sender = Arc::new(Sender::new(100));
        let mut receiver = sender.subscribe();

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
        mock_chain_service_inner
            .expect_post_intent()
            .returning(|_| Ok(B256::random()));
        mock_chain_service_inner
            .expect_cancel_intent()
            .returning(|_| Err(anyhow!(B256::random())));

        let rpc = MedusaRpcImpl::new(
            mock_key_manager,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::clone(&sender),
        );
        let key =
            String::from("0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6");
        let intent = create_mock_signed_intent(current_timestamp() + 1000, key.clone()).await;

        rpc.propose_intent(intent.clone()).await.unwrap();
        let msg = receiver.recv().await.unwrap();
        match msg {
            WsBroadcastMessage::NewIntent(_) => {}
            _ => panic!("expected new intent broadcast"),
        }
        let signer = PrivateKeySigner::from_str(&key).unwrap();
        let sig = signer
            .sign_message(intent.intent.intent_id().as_slice())
            .await
            .unwrap();
        let signed_intent_id = SignedIntentId {
            intent_id: intent.intent.intent_id(),
            signature: sig,
        };

        let ret = rpc.cancel_intent(signed_intent_id).await;
        assert!(ret.is_err());
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
        let stored_intent_status = mock_storage_service
            .get_intent_status(&intent.intent.intent_id())
            .await
            .unwrap()
            .unwrap();
        assert_eq!(stored_intent_status, IntentState::Error);
        let stored_history = mock_storage_service
            .get_history_for_intent(&intent.intent.intent_id())
            .await
            .unwrap();
        println!("stored_history: {:?}", stored_history);
    }

    #[tokio::test]
    async fn test_cancel_intent_withdraw_failure() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mock_key_manager = MockKeyManager::new();

        let sender = Arc::new(Sender::new(100));
        let mut receiver = sender.subscribe();

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
        mock_chain_service_inner
            .expect_post_intent()
            .returning(|_| Ok(B256::random()));
        mock_chain_service_inner
            .expect_cancel_intent()
            .returning(|_| Ok(B256::random()));
        mock_chain_service_inner
            .expect_withdraw_intent()
            .returning(|_, _, _, _, _| Err(anyhow!(B256::random())));

        let rpc = MedusaRpcImpl::new(
            mock_key_manager,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::clone(&sender),
        );
        let key =
            String::from("0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6");
        let intent = create_mock_signed_intent(current_timestamp() + 1000, key.clone()).await;

        rpc.propose_intent(intent.clone()).await.unwrap();
        let msg = receiver.recv().await.unwrap();
        match msg {
            WsBroadcastMessage::NewIntent(_) => {}
            _ => panic!("expected new intent broadcast"),
        }
        let signer = PrivateKeySigner::from_str(&key).unwrap();
        let sig = signer
            .sign_message(intent.intent.intent_id().as_slice())
            .await
            .unwrap();
        let signed_intent_id = SignedIntentId {
            intent_id: intent.intent.intent_id(),
            signature: sig,
        };

        let ret = rpc.cancel_intent(signed_intent_id).await;
        assert!(ret.is_ok());
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
        // let tx_hashe = ret.unwrap();
        // assert_eq!(tx_hashes.len(), 1);
        let stored_intent_status = mock_storage_service
            .get_intent_status(&intent.intent.intent_id())
            .await
            .unwrap()
            .unwrap();
        assert_eq!(stored_intent_status, IntentState::Error);
        let stored_history = mock_storage_service
            .get_history_for_intent(&intent.intent.intent_id())
            .await
            .unwrap();
        println!("stored_history: {:?}", stored_history);
    }

    #[tokio::test]
    async fn test_request_add_solver() {
        init_tracing();
        let (mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mut mock_key_manager = MockKeyManager::new();
        mock_key_manager.expect_get_medusa_key().returning(|| {
            Ok("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80".to_string())
        });
        let mut mock_key_manager_clone = MockKeyManager::new();
        mock_key_manager_clone
            .expect_get_medusa_key()
            .returning(|| {
                Ok(
                    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
                        .to_string(),
                )
            });
        let rpc = MedusaRpcImpl::new(
            mock_key_manager_clone,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::new(Sender::new(1)),
        );
        let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
        let key = mock_key_manager.get_medusa_key().await.unwrap();
        let signer = PrivateKeySigner::from_str(&key).unwrap();
        let sig = signer.sign_message(addr.as_slice()).await.unwrap();
        let signed_addr = SignedAddress {
            address: addr,
            signature: sig,
        };
        let ret = rpc.request_add_solver(signed_addr).await.unwrap();
        assert_eq!(ret, ());
    }

    #[tokio::test]
    async fn test_create_refinement() {
        init_tracing();
        let (mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let mock_key_manager = MockKeyManager::new();
        let sender = Arc::new(Sender::new(100));
        let mut receiver = sender.subscribe();
        let rpc = MedusaRpcImpl::new(
            mock_key_manager,
            Arc::clone(&mock_chain_service),
            Arc::clone(&mock_storage_service),
            Arc::clone(&sender),
        );
        let intent = create_dummy_signed_intent(current_timestamp()).intent;
        let intent_id = intent.intent_id();
        let ret = rpc.create_refinement(intent).await.unwrap();
        assert_eq!(ret, intent_id);
        let refinement = mock_storage_service
            .get_refinement(intent_id)
            .await
            .unwrap();
        assert!(refinement.is_none());
        let msg = receiver.recv().await.unwrap();
        match msg {
            WsBroadcastMessage::RefinementNeededForIntent(intent) => {
                assert_eq!(intent.intent_id(), intent_id);
            }
            _ => panic!("expected refinement needed for intent"),
        }
    }
}
