mod db;

use crate::storage::db::DB;
use alloy::primitives::{Address, B256, U256};
use alloy::signers::Signature;
use anyhow::{anyhow, Result};
use apm::{expired_intent_gauge, open_intent_gauge};
use medusa_types::{Intent, IntentId, IntentState, RefinementStatus, SignedIntent, SignedSolution};
use medusa_types::{IntentErrorType, IntentEvent, IntentHistory};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::broadcast::Sender;
use tracing::{debug, error, info, warn};

use std::path::Path;
use std::sync::Arc;

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

pub struct InnerStore {
    pub(crate) db: DB,
}

impl InnerStore {
    pub fn new<P: AsRef<Path>>(path: P, reset: bool) -> Self {
        Self {
            db: DB::new(path, reset).expect("Error creating DB"),
        }
    }
}

pub struct StorageService {
    inner: Arc<InnerStore>,
}

impl StorageService {
    pub fn new<P: AsRef<Path>>(path: P, reset: bool, expiration_tx: Sender<Vec<IntentId>>) -> Self {
        let inner = Arc::new(InnerStore::new(path, reset));
        let inner_clone = Arc::clone(&inner);

        tokio::spawn(async move {
            // let mut interval = tokio::time::interval(Duration::from_secs(2));
            loop {
                // interval.tick().await;
                tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
                debug!("Checking for expired intents...");
                let mut newly_expired_intents = Vec::new();
                match inner_clone.db.get_active_intent_col_iter_from_start() {
                    Ok(iter) => {
                        for item in iter {
                            let intent: Intent = bcs::from_bytes(&item.unwrap().1).unwrap();
                            if U256::from(current_timestamp()) > intent.ttl {
                                let id = intent.intent_id();
                                info!("intent expired, id: {:#?}", id);
                                newly_expired_intents.push(id);
                            }
                        }
                    }
                    Err(e) => {
                        error!("Error getting active intent iterator: {:?}", e);
                    }
                }
                for id in newly_expired_intents.iter() {
                    debug!("marking expired intent as inactive. intent id: {:#?}", id);
                    if let Ok(Some(intent)) = inner_clone.db.get_active_intent_by_id(id) {
                        if let Err(e) = inner_clone
                            .db
                            .remove_intent_from_active_intent_col(id)
                            .and_then(|_| inner_clone.db.add_intent_to_inactive_intent_col(&intent))
                            .and_then(|_| {
                                inner_clone
                                    .db
                                    .add_or_modify_intent_status(id, &IntentState::Expired)
                            })
                        {
                            error!("Error updating expired intent {}: {:?}", id, e);
                        } else {
                            info!(
                                "Successfully marked expired intent as inactive. intent id: {:#?}",
                                id
                            );
                        }
                    }
                }
                if !newly_expired_intents.is_empty() {
                    expired_intent_gauge().add(newly_expired_intents.len() as i64);
                    open_intent_gauge().sub(newly_expired_intents.len() as i64);
                    let _ = expiration_tx.send(newly_expired_intents);
                    info!("Sent expired intents to expiration_tx.");
                }
            }
        });
        Self { inner }
    }

    pub fn inner(&self) -> Arc<InnerStore> {
        Arc::clone(&self.inner)
    }

    fn move_active_intent_to_inactive(&self, intent_id: &IntentId) -> Result<()> {
        let intent = self.inner.db.get_active_intent_by_id(intent_id)?;
        if intent.is_none() {
            warn!("Intent {:?} is not active.", intent_id);
            return Err(anyhow!("Intent {:?} is not active.", intent_id));
        }
        let intent = intent.unwrap();
        self.inner
            .db
            .remove_intent_from_active_intent_col(intent_id)?;
        self.inner.db.add_intent_to_inactive_intent_col(&intent)
    }

