pub mod entities;
mod metrics;

use std::sync::Arc;
use std::sync::atomic::{AtomicI64, Ordering};
use std::time::Duration;

use anyhow::{Context as _, Result, bail};
use async_trait::async_trait;
use dashmap::DashSet;
use medusa_apm::authorized_solver_gauge;
use medusa_types::{
    Address, B256, Intent, IntentErrorType, IntentHistory, IntentId, IntentState, OutType,
    RefinementStatus, Signature, SignedIntent, SignedSolution, U256,
};
use sea_orm::prelude::*;
use sea_orm::sea_query::{OnConflict, Query};
use sea_orm::{
    ActiveValue, Database, DatabaseConnection, DatabaseTransaction, FromQueryResult, Insert,
    QueryOrder, QuerySelect as _, QueryTrait, SelectColumns, TransactionTrait, Update, Updater,
};
use sea_orm_migration::MigratorTrait as _;
use tokio::sync::broadcast;
use tracing::error;

use crate::db::entities::{intent, intent_history, nonce, refinement, solution, solver};
use crate::migrations::Migrator;
use crate::{StorageError, StorageServiceTrait};

#[derive(Clone)]
pub struct StorageService {
    db: DatabaseConnection,
    connected_solvers: Arc<DashSet<Address>>,
    expiration_tx: broadcast::Sender<Arc<[IntentId]>>,
    chain_height: Arc<AtomicI64>,
}

