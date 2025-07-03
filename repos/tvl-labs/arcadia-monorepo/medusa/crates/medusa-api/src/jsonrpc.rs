use std::sync::Arc;

use alloy::primitives::{Address, B256, U256};
use anyhow::anyhow;
use jsonrpsee::core::{RpcResult, async_trait};
use jsonrpsee::types::{ErrorCode, ErrorObjectOwned};
use medusa_apm_derive::metrics;
use medusa_storage::{StorageService, StorageServiceTrait as _};
use medusa_tx_worker::{ChainServiceTrait, TransactionError};
use medusa_types::ws::WsBroadcastMessage;
use medusa_types::{
    FillStructure, Intent, IntentErrorType, IntentHistory, IntentId, IntentState, RefinementStatus,
    SignedIntent, SignedSolution,
};
use tokio::sync::broadcast::Sender;
use tracing::{error, info, warn};

use crate::payload_types::{SignedPayloadAddress, SignedPayloadIntentId, SignedWithdrawalPayload};
use crate::{MedusaRpcServer, RpcIntentState};

macro_rules! basic_payload_check {
    ($self_: ident, $payload: expr, $operation_name: expr) => {
        let inner_payload = &$payload.payload;
        if inner_payload.chain_id != $self_.chain_id {
            error!(operation = ?$operation_name, chain_id = ?inner_payload.chain_id, expected_chain_id = ?$self_.chain_id, "chain id mismatch");
            return Err(rpc_error(anyhow!(
                "{}: Chain id mismatch",
                $operation_name
            )));
        }

        let signer = $payload.recover_signer_address().map_err(rpc_error)?;
        if signer != inner_payload.address {
            error!(operation = ?$operation_name, signer = ?signer, "signature check failed");
            return Err(rpc_error(anyhow!(
                "{}: Signature check failed",
                $operation_name
            )));
        }

        let nonce = inner_payload.nonce;
        if $self_.store.check_and_update_nonce(nonce).await.is_err() {
            error!(operation = ?$operation_name, nonce = ?nonce, "nonce check failed");
            return Err(rpc_error(anyhow!(
                "{}: Nonce check failed",
                $operation_name
            )));
        }
    };
    ($self_: ident, $payload: expr, $expect_address: expr, $operation_name: expr) => {
        let inner_payload = $payload.payload.clone();
        if inner_payload.chain_id != $self_.chain_id {
            error!(operation = ?$operation_name, chain_id = ?inner_payload.chain_id, expected_chain_id = ?$self_.chain_id, "chain id mismatch");
            return Err(rpc_error(anyhow!(
                "{}: Chain id mismatch",
                $operation_name
            )));
        }

        let signer = $payload.recover_signer_address().map_err(rpc_error)?;
        if signer != $expect_address {
            error!(operation = ?$operation_name, signer = ?signer, "signature check failed");
            return Err(rpc_error(anyhow!(
                "{}: Signature check failed",
                $operation_name
            )));
        }

        let nonce = inner_payload.nonce;
        if $self_.store.check_and_update_nonce(nonce).await.is_err() {
            error!(operation = ?$operation_name, nonce = ?nonce, "nonce check failed");
            return Err(rpc_error(anyhow!(
                "{}: Nonce check failed",
                $operation_name
            )));
        }
    };
}

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

pub struct MedusaRpcImpl<C: ChainServiceTrait> {
    medusa_signer_address: Address,
    chain: Arc<C>,
    store: StorageService,
    ws_tx: Sender<WsBroadcastMessage>,
    chain_id: u64,
}

impl<C: ChainServiceTrait> MedusaRpcImpl<C> {
    pub async fn new(
        medusa_signer_address: Address,
        chain: Arc<C>,
        store: StorageService,
        ws_tx: Sender<WsBroadcastMessage>,
    ) -> Self {
        Self {
            medusa_signer_address,
            chain_id: chain.get_chain_id().await,
            chain,
            store,
            ws_tx,
        }
    }
}

#[async_trait]
impl<C: ChainServiceTrait> MedusaRpcServer for MedusaRpcImpl<C> {
    #[metrics]
    async fn get_liquidity_intents_by_author(&self, author: Address) -> RpcResult<Vec<Intent>> {
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
    }