    fn ensure_insent_is_inactive(&self, intent_id: &IntentId) -> Result<()> {
        let intent = self.inner.db.get_inactive_intent_by_id(intent_id)?;
        if intent.is_none() {
            let intent = self.inner.db.get_active_intent_by_id(intent_id)?;
            if intent.is_none() {
                return Err(anyhow!("Intent {:?} is not found.", intent_id));
            }
            let intent = intent.unwrap();
            self.inner
                .db
                .remove_intent_from_active_intent_col(intent_id)?;
            self.inner.db.add_intent_to_inactive_intent_col(&intent)?;
        }
        Ok(())
    }

    fn update_intent_history(&self, intent_id: &IntentId, event: IntentEvent) -> Result<()> {
        let mut history = self.inner.db.get_intent_history_by_id(intent_id)?;
        history.update_field(event)?;
        self.inner
            .db
            .add_or_modify_intent_history(intent_id, history)?;
        Ok(())
    }

    pub async fn record_published_intent(
        &self,
        signed_intent: &SignedIntent,
        tx_hash: B256,
    ) -> Result<()> {
        let intent = &signed_intent.intent;
        let intent_id = signed_intent.intent_id();
        let author = intent.author;
        self.inner.db.add_intent_to_active_intent_col(intent)?;
        self.inner
            .db
            .add_or_modify_intent_status(&intent_id, &IntentState::Open)?;
        self.inner
            .db
            .add_intent_id_to_author_col(&author, &intent_id)?;
        self.inner
            .db
            .add_intent_signature_to_signature_col(&intent_id, &signed_intent.signature)?;
        self.update_intent_history(&intent_id, IntentEvent::Publish(tx_hash))
    }

    pub async fn record_publishing_failure(
        &self,
        signed_intent: &SignedIntent,
        tx_hash: B256,
    ) -> Result<()> {
        let intent_id = signed_intent.intent_id();
        let author = signed_intent.intent.author;
        self.inner
            .db
            .add_intent_id_to_author_col(&author, &intent_id)?;
        self.inner
            .db
            .add_intent_to_inactive_intent_col(&signed_intent.intent)?;
        self.inner
            .db
            .add_or_modify_intent_status(&intent_id, &IntentState::Error)?;
        self.inner.db.add_intent_to_failed_intents_list(intent_id)?;
        self.update_intent_history(
            &intent_id,
            IntentEvent::Error(IntentErrorType::Publish, tx_hash),
        )
    }

    pub async fn record_existing_intent_failure(
        &self,
        intent_id: &IntentId,
        error_type: IntentErrorType,
        tx_hash: B256,
    ) -> Result<()> {
        self.ensure_insent_is_inactive(intent_id)?;
        self.inner
            .db
            .add_or_modify_intent_status(intent_id, &IntentState::Error)?;
        self.inner
            .db
            .add_intent_to_failed_intents_list(*intent_id)?;
        self.update_intent_history(intent_id, IntentEvent::Error(error_type, tx_hash))
    }

    pub async fn authorize_new_solver(&self, solver: Address) -> Result<()> {
        self.inner.db.add_solver_to_authorized_solvers_list(solver)
    }

    #[allow(dead_code)]
    pub async fn deauthorize_solver(&self, solver: Address) -> Result<()> {
        self.inner
            .db
            .remove_solver_from_authorized_solvers_list(solver)
    }

    pub async fn connect_solver(&self, solver: Address) -> Result<()> {
        let authorized_solvers = self.inner.db.get_authorized_solvers()?;
        if !authorized_solvers.contains(&solver) {
            return Err(anyhow!("Solver {:?} is not authorized.", solver));
        }
        let connected_solvers = self.inner.db.get_connected_solvers()?;
        if connected_solvers.contains(&solver) {
            return Err(anyhow!("Solver {:?} is already connected.", solver));
        }
        self.inner.db.add_solver_to_connected_solvers_list(solver)
    }

    pub async fn disconnect_solver(&self, solver: Address) -> Result<()> {
        self.inner
            .db
            .remove_solver_from_connected_solvers_list(solver)
    }

    pub async fn get_intent_ids_by_author(&self, author: Address) -> Result<Vec<IntentId>> {
        self.inner
            .db
            .get_intent_ids_by_author(&author)
            .map(|set| set.into_iter().collect())
    }

