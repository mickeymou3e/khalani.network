use alloy::primitives::{Address, B256, Signature, U256};
use anyhow::Result;
use async_trait::async_trait;
use medusa_types::{
    Intent, IntentErrorType, IntentHistory, IntentId, IntentState, RefinementStatus, SignedIntent,
    SignedSolution,
};

/// Trait defining the interface for the storage service
#[async_trait]
pub trait StorageServiceTrait {
    /// Check if a nonce is valid
    async fn check_and_update_nonce(&self, nonce: U256) -> Result<()>;

    /// Record a published intent
    async fn record_published_intent(
        &self,
        signed_intent: &SignedIntent,
        tx_hash: B256,
    ) -> Result<()>;

    /// Record a failure when publishing an intent
    async fn record_publishing_failure(
        &self,
        signed_intent: &SignedIntent,
        tx_hash: B256,
    ) -> Result<()>;

    /// Record a failure for an existing intent
    async fn record_existing_intent_failure(
        &self,
        intent_id: &IntentId,
        error_type: IntentErrorType,
        tx_hash: B256,
    ) -> Result<()>;

    /// Authorize a new solver
    async fn authorize_new_solver(&self, solver: Address) -> Result<()>;

    /// Deauthorize a solver
    async fn deauthorize_solver(&self, solver: Address) -> Result<()>;

    /// Add solver to the set of connected solvers.
    ///
    /// Will return an error if the solver is not authorized.
    ///
    /// Will return an error if the solver is already in the connected solvers set.
    async fn connect_solver(&self, solver: Address) -> Result<()>;

    /// Disconnect a solver
    async fn disconnect_solver(&self, solver: Address) -> Result<()>;

    /// Get intent IDs by author
    async fn get_intent_ids_by_author(&self, author: Address) -> Result<Vec<IntentId>>;

    /// Insert a solution
    async fn insert_solution(&self, solution: &SignedSolution, tx_hash: B256) -> Result<()>;

    /// Insert a refinement
    ///
    /// What's the point of this? We can update without inserting, and get
    /// refinement will be None regardless of whether it's inserted or not.
    async fn insert_refinement(&self, intent_id: IntentId) -> Result<()>;

    /// Insert or update a refinement
    async fn update_refinement(
        &self,
        intent_id: IntentId,
        refinement: RefinementStatus,
    ) -> Result<()>;

    /// Get a refinement
    async fn get_refinement(&self, intent_id: IntentId) -> Result<Option<RefinementStatus>>;

    /// Cancel an intent
    async fn cancel_intent(&self, intent_id: &IntentId, tx_hash: B256) -> Result<()>;

    /// Get the status of an intent
    async fn get_intent_status(&self, intent_id: &IntentId) -> Result<Option<IntentState>>;

    /// Get the history for an intent
    async fn get_history_for_intent(&self, intent_id: &IntentId) -> Result<IntentHistory>;

    /// Get all open intents
    async fn get_open_intents(&self) -> Result<Vec<Intent>>;

    /// Get an intent by ID
    async fn get_intent(&self, intent_id: &IntentId) -> Result<Option<Intent>>;

    /// Get the signature for an intent
    async fn get_intent_signature(&self, intent_id: &IntentId) -> Result<Option<Signature>>;

    /// Get solutions with a limit
    async fn get_solutions(&self, limit: usize) -> Result<Vec<SignedSolution>>;

    /// Get authorized solvers with a limit
    async fn get_authorized_solvers(&self, limit: usize) -> Result<Vec<Address>>;

    /// Get connected solvers with a limit
    async fn get_connected_solvers(&self, limit: usize) -> Result<Vec<Address>>;

    /// Get a solution by intent ID
    async fn get_solution_by_intent_id(
        &self,
        intent_id: &IntentId,
    ) -> Result<Option<SignedSolution>>;

    /// Get solutions by solver
    async fn get_solutions_by_solver(&self, solver: &Address) -> Result<Vec<SignedSolution>>;

    /// Update history after redeem
    async fn update_history_after_redeem(&self, intent_id: &IntentId, tx_hash: B256) -> Result<()>;

    /// Update history after hub withdrawal
    async fn update_history_after_hub_withdrawal(
        &self,
        intent_id: &IntentId,
        tx_hash: B256,
    ) -> Result<()>;

    /// Update history after withdrawal reaches spoke
    async fn update_history_after_withdrawal_reach_spoke(&self, intent_id: &IntentId)
    -> Result<()>;

    /// Get failed intent IDs
    async fn get_failed_intent_ids(&self) -> Result<Vec<IntentId>>;

    /// Get failed intents after a timestamp
    async fn get_failed_intents_after_timestamp(
        &self,
        timestamp: u64,
    ) -> Result<Vec<(IntentHistory, Intent)>>;
}