    #[metrics]
    async fn get_bridge_intents_by_author(&self, author: Address) -> RpcResult<Vec<Intent>> {
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
    }

    #[metrics("getFailedIntentsSince")]
    async fn get_failed_intents_since_timestamp(
        &self,
        timestamp: u64,
    ) -> RpcResult<Vec<(IntentHistory, Intent)>> {
        info!(timestamp = %timestamp, "received rpc request: get_failed_intent_histories_after_timestamp");
        self.store
            .get_failed_intents_after_timestamp(timestamp)
            .await
            .map_err(rpc_error)
    }

    #[metrics]
    async fn get_solution_for_intent(&self, intent_id: B256) -> RpcResult<Option<SignedSolution>> {
        info!(intent_id = %intent_id, "received rpc request: get_solution_for_intent");
        self.store
            .get_solution_by_intent_id(&intent_id)
            .await
            .map_err(rpc_error)
    }

    #[metrics]
    async fn get_history_for_intent(
        &self,
        intent_id: IntentId,
    ) -> RpcResult<(IntentHistory, Intent)> {
        info!(intent_id = %intent_id, "received rpc request: get_history_for_intent");
        let history = self
            .store
            .get_history_for_intent(&intent_id)
            .await
            .map_err(rpc_error);
        if history.is_err() {
            error!(intent_id = %intent_id, "get_history_for_intent failed in getting history object: {}", history.err().unwrap());
            return Err(rpc_error(anyhow!("get_history_for_intent failed")));
        } else {
            let history = history.unwrap();
            if history == IntentHistory::default() {
                warn!(intent_id = %intent_id, "intent history does not exist");
                return Err(rpc_error(anyhow!("get_history_for_intent failed")));
            }
            let intent = self.store.get_intent(&intent_id).await.map_err(rpc_error)?;
            if intent.is_none() {
                warn!(intent_id = %intent_id, "intent does not exist");
                return Err(rpc_error(anyhow!("get_history_for_intent failed")));
            } else {
                info!(intent_id = %intent_id, "get_history_for_intent succeeded");
                return Ok((history, intent.unwrap()));
            }
        }
    }

    #[metrics]
    async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>> {
        info!("received rpc request: get_connected_solvers");
        self.store
            .get_connected_solvers(100)
            .await
            .map_err(rpc_error)
    }

    #[metrics]
    async fn get_solutions_for_solver(
        &self,
        solver_address: Address,
    ) -> RpcResult<Vec<SignedSolution>> {
        info!(addr = ?solver_address, "received rpc request: get_solutions_for_solver");
        self.store
            .get_solutions_by_solver(&solver_address)
            .await
            .map_err(rpc_error)
    }

    #[metrics]
    async fn get_intent(&self, intent_id: B256) -> RpcResult<Option<Intent>> {
        info!(intent_id = %intent_id, "received rpc request: get_intent");
        self.store.get_intent(&intent_id).await.map_err(rpc_error)
    }

    #[metrics]
    async fn get_intent_status(&self, intent_id: B256) -> RpcResult<Option<RpcIntentState>> {
        info!(intent_id = %intent_id, "received rpc request: get_intent_status");

        self.store
            .get_intent_status(&intent_id)
            .await
            .map(convert_intent_state_option)
            .map_err(rpc_error)
    }