    pub async fn insert_solution(&self, solution: &SignedSolution, tx_hash: B256) -> Result<()> {
        let solution_hash = solution.hash();
        let solver = solution.recover_address();
        self.inner.db.add_solution_to_solution_col(solution)?;

        for (index, intent_id) in solution.solution.intent_ids.iter().enumerate() {
            self.inner
                .db
                .add_solution_to_intent_solution_col(intent_id, solution_hash)?;
            self.move_active_intent_to_inactive(intent_id)?;
            self.inner
                .db
                .add_or_modify_intent_status(intent_id, &IntentState::Solved)?;
            let mut history_recorded = false;
            for fill_record in solution.solution.fill_graph.iter() {
                if fill_record.in_idx as usize == index
                    && fill_record.out_type == medusa_types::OutType::Intent
                {
                    let out_intent_id = solution
                        .solution
                        .intent_outputs
                        .get(fill_record.out_idx as usize)
                        .unwrap()
                        .intent_id();
                    self.update_intent_history(
                        intent_id,
                        IntentEvent::Solve(tx_hash, Some(out_intent_id)),
                    )?;
                    history_recorded = true;
                }
            }
            if !history_recorded {
                self.update_intent_history(intent_id, IntentEvent::Solve(tx_hash, None))?;
            }
        }

        for new_intent in solution.solution.intent_outputs.iter() {
            let intent_id = new_intent.intent_id();
            let author = new_intent.author;
            self.inner.db.add_intent_to_active_intent_col(new_intent)?;
            self.inner
                .db
                .add_or_modify_intent_status(&intent_id, &IntentState::Open)?;
            self.inner
                .db
                .add_intent_id_to_author_col(&author, &intent_id)?;
            self.update_intent_history(&intent_id, IntentEvent::Publish(tx_hash))?;
        }

        self.inner
            .db
            .add_solution_hash_to_solver_col(solver, solution_hash)
    }

    pub async fn insert_refinement(&self, intent_id: IntentId) -> Result<()> {
        let refinement_init: Option<RefinementStatus> = None;
        self.inner
            .db
            .add_or_modify_refinement(&intent_id, refinement_init)
    }

    pub async fn update_refinement(
        &self,
        intent_id: IntentId,
        refinement: RefinementStatus,
    ) -> Result<()> {
        let refinement_db_update: Option<RefinementStatus> = Some(refinement);
        self.inner
            .db
            .add_or_modify_refinement(&intent_id, refinement_db_update)
    }

    pub async fn get_refinement(&self, intent_id: IntentId) -> Result<Option<RefinementStatus>> {
        self.inner.db.get_refinement_mapping_by_id(intent_id)
    }

    pub async fn cancel_intent(&self, intent_id: &IntentId, tx_hash: B256) -> Result<()> {
        self.move_active_intent_to_inactive(intent_id)?;
        self.inner
            .db
            .add_or_modify_intent_status(intent_id, &IntentState::Cancelled)?;
        self.update_intent_history(intent_id, IntentEvent::Cancel(tx_hash))
    }

    pub async fn get_intent_status(&self, intent_id: &IntentId) -> Result<Option<IntentState>> {
        self.inner.db.get_intent_status_by_id(intent_id)
    }

    pub async fn get_history_for_intent(&self, intent_id: &IntentId) -> Result<IntentHistory> {
        self.inner.db.get_intent_history_by_id(intent_id)
    }

    pub async fn get_open_intents(&self) -> Result<Vec<Intent>> {
        let iter = self.inner.db.get_active_intent_col_iter_from_start()?;
        Ok(iter
            .map(|x| bcs::from_bytes::<Intent>(&x.unwrap().1).unwrap())
            .collect())
    }

    pub async fn get_intent(&self, intent_id: &IntentId) -> Result<Option<Intent>> {
        if let Some(active_intent) = self.inner.db.get_active_intent_by_id(intent_id)? {
            return Ok(Some(active_intent));
        } else if let Some(inactive_intent) = self.inner.db.get_inactive_intent_by_id(intent_id)? {
            return Ok(Some(inactive_intent));
        }
        Ok(None)
    }