#[async_trait]
impl StorageServiceTrait for StorageService {
    async fn check_and_update_nonce(&self, nonce: U256) -> Result<()> {
        match Insert::one(nonce::ActiveModel {
            number: ActiveValue::Set(nonce.to_be_bytes_vec()),
        })
        .exec_without_returning(&self.db)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                let is_unique_constraint_violation = e
                    .sql_err()
                    .is_some_and(|e| matches!(e, SqlErr::UniqueConstraintViolation(_)));
                if is_unique_constraint_violation {
                    bail!(StorageError::NonceUniqueCheckFailed(nonce));
                }
                Err(e.into())
            }
        }
    }

    async fn record_published_intent(
        &self,
        signed_intent: &SignedIntent,
        tx_hash: B256,
    ) -> Result<()> {
        let intent_id = signed_intent.intent.intent_id();
        let timestamp = current_timestamp();
        let txn = self.txn().await?;

        let intent_am = intent::ActiveModel::from_intent(
            &signed_intent.intent,
            Some(signed_intent.signature),
            Some(tx_hash),
            timestamp,
        );
        let id = Insert::one(intent_am).exec(&txn).await?.last_insert_id;

        Insert::one(intent_history::ActiveModel {
            id: ActiveValue::Set(id),
            intent_hash: ActiveValue::Set(intent_id.to_vec()),
            publish_timestamp: ActiveValue::Set(Some(timestamp)),
            publish_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
            ..Default::default()
        })
        .exec_without_returning(&txn)
        .await?;

        txn.commit().await?;

        Ok(())
    }

    async fn record_publishing_failure(
        &self,
        signed_intent: &SignedIntent,
        tx_hash: B256,
    ) -> Result<()> {
        let intent_id = signed_intent.intent.intent_id();
        let timestamp = current_timestamp();
        let txn = self.txn().await?;

        let id = Insert::one(intent::ActiveModel {
            is_active: ActiveValue::Set(false),
            status: ActiveValue::Set(IntentState::Error as i16),
            is_tx_success: ActiveValue::Set(false),
            ..intent::ActiveModel::from_intent(
                &signed_intent.intent,
                Some(signed_intent.signature),
                Some(tx_hash),
                timestamp,
            )
        })
        .exec(&txn)
        .await?
        .last_insert_id;

        Insert::one(intent_history::ActiveModel {
            id: ActiveValue::Set(id),
            intent_hash: ActiveValue::Set(intent_id.to_vec()),
            error_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
            error_timestamp: ActiveValue::Set(Some(timestamp)),
            error_type: ActiveValue::Set(Some(IntentErrorType::Publish as i16)),
            ..Default::default()
        })
        .exec_without_returning(&txn)
        .await?;

        txn.commit().await?;

        Ok(())
    }

    async fn record_existing_intent_failure(
        &self,
        intent_id: &IntentId,
        error_type: IntentErrorType,
        tx_hash: B256,
    ) -> Result<()> {
        let txn = self.txn().await?;

        update_intent_by_hash(
            intent_id,
            intent::ActiveModel {
                status: ActiveValue::Set(IntentState::Error as i16),
                is_tx_success: ActiveValue::Set(false),
                ..Default::default()
            },
            &txn,
        )
        .await?;
        update_intent_history_by_hash(
            intent_id,
            intent_history::ActiveModel {
                error_timestamp: ActiveValue::Set(Some(current_timestamp())),
                error_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
                error_type: ActiveValue::Set(Some(error_type as i16)),
                ..Default::default()
            },
            &txn,
        )
        .await?;

        txn.commit().await?;

        Ok(())
    }

    async fn authorize_new_solver(&self, solver_address: Address) -> Result<()> {
        Insert::one(solver::Model {
            address: solver_address.to_vec(),
            is_authorized: true,
        })
        .exec_without_returning(&self.db)
        .await?;
        authorized_solver_gauge().add(1);
        Ok(())
    }

    async fn deauthorize_solver(&self, solver_address: Address) -> Result<()> {
        do_update(
            solver::ActiveModel {
                address: ActiveValue::Set(solver_address.to_vec()),
                is_authorized: ActiveValue::Set(false),
            },
            &self.db,
            StorageError::CanNotFindSolver(solver_address),
        )
        .await?;
        authorized_solver_gauge().dec();
        Ok(())
    }

    async fn connect_solver(&self, solver_address: Address) -> Result<()> {
        let solver = solver::Entity::find_by_id(solver_address.as_slice())
            .one(&self.db)
            .await?;
        if !solver.is_some_and(|s| s.is_authorized) {
            bail!("solver {} is not authorized", solver_address);
        }

        println!("inserting {}", solver_address);
        let inserted = self.connected_solvers.insert(solver_address);
        if !inserted {
            bail!("Solver {:?} is already connected.", solver_address);
        }
        Ok(())
    }

    async fn disconnect_solver(&self, solver_address: Address) -> Result<()> {
        println!("removing {}", solver_address);
        self.connected_solvers.remove(&solver_address);
        Ok(())
    }

    async fn get_intent_ids_by_author(&self, author: Address) -> Result<Vec<IntentId>> {
        let intents = intent::Entity::find()
            .filter(intent::Column::Author.eq(author.as_slice()))
            .all(&self.db)
            .await?;
        Ok(intents
            .into_iter()
            .map(|i| IntentId::from_slice(&i.intent_id))
            .collect::<Vec<_>>())
    }

    async fn insert_solution(&self, solution: &SignedSolution, tx_hash: B256) -> Result<()> {
        let solution_hash = solution.hash();
        let solver = solution.recover_address();
        let timestamp = current_timestamp();

        let txn = self.txn().await?;

        Insert::one(solution::ActiveModel {
            id: ActiveValue::NotSet,
            solution_hash: ActiveValue::Set(solution_hash.to_vec()),
            solution_bytes: ActiveValue::Set(bcs::to_bytes(&solution).unwrap()),
            solver: ActiveValue::Set(solver.to_vec()),
            tx_hash: ActiveValue::Set(tx_hash.to_vec()),
            is_tx_success: ActiveValue::Set(true),
            timestamp: ActiveValue::Set(timestamp),
        })
        .exec_without_returning(&txn)
        .await?;

        for (index, intent_id) in solution.solution.intent_ids.iter().enumerate() {
            update_intent_by_hash(
                intent_id,
                intent::ActiveModel {
                    status: ActiveValue::Set(IntentState::Solved as i16),
                    is_active: ActiveValue::Set(false),
                    solution_hash: ActiveValue::Set(Some(solution_hash.to_vec())),
                    ..Default::default()
                },
                &txn,
            )
            .await?;
            let mut output_intent_id = None;
            for fill_record in solution.solution.fill_graph.iter() {
                if fill_record.in_idx as usize == index && fill_record.out_type == OutType::Intent {
                    output_intent_id = Some(
                        solution
                            .solution
                            .intent_outputs
                            .get(fill_record.out_idx as usize)
                            .context("intent output not found")?
                            .intent_id(),
                    );
                    break;
                }
            }
            update_intent_history_by_hash(
                intent_id,
                intent_history::ActiveModel {
                    solve_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
                    solve_timestamp: ActiveValue::Set(Some(timestamp)),
                    remaining_intent_id: ActiveValue::Set(output_intent_id.map(|id| id.to_vec())),
                    ..Default::default()
                },
                &txn,
            )
            .await?;
        }
        for output in &solution.solution.intent_outputs {
            let intent_id = output.intent_id();
            let id = Insert::one(intent::ActiveModel::from_intent(
                output,
                None,
                Some(tx_hash),
                timestamp,
            ))
            .exec(&txn)
            .await?
            .last_insert_id;
            Insert::one(intent_history::ActiveModel {
                id: ActiveValue::Set(id),
                intent_hash: ActiveValue::Set(intent_id.to_vec()),
                publish_timestamp: ActiveValue::Set(Some(current_timestamp())),
                publish_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
                ..Default::default()
            })
            .exec_without_returning(&txn)
            .await?;
        }

        txn.commit().await?;

        Ok(())
    }

    async fn insert_refinement(&self, intent_id: IntentId) -> Result<()> {
        let refinement = refinement::ActiveModel {
            intent_id: ActiveValue::Set(intent_id.to_vec()),
            refinement: ActiveValue::Set(None),
        };
        Insert::one(refinement)
            .exec_without_returning(&self.db)
            .await?;
        Ok(())
    }

    async fn update_refinement(
        &self,
        intent_id: IntentId,
        refinement: RefinementStatus,
    ) -> Result<()> {
        Insert::one(refinement::ActiveModel {
            intent_id: ActiveValue::Set(intent_id.to_vec()),
            refinement: ActiveValue::Set(Some(bcs::to_bytes(&refinement).unwrap())),
        })
        .on_conflict(std::mem::take(
            OnConflict::column(refinement::Column::IntentId)
                .update_column(refinement::Column::Refinement),
        ))
        .exec_without_returning(&self.db)
        .await?;
        Ok(())
    }

    /// Get a refinement
    async fn get_refinement(&self, intent_id: IntentId) -> Result<Option<RefinementStatus>> {
        let opt_model = refinement::Entity::find_by_id(intent_id.as_slice())
            .one(&self.db)
            .await?;
        Ok(opt_model.and_then(|model| {
            model
                .refinement
                .map(|r| bcs::from_bytes::<RefinementStatus>(&r).unwrap())
        }))
    }

    /// Cancel an intent
    async fn cancel_intent(&self, intent_id: &IntentId, tx_hash: B256) -> Result<()> {
        let txn = self.txn().await?;
        update_intent_by_hash(
            intent_id,
            intent::ActiveModel {
                status: ActiveValue::Set(IntentState::Cancelled as i16),
                is_active: ActiveValue::Set(false),
                ..Default::default()
            },
            &txn,
        )
        .await?;
        update_intent_history_by_hash(
            intent_id,
            intent_history::ActiveModel {
                cancel_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
                cancel_timestamp: ActiveValue::Set(Some(current_timestamp())),
                ..Default::default()
            },
            &txn,
        )
        .await?;
        txn.commit().await?;
        Ok(())
    }

    /// Get the status of an intent
    async fn get_intent_status(&self, intent_id: &IntentId) -> Result<Option<IntentState>> {
        let intent = intent::Entity::find()
            .filter(intent::Column::IntentId.eq(intent_id.as_slice()))
            .one(&self.db)
            .await?;
        Ok(intent.map(|i| IntentState::from(i.status as u8)))
    }

    /// Get the history for an intent
    async fn get_history_for_intent(&self, intent_id: &IntentId) -> Result<IntentHistory> {
        if let Some(intent_history) = intent_history::Entity::find()
            .filter(intent_history::Column::IntentHash.eq(intent_id.as_slice()))
            .one(&self.db)
            .await?
        {
            return Ok(intent_history.into());
        }
        Err(StorageError::CanNotFindIntentHistory(*intent_id).into())
    }

    /// Get all open intents
    async fn get_open_intents(&self) -> Result<Vec<Intent>> {
        let intents = intent::Entity::find()
            // Use the ttl_i64 where is_active index.
            .filter(intent::Column::IsActive.eq(true))
            .filter(intent::Column::TtlI64.gt(self.get_chain_height()))
            .all(&self.db)
            .await?;
        Ok(intents.into_iter().map(|i| i.into()).collect::<Vec<_>>())
    }

    /// Get an intent by ID
    async fn get_intent(&self, intent_id: &IntentId) -> Result<Option<Intent>> {
        let intent = intent::Entity::find()
            .filter(intent::Column::IntentId.eq(intent_id.as_slice()))
            .one(&self.db)
            .await?;
        Ok(intent.map(|i| i.into()))
    }

    /// Get the signature for an intent
    async fn get_intent_signature(&self, intent_id: &IntentId) -> Result<Option<Signature>> {
        let intent = intent::Entity::find()
            .filter(intent::Column::IntentId.eq(intent_id.as_slice()))
            .one(&self.db)
            .await?;
        Ok(intent.map(|i| Signature::from_raw(&i.signature.unwrap()).unwrap()))
    }

    /// Get solutions with a limit
    async fn get_solutions(&self, limit: usize) -> Result<Vec<SignedSolution>> {
        let raw_solutions = solution::Entity::find()
            .limit(limit as u64)
            .into_partial_model::<solution::OnlySolutionBytes>()
            .all(&self.db)
            .await?;
        Ok(raw_solutions
            .into_iter()
            .map(|s| bcs::from_bytes(&s.solution_bytes).unwrap())
            .collect::<Vec<_>>())
    }

    /// Get authorized solvers with a limit
    async fn get_authorized_solvers(&self, limit: usize) -> Result<Vec<Address>> {
        let solvers = solver::Entity::find()
            .filter(solver::Column::IsAuthorized.eq(true))
            .limit(limit as u64)
            .all(&self.db)
            .await?;
        Ok(solvers
            .into_iter()
            .map(|s| Address::from_slice(&s.address))
            .collect::<Vec<_>>())
    }

    /// Get connected solvers with a limit
    async fn get_connected_solvers(&self, limit: usize) -> Result<Vec<Address>> {
        Ok(self
            .connected_solvers
            .iter()
            .take(limit)
            .map(|s| *s)
            .collect())
    }

    /// Get a solution by intent ID
    async fn get_solution_by_intent_id(
        &self,
        intent_id: &IntentId,
    ) -> Result<Option<SignedSolution>> {
        #[derive(DerivePartialModel, FromQueryResult)]
        #[sea_orm(entity = "solution::Entity")]
        struct OnlySolutionBytes {
            solution_bytes: Option<Vec<u8>>,
        }

        let result = intent::Entity::find()
            .left_join(solution::Entity)
            .filter(intent::Column::IntentId.eq(intent_id.as_slice()))
            .into_partial_model::<OnlySolutionBytes>()
            .one(&self.db)
            .await?;

        let Some(result) = result else {
            bail!(StorageError::CanNotFindIntent(*intent_id));
        };

        Ok(result
            .solution_bytes
            .map(|bytes| bcs::from_bytes(&bytes).unwrap()))
    }

    /// Get solutions by solver
    async fn get_solutions_by_solver(&self, solver: &Address) -> Result<Vec<SignedSolution>> {
        let solutions = solution::Entity::find()
            .filter(solution::Column::Solver.eq(solver.as_slice()))
            .into_partial_model::<solution::OnlySolutionBytes>()
            .all(&self.db)
            .await?;
        Ok(solutions
            .into_iter()
            .map(|s| bcs::from_bytes(&s.solution_bytes).unwrap())
            .collect::<Vec<_>>())
    }

    /// Update history after redeem
    async fn update_history_after_redeem(&self, intent_id: &IntentId, tx_hash: B256) -> Result<()> {
        update_intent_history_by_hash(
            intent_id,
            intent_history::ActiveModel {
                redeem_timestamp: ActiveValue::Set(Some(current_timestamp())),
                redeem_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
                ..Default::default()
            },
            &self.db,
        )
        .await
    }

    /// Update history after hub withdrawal
    async fn update_history_after_hub_withdrawal(
        &self,
        intent_id: &IntentId,
        tx_hash: B256,
    ) -> Result<()> {
        update_intent_history_by_hash(
            intent_id,
            intent_history::ActiveModel {
                withdraw_timestamp: ActiveValue::Set(Some(current_timestamp())),
                withdraw_tx_hash: ActiveValue::Set(Some(tx_hash.to_vec())),
                ..Default::default()
            },
            &self.db,
        )
        .await
    }

    /// Update history after withdrawal reaches spoke
    async fn update_history_after_withdrawal_reach_spoke(
        &self,
        intent_id: &IntentId,
    ) -> Result<()> {
        update_intent_history_by_hash(
            intent_id,
            intent_history::ActiveModel {
                withdraw_to_spoke_timestamp: ActiveValue::Set(Some(current_timestamp())),
                ..Default::default()
            },
            &self.db,
        )
        .await
    }

    /// Get failed intent IDs
    async fn get_failed_intent_ids(&self) -> Result<Vec<IntentId>> {
        let intents = intent::Entity::find()
            .filter(intent::Column::Status.eq(IntentState::Error as u8))
            .all(&self.db)
            .await?;
        Ok(intents
            .into_iter()
            .map(|i| IntentId::from_slice(&i.intent_id))
            .collect::<Vec<_>>())
    }

    /// Get failed intents after a timestamp
    async fn get_failed_intents_after_timestamp(
        &self,
        timestamp: u64,
    ) -> Result<Vec<(IntentHistory, Intent)>> {
        let rows = intent_history::Entity::find()
            .find_also_related(intent::Entity)
            .filter(intent_history::Column::ErrorTimestamp.gt(timestamp))
            .order_by_asc(intent_history::Column::Id)
            .all(&self.db)
            .await?;
        let results = rows
            .into_iter()
            .filter_map(|(h, i)| i.map(|i| (h.into(), i.into())))
            .collect::<Vec<_>>();
        Ok(results)
    }
}