    #[metrics]
    async fn create_refinement(&self, intent: Intent) -> RpcResult<IntentId> {
        info!(intent = ?intent, "received rpc request: create_refinement");
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
            return Ok(id);
        } else {
            return Err(rpc_error(anyhow!("create_refinement failed")));
        }
    }

    #[metrics]
    async fn query_refinement(&self, intent_id: IntentId) -> RpcResult<Option<RefinementStatus>> {
        info!(intent_id = %intent_id, "received rpc request: query_refinement");
        self.store
            .get_refinement(intent_id)
            .await
            .map_err(rpc_error)
    }

    #[metrics]
    async fn propose_intent(&self, intent: SignedIntent) -> RpcResult<(B256, IntentId)> {
        let intent_id = intent.intent.intent_id();
        info!(intent_id = %intent_id, "received rpc request: propose_intent");

        let chain = Arc::clone(&self.chain);
        let store = self.store.clone();
        let ws_tx = self.ws_tx.clone();

        let ret = match chain.post_intent(&intent).await {
            Ok(tx_hash) => {
                info!(intent_id = %intent_id,tx_hash = %tx_hash, "`publishIntent`: contract call succeeded.");
                store
                    .record_published_intent(&intent, tx_hash)
                    .await
                    .map_err(rpc_error)?;
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
                let transaction_error = error.downcast::<TransactionError>().unwrap_or_default();
                let tx_hash = transaction_error.tx_hash;
                let error_message = transaction_error.message;
                error!(intent_id = %intent_id, tx_hash = %tx_hash, "`publishIntent`: contract call failed.");
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

        ret
    }

    #[metrics]
    async fn withdraw_mtokens(&self, signed_payload: SignedWithdrawalPayload) -> RpcResult<B256> {
        let chain = Arc::clone(&self.chain);

        let address = signed_payload.payload.address;
        let mtoken = signed_payload.payload.mtoken;
        let amount = signed_payload.payload.amount;
        info!(address = ?address, mtoken = ?mtoken, amount = ?amount, "received rpc request: withdraw_mtokens");

        basic_payload_check!(self, signed_payload, "withdraw_mtokens");

        chain
            .withdraw_mtokens(address, mtoken, amount)
            .await
            .map_err(rpc_error)
    }

    #[metrics]
    async fn cancel_intent(&self, signed_intent_id: SignedPayloadIntentId) -> RpcResult<B256> {
        let intent_id = signed_intent_id.payload.intent_id;
        info!(intent_id = %intent_id, "received rpc request: cancel_intent");

        let intent_author = self.store.get_intent(&intent_id).await.map_err(rpc_error)?;
        if intent_author.is_none() {
            error!(intent_id = %intent_id, "Intent does not exist.");
            return Err(rpc_error(anyhow!(
                "Unauthorized intent cancellation: Intent does not exist"
            )));
        }

        basic_payload_check!(
            self,
            signed_intent_id,
            intent_author.unwrap().author,
            "cancel_intent"
        );

        let chain = Arc::clone(&self.chain);
        let store = self.store.clone();
        let ws_tx = self.ws_tx.clone();

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
                Ok(cancel_tx_hash)
            }
            Err(error) => {
                let transaction_error = error.downcast::<TransactionError>().unwrap_or_default();
                let tx_hash = transaction_error.tx_hash;
                let error_message = transaction_error.message;
                error!(intent_id = %intent_id, tx_hash = %tx_hash, error_message = %error_message, "`cancelIntent`: contract call failed.");
                store
                    .record_existing_intent_failure(&intent_id, IntentErrorType::Cancel, tx_hash)
                    .await
                    .map_err(rpc_error)?;
                Err(rpc_error(anyhow!("cancel intent failed.")))
            }
        }
    }

    #[metrics]
    async fn get_nonce(&self, user: Address) -> RpcResult<U256> {
        let ret = self.chain.get_nonce(user).await.map_err(rpc_error);
        info!(
            user_address = %user,
            "contract query succeeded."
        );
        ret
    }

    #[metrics]
    async fn get_intent_ids_by_author(&self, author: Address) -> RpcResult<Vec<IntentId>> {
        info!(author = ?author, "received rpc request: get_intent_ids_by_author");
        self.store
            .get_intent_ids_by_author(author)
            .await
            .map_err(rpc_error)
    }

    async fn request_add_solver(
        &self,
        signed_solver_address: SignedPayloadAddress,
    ) -> RpcResult<()> {
        let address = signed_solver_address.payload.address;
        info!(addr = ?address, "received rpc request: request_add_solver");
        basic_payload_check!(
            self,
            signed_solver_address,
            self.medusa_signer_address,
            "request_add_solver"
        );

        self.store
            .authorize_new_solver(address)
            .await
            .map_err(rpc_error)?;
        Ok(())
    }
}

fn rpc_error(err: anyhow::Error) -> ErrorObjectOwned {
    error!(%err);
    ErrorObjectOwned::owned(ErrorCode::InternalError.code(), err.to_string(), Some(()))
}