    #[allow(dead_code)]
    pub async fn get_intent_signature(&self, intent_id: &IntentId) -> Result<Option<Signature>> {
        self.inner.db.get_intent_signature_by_id(intent_id)
    }

    #[allow(dead_code)]
    pub async fn get_solutions(&self, limit: usize) -> Result<Vec<SignedSolution>> {
        let iter = self.inner.db.get_solution_col_iter_from_end()?;
        Ok(iter
            .map(|x| bcs::from_bytes::<SignedSolution>(&x.unwrap().1).unwrap())
            .take(limit)
            .collect())
    }

    pub async fn get_authorized_solvers(&self, limit: usize) -> Result<Vec<Address>> {
        Ok(self
            .inner
            .db
            .get_authorized_solvers()?
            .into_iter()
            .take(limit)
            .collect())
    }

    pub async fn get_connected_solvers(&self, limit: usize) -> Result<Vec<Address>> {
        Ok(self
            .inner
            .db
            .get_connected_solvers()?
            .into_iter()
            .take(limit)
            .collect())
    }
    // pub async fn check_solver_authorization(&self, solver: &Address) -> Result<bool> {
    //     Ok(self.inner.db.get_authorized_solvers()?.contains(solver))
    // }

    pub async fn get_solution_by_intent_id(
        &self,
        intent_id: &IntentId,
    ) -> Result<Option<SignedSolution>> {
        Ok(self.inner.db.get_solution_by_hash(
            &self
                .inner
                .db
                .get_solution_hash_by_intent_id(intent_id)?
                .ok_or_else(|| {
                    warn!("No solution hash found for intent: {:?}", intent_id);
                    anyhow::anyhow!("No solution hash found")
                })?,
        )?)
    }

    pub async fn get_solutions_by_solver(&self, solver: &Address) -> Result<Vec<SignedSolution>> {
        let hashes = self
            .inner
            .db
            .get_solution_hashes_by_solver_address(solver)?;
        let solutions = hashes
            .iter()
            .map(|hash| self.inner.db.get_solution_by_hash(hash))
            .flatten()
            .flatten()
            .collect();
        Ok(solutions)
    }

    pub async fn update_history_after_redeem(
        &self,
        intent_id: &IntentId,
        tx_hash: B256,
    ) -> Result<()> {
        self.update_intent_history(intent_id, IntentEvent::Redeem(tx_hash))
    }

    pub async fn update_history_after_hub_withdrawal(
        &self,
        intent_id: &IntentId,
        tx_hash: B256,
    ) -> Result<()> {
        self.update_intent_history(intent_id, IntentEvent::Withdraw(tx_hash))
    }

    pub async fn update_history_after_withdrawal_reach_spoke(
        &self,
        intent_id: &IntentId,
    ) -> Result<()> {
        self.update_intent_history(intent_id, IntentEvent::WithdrawReachSpoke())
    }

    pub async fn get_failed_intent_ids(&self) -> Result<Vec<IntentId>> {
        self.inner.db.get_failed_intent_ids()
    }