pub struct StorageServiceOptions {
    db: DatabaseConnection,
    expiration_tx_capacity: usize,
    migrate: bool,
}

impl StorageServiceOptions {
    /// Set whether migrations should be run automatically.
    ///
    /// By default, migrations are run automatically.
    pub fn migrate(mut self, migrate: bool) -> Self {
        self.migrate = migrate;
        self
    }

    /// Set the capacity of the expiration broadcast channel.
    ///
    /// By default, the capacity is 16.
    pub fn expiration_tx_capacity(mut self, capacity: usize) -> Self {
        self.expiration_tx_capacity = capacity;
        self
    }

    pub async fn build(self) -> Result<StorageService> {
        let service = StorageService {
            db: self.db,
            connected_solvers: Default::default(),
            expiration_tx: broadcast::Sender::new(self.expiration_tx_capacity),
            chain_height: Arc::new(AtomicI64::new(0)),
        };
        if self.migrate {
            Migrator::up(&service.db, None).await?;
        }
        service.restore_metrics().await?;
        Ok(service)
    }
}

impl StorageService {
    /// Restore some metrics from the database.
    ///
    /// Currently this restores only the authorized solver gauge.
    async fn restore_metrics(&self) -> Result<()> {
        authorized_solver_gauge().set(
            solver::Entity::find()
                .filter(solver::Column::IsAuthorized.eq(true))
                .count(&self.db)
                .await? as i64,
        );
        Ok(())
    }