    pub async fn get_failed_intents_after_timestamp(
        &self,
        timestamp: u64,
    ) -> Result<Vec<(IntentHistory, Intent)>> {
        let failed_intent_ids = self.get_failed_intent_ids().await?;
        let mut result = Vec::new();
        for intent_id in failed_intent_ids.iter().rev() {
            let history = self.inner.db.get_intent_history_by_id(intent_id)?;
            if history.error_timestamp.is_none() {
                warn!(
                    "Intent {:?} is stored as failed but has no error timestamp",
                    intent_id
                );
                continue;
            }
            if history.error_timestamp.unwrap() > timestamp {
                let intent = self.get_intent(intent_id).await?;
                if intent.is_none() {
                    warn!(
                        "Intent {:?} is stored as failed but not found in the database",
                        intent_id
                    );
                    continue;
                }
                result.push((history, intent.unwrap()));
            }
            // else {
            //     break;
            // }
        }
        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use alloy::{primitives::Parity, signers::local::PrivateKeySigner};
    use medusa_types::{
        receipt::Receipt, FillRecord, Intent, IntentState, MoveRecord, OutType, OutputIdx,
        RefinementStatus, SignedIntent, SignedSolution, Solution,
    };
    use std::time::Duration;
    use tempfile::tempdir;
    use tokio::sync::broadcast;
    use tracing_subscriber::{fmt, EnvFilter};

    fn init_tracing() {
        // Only initialize once
        static INIT: std::sync::Once = std::sync::Once::new();
        INIT.call_once(|| {
            let _ = fmt()
                .with_env_filter(
                    EnvFilter::from_default_env().add_directive("debug=info".parse().unwrap()),
                )
                .with_test_writer() // Use test writer to avoid conflicts in parallel tests
                .try_init();
        });
    }

    fn create_dummy_intent(ttl: u64) -> Intent {
        Intent::simple_swap(
            Address::from_slice(&[0u8; 20]),
            U256::from(ttl),
            None,
            Address::from_slice(&[1u8; 20]),
            U256::from(100),
            Address::from_slice(&[2u8; 20]),
            U256::from(100),
        )
    }

    fn create_dummy_signature() -> Signature {
        Signature::from_bytes_and_parity(&[0u8; 65], Parity::Parity(true)).unwrap()
    }

    fn create_dummy_signed_intent(ttl: u64) -> SignedIntent {
        SignedIntent {
            intent: create_dummy_intent(ttl),
            signature: create_dummy_signature(),
        }
    }

    async fn create_mock_solution_for_intent(
        intent_id: IntentId,
        owner: Address,
    ) -> SignedSolution {
        let signer = PrivateKeySigner::random();
        let solution = Solution {
            intent_ids: vec![intent_id],
            receipt_outputs: vec![Receipt {
                m_token: Address::random(),
                m_token_amount: U256::from(100),
                owner: owner,
                intent_hash: intent_id,
            }],
            intent_outputs: vec![create_dummy_intent(1000)],
            spend_graph: vec![
                MoveRecord {
                    src_idx: 0,
                    output_idx: OutputIdx {
                        out_type: OutType::Intent,
                        out_idx: 0,
                    },
                    qty: U256::from(100),
                },
                MoveRecord {
                    src_idx: 0,
                    output_idx: OutputIdx {
                        out_type: OutType::Receipt,
                        out_idx: 0,
                    },
                    qty: U256::from(100),
                },
            ],
            fill_graph: vec![
                FillRecord {
                    in_idx: 0,
                    out_idx: 0,
                    out_type: OutType::Intent,
                },
                FillRecord {
                    in_idx: 0,
                    out_idx: 0,
                    out_type: OutType::Receipt,
                },
            ],
        };
        solution.sign(&signer).await
    }

    #[tokio::test]
    async fn test_record_published_intent() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let time = current_timestamp();
        let expected_intent = create_dummy_intent(time + 1000);
        let signed_intent = create_dummy_signed_intent(time + 1000);
        let tx_hash = B256::random();

        let result = store.record_published_intent(&signed_intent, tx_hash).await;
        assert!(result.is_ok());

        let stored_intent = store
            .get_intent(&expected_intent.intent_id())
            .await
            .unwrap();
        assert!(stored_intent.is_some());
        assert_eq!(stored_intent.unwrap(), expected_intent);
        assert_eq!(
            store
                .get_intent_status(&expected_intent.intent_id())
                .await
                .unwrap()
                .unwrap(),
            IntentState::Open
        );
        let stored_history = store
            .get_history_for_intent(&expected_intent.intent_id())
            .await
            .unwrap();
        assert_eq!(stored_history.publish_tx_hash, Some(tx_hash));
        assert!(stored_history.publish_timestamp.unwrap() >= time);
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.error_tx_hash.is_none());
        assert!(stored_history.error_timestamp.is_none());
        assert!(stored_history.error_type.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
    }

    #[tokio::test]
    async fn test_record_publishing_failure() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let time = current_timestamp();
        let signed_intent = create_dummy_signed_intent(time + 1000);
        let intent_id = signed_intent.intent.intent_id();
        let tx_hash = B256::random();

        let result = store
            .record_publishing_failure(&signed_intent, tx_hash)
            .await;
        assert!(result.is_ok());

        let status = store.get_intent_status(&intent_id).await.unwrap();
        assert_eq!(status, Some(IntentState::Error));

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.error_tx_hash, Some(tx_hash));
        assert!(stored_history.error_timestamp.is_some());
        assert_eq!(stored_history.error_type, Some(IntentErrorType::Publish));
        assert!(stored_history.publish_tx_hash.is_none());
        assert!(stored_history.publish_timestamp.is_none());
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());

        let failed_intent_ids = store.get_failed_intent_ids().await.unwrap();
        assert_eq!(failed_intent_ids.len(), 1);
        assert_eq!(failed_intent_ids[0], intent_id);
    }

    #[tokio::test]
    async fn test_record_existing_intent_failure_active() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let time = current_timestamp();
        let signed_intent = create_dummy_signed_intent(time + 1000);
        let intent_id = signed_intent.intent.intent_id();
        let publish_tx_hash = B256::random();

        store
            .record_published_intent(&signed_intent, publish_tx_hash)
            .await
            .unwrap();

        let result = store
            .record_existing_intent_failure(&intent_id, IntentErrorType::Cancel, publish_tx_hash)
            .await;
        assert!(result.is_ok());

        let status = store.get_intent_status(&intent_id).await.unwrap();
        assert_eq!(status, Some(IntentState::Error));

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.error_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.error_timestamp.is_some());
        assert_eq!(stored_history.error_type, Some(IntentErrorType::Cancel));
        assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.publish_timestamp.is_some());
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());

        let failed_intent_ids = store.get_failed_intent_ids().await.unwrap();
        assert_eq!(failed_intent_ids.len(), 1);
        assert_eq!(failed_intent_ids[0], intent_id);
    }

    #[tokio::test]
    async fn test_record_existing_intent_failure_inactive() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let time = current_timestamp();
        let signed_intent = create_dummy_signed_intent(time + 1000);
        let intent_id = signed_intent.intent.intent_id();
        let author = signed_intent.intent.author;
        let publish_tx_hash = B256::random();

        store
            .record_published_intent(&signed_intent, publish_tx_hash)
            .await
            .unwrap();

        let solution = create_mock_solution_for_intent(intent_id, author).await;
        let solve_tx_hash = B256::random();

        store
            .insert_solution(&solution, solve_tx_hash)
            .await
            .unwrap();

        let result = store
            .record_existing_intent_failure(&intent_id, IntentErrorType::Redeem, publish_tx_hash)
            .await;
        assert!(result.is_ok());

        let status = store.get_intent_status(&intent_id).await.unwrap();
        assert_eq!(status, Some(IntentState::Error));

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.error_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.error_timestamp.is_some());
        assert_eq!(stored_history.error_type, Some(IntentErrorType::Redeem));
        assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.publish_timestamp.is_some());
        assert_eq!(stored_history.solve_tx_hash, Some(solve_tx_hash));
        assert!(stored_history.solve_timestamp.is_some());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.remaining_intent_id.is_some());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
    }

    #[tokio::test]
    async fn test_authorize_solver() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let solver = Address::random();
        let result = store.authorize_new_solver(solver).await;
        assert!(result.is_ok());

        let solvers = store.get_authorized_solvers(1).await.unwrap();
        assert_eq!(solvers.len(), 1);
        assert_eq!(solvers[0], solver);

        let result = store.deauthorize_solver(solver).await;
        assert!(result.is_ok());

        let solvers = store.get_authorized_solvers(10).await.unwrap();
        assert_eq!(solvers.len(), 0);
    }

    #[tokio::test]
    async fn test_connect_solver() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let solver = Address::random();
        let result = store.connect_solver(solver).await;
        assert!(result.is_err());

        let result = store.authorize_new_solver(solver).await;
        assert!(result.is_ok());

        let result = store.connect_solver(solver).await;
        assert!(result.is_ok());

        let solvers = store.get_connected_solvers(10).await.unwrap();
        assert_eq!(solvers.len(), 1);
        assert_eq!(solvers[0], solver);
    }

    #[tokio::test]
    async fn test_insert_solution() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = intent.intent.intent_id();
        let author = intent.intent.author;
        let publish_tx_hash = B256::random();
        store
            .record_published_intent(&intent, publish_tx_hash)
            .await
            .unwrap();

        // Create a mock solution
        let solution = create_mock_solution_for_intent(intent_id, author).await;
        let remaining_intent_id = solution.solution.intent_outputs[0].intent_id();
        let solve_tx_hash = B256::random();

        let result = store.insert_solution(&solution, solve_tx_hash).await;
        assert!(result.is_ok());

        let stored_solution = store
            .get_solution_by_intent_id(&solution.solution.intent_ids[0])
            .await
            .unwrap();
        assert!(stored_solution.is_some());

        let status = store.get_intent_status(&intent_id).await.unwrap();
        assert_eq!(status, Some(IntentState::Solved));

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.solve_tx_hash, Some(solve_tx_hash));
        assert!(stored_history.solve_timestamp.is_some());
        assert!(stored_history.publish_tx_hash.is_some());
        assert!(stored_history.publish_timestamp.is_some());
        assert!(stored_history.error_tx_hash.is_none());
        assert!(stored_history.error_timestamp.is_none());
        assert!(stored_history.error_type.is_none());
        assert_eq!(
            stored_history.remaining_intent_id,
            Some(remaining_intent_id)
        );
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
    }

    #[tokio::test]
    async fn test_insert_refinement() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let intent_id = B256::random();
        let result = store.insert_refinement(intent_id).await;
        assert!(result.is_ok());

        let refinement = store.get_refinement(intent_id).await.unwrap();
        assert!(refinement.is_none());
    }

    #[tokio::test]
    async fn test_update_refinement() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let intent_id = B256::random();
        let refinement = RefinementStatus::RefinementNotFound;

        let result = store.update_refinement(intent_id, refinement.clone()).await;
        assert!(result.is_ok());

        let stored_refinement = store.get_refinement(intent_id).await.unwrap();
        assert!(stored_refinement.is_some());
        assert_eq!(stored_refinement.unwrap(), refinement);
    }

    #[tokio::test]
    async fn test_cancel_intent() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = intent.intent.intent_id();
        let publish_tx_hash = B256::random();
        store
            .record_published_intent(&intent, publish_tx_hash)
            .await
            .unwrap();

        let cancel_tx_hash = B256::random();
        let result = store.cancel_intent(&intent_id, cancel_tx_hash).await;
        assert!(result.is_ok());

        let status = store.get_intent_status(&intent.intent_id()).await.unwrap();
        assert_eq!(status, Some(IntentState::Cancelled));

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.cancel_tx_hash, Some(cancel_tx_hash));
        assert!(stored_history.cancel_timestamp.is_some());
        assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.error_tx_hash.is_none());
        assert!(stored_history.error_timestamp.is_none());
        assert!(stored_history.error_type.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
    }

    #[tokio::test]
    async fn test_update_history_after_redeem() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = intent.intent.intent_id();
        let publish_tx_hash = B256::random();
        store
            .record_published_intent(&intent, publish_tx_hash)
            .await
            .unwrap();
        let redeem_tx_hash = B256::random();
        let result = store
            .update_history_after_redeem(&intent_id, redeem_tx_hash)
            .await;
        assert!(result.is_ok());

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.redeem_tx_hash, Some(redeem_tx_hash));
        assert!(stored_history.redeem_timestamp.is_some());
        assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.error_tx_hash.is_none());
        assert!(stored_history.error_timestamp.is_none());
        assert!(stored_history.error_type.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.withdraw_tx_hash.is_none());
        assert!(stored_history.withdraw_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
    }

    #[tokio::test]
    async fn test_update_history_after_withdrawal() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);

        let intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = intent.intent.intent_id();
        let publish_tx_hash = B256::random();
        store
            .record_published_intent(&intent, publish_tx_hash)
            .await
            .unwrap();
        let withdrawal_tx_hash = B256::random();
        let result = store
            .update_history_after_hub_withdrawal(&intent_id, withdrawal_tx_hash)
            .await;
        assert!(result.is_ok());

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.withdraw_tx_hash, Some(withdrawal_tx_hash));
        assert!(stored_history.withdraw_timestamp.is_some());
        assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.error_tx_hash.is_none());
        assert!(stored_history.error_timestamp.is_none());
        assert!(stored_history.error_type.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
    }

    #[tokio::test]
    async fn test_update_history_after_withdrawal_reach_spoke() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let store = StorageService::new(dir.path(), true, tx);
        let intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = intent.intent.intent_id();
        let publish_tx_hash = B256::random();
        store
            .record_published_intent(&intent, publish_tx_hash)
            .await
            .unwrap();
        let withdrawal_tx_hash = B256::random();
        store
            .update_history_after_hub_withdrawal(&intent_id, withdrawal_tx_hash)
            .await
            .unwrap();
        let result = store
            .update_history_after_withdrawal_reach_spoke(&intent_id)
            .await;
        assert!(result.is_ok());

        let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
        assert_eq!(stored_history.withdraw_tx_hash, Some(withdrawal_tx_hash));
        assert!(stored_history.withdraw_timestamp.is_some());
        assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
        assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
        assert!(stored_history.solve_tx_hash.is_none());
        assert!(stored_history.solve_timestamp.is_none());
        assert!(stored_history.cancel_tx_hash.is_none());
        assert!(stored_history.cancel_timestamp.is_none());
        assert!(stored_history.error_tx_hash.is_none());
        assert!(stored_history.error_timestamp.is_none());
        assert!(stored_history.error_type.is_none());
        assert!(stored_history.remaining_intent_id.is_none());
        assert!(stored_history.redeem_tx_hash.is_none());
        assert!(stored_history.redeem_timestamp.is_none());
        assert!(stored_history.withdraw_to_spoke_timestamp.is_some());
    }

    #[tokio::test]
    async fn test_intent_expiration_broadcast() {
        init_tracing();
        let (tx, _) = broadcast::channel(100);
        let dir = tempdir().unwrap();
        let mut rx = tx.subscribe();
        let store = StorageService::new(dir.path(), true, tx);

        let ids = Arc::new(tokio::sync::RwLock::new(rustc_hash::FxHashSet::default()));
        let ids_clone = ids.clone();
        let store = Arc::new(store);
        let store_clone = Arc::clone(&store);
        let handle = tokio::spawn(async move {
            while !ids_clone.read().await.is_empty() {
                match rx.recv().await {
                    Ok(expired_ids) => {
                        for intent_id in expired_ids {
                            assert!(ids_clone.read().await.contains(&intent_id));
                            assert_eq!(
                                store_clone.get_intent_status(&intent_id).await.unwrap(),
                                Some(IntentState::Expired)
                            );
                            ids_clone.write().await.remove(&intent_id);
                        }
                    }
                    Err(_) => {}
                }
            }
        });
        for _ in 0..5 {
            let intent = create_dummy_signed_intent(current_timestamp() + 1);
            store
                .record_published_intent(&intent, B256::random())
                .await
                .unwrap();
            ids.write().await.insert(intent.intent.intent_id());
        }
        tokio::select! {
            _ = handle => {},
            _ = tokio::time::sleep(Duration::from_secs(10)) => {
                panic!("Test timed out waiting for intents to expire");
            }
        }
    }
}