    pub fn update_chain_height(&self, height: u64) {
        self.chain_height
            .fetch_max(i64::try_from(height).unwrap_or_default(), Ordering::AcqRel);
    }

    pub fn get_chain_height(&self) -> i64 {
        self.chain_height.load(Ordering::Acquire)
    }

    /// Subscribe to expired intent ids.
    ///
    /// You should spawn a task to poll_process_expired_intents.
    pub fn subscribe_expired_intents(&self) -> broadcast::Receiver<Arc<[IntentId]>> {
        self.expiration_tx.subscribe()
    }

    /// Run process_expired_intents in a loop, sleep for the given interval in
    /// between.
    pub async fn poll_process_expired_intents(self, interval: Duration) {
        loop {
            match self.process_expired_intents().await {
                Ok(expired_intents) => {
                    _ = self.expiration_tx.send(expired_intents);
                }
                Err(e) => {
                    error!("Error processing expired intents: {e:#}");
                }
            }
            tokio::time::sleep(interval).await;
        }
    }

    /// Update a batch of expired (but still active) intents and return them.
    ///
    /// The intents are marked as expired and not active now.
    pub async fn process_expired_intents(&self) -> Result<Arc<[IntentId]>> {
        let stmt = self.db.get_database_backend().build(
            Query::update()
                .table(intent::Entity)
                .value(intent::Column::IsActive, false)
                .value(intent::Column::Status, IntentState::Expired as i16)
                .and_where(
                    intent::Column::Id.in_subquery(
                        intent::Entity::find()
                            // Use the ttl_i64 where is_active index.
                            .filter(intent::Column::IsActive.eq(true))
                            .filter(intent::Column::TtlI64.lte(self.get_chain_height()))
                            .order_by_asc(intent::Column::TtlI64)
                            .limit(100)
                            .select_only()
                            .select_column(intent::Column::Id)
                            .into_query(),
                    ),
                )
                .returning_col(intent::Column::IntentId),
        );
        let result = self.db.query_all(stmt).await?;
        Ok(result
            .into_iter()
            .map(|i| IntentId::from_slice(&i.try_get_by_index::<Vec<u8>>(0).unwrap()))
            .collect())
    }

    async fn txn(&self) -> Result<DatabaseTransaction> {
        let txn = self.db.begin().await?;
        Ok(txn)
    }
}

/// Execute an update by primary key as specified by the active model. Returns
/// the error if no rows are affected.
async fn do_update(
    am: impl ActiveModelTrait,
    conn: &impl ConnectionTrait,
    err: StorageError,
) -> Result<()> {
    let r = Updater::new(Update::one(am).into_query())
        .exec(conn)
        .await?;
    if r.rows_affected == 0 {
        bail!(err);
    }
    Ok(())
}

/// Update an intent by intent ID (hash). Returns CanNotFindIntent if the intent is not found.
async fn update_intent_by_hash(
    intent_id: &IntentId,
    am: intent::ActiveModel,
    conn: &impl ConnectionTrait,
) -> Result<()> {
    let update = Update::many(intent::Entity)
        .set(am)
        .filter(intent::Column::IntentId.eq(intent_id.as_slice()))
        .into_query();
    let r = Updater::new(update).exec(conn).await?;
    if r.rows_affected == 0 {
        bail!(StorageError::CanNotFindIntent(*intent_id));
    }
    Ok(())
}

/// Update an intent history by intent ID (hash). Returns CanNotFindIntentHistory if the intent history is not found.
async fn update_intent_history_by_hash(
    intent_id: &IntentId,
    am: intent_history::ActiveModel,
    conn: &impl ConnectionTrait,
) -> Result<()> {
    let update = Update::many(intent_history::Entity)
        .set(am)
        .filter(intent_history::Column::IntentHash.eq(intent_id.as_slice()))
        .into_query();
    let r = Updater::new(update).exec(conn).await?;
    if r.rows_affected == 0 {
        bail!(StorageError::CanNotFindIntentHistory(*intent_id));
    }
    Ok(())
}

pub(crate) fn current_timestamp() -> i64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64
}

// Builders.

/// Create a new storage service from the given database connection.
///
/// By default, migrations will be run automatically.
pub fn on_db(db: DatabaseConnection) -> StorageServiceOptions {
    StorageServiceOptions {
        db,
        expiration_tx_capacity: 16,
        migrate: true,
    }
}

/// Create a new storage service from the given sqlx database pool.
///
/// By default, migrations will be run automatically.
pub fn on_pool(pool: impl Into<DatabaseConnection>) -> StorageServiceOptions {
    on_db(pool.into())
}

/// Create a new storage service from the given database URL.
///
/// By default, migrations will be run automatically.
pub async fn connect(url: &str) -> Result<StorageServiceOptions> {
    let db = Database::connect(url).await?;
    Ok(on_db(db))
}
