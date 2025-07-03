use std::cell::LazyCell;
use std::collections::HashSet;

use anyhow::Result;
use medusa_storage::db::entities::{intent, intent_history, refinement, solution, solver};
use medusa_types::{
    keccak256, Address, Intent, IntentHistory, IntentId, IntentState, Signature, SignedSolution,
    B256,
};
use rocksdb::{ColumnFamily, IteratorMode};
use sea_orm_migration::sea_orm::{ActiveValue, Database, DatabaseConnection, Insert};

const AUTHOR_INTENT_ID_COL: &str = "c0"; // author address <> vec<intent_id>
const REFINEMENT_COL: &str = "c1"; // intent_id <> intent refinement
const ACTIVE_INTENT_COL: &str = "c2"; // intent_id <> intent for intents that are OPEN or LOCKED
const INACTIVE_INTENT_COL: &str = "c3"; // intent_id <> intent
const INTENT_STATUS_COL: &str = "c4"; // intent_id <> intent status
const INTENT_SIGNATURE_COL: &str = "c5"; // intent_id <> intent signature
const INTENT_HISTORY_COL: &str = "c6"; // intent_id <> intent history

const SOLUTION_COL: &str = "c7"; // solution_hash <> signed_solution
const INTENT_SOLUTION_COL: &str = "c8"; // intent_id <> solution_hash
const SOLVER_COL: &str = "c9"; // solver address <> vec<solution_hash>

// solver addresses are stored under the SOLVER_ADDRESS_KEY
const MISC_COL: &str = "c10";
const METRICS_COL: &str = "c11";
const SOLVER_ADDRESS_KEY: LazyCell<B256> = LazyCell::new(|| keccak256("solver_key"));

pub struct DbHandle {
    rdb: DatabaseConnection,
    kv: rocksdb::DB,
}

impl DbHandle {
    pub async fn new(rdb_url: &str, kv_path: &str) -> Self {
        let rdb = Database::connect(rdb_url).await.unwrap();
        let mut db_opts = rocksdb::Options::default();
        db_opts.create_missing_column_families(true);
        db_opts.create_if_missing(true);
        let kv = rocksdb::DB::open_cf(
            &db_opts,
            kv_path,
            [
                AUTHOR_INTENT_ID_COL,
                REFINEMENT_COL,
                ACTIVE_INTENT_COL,
                INACTIVE_INTENT_COL,
                INTENT_STATUS_COL,
                INTENT_SIGNATURE_COL,
                INTENT_HISTORY_COL,
                SOLUTION_COL,
                INTENT_SOLUTION_COL,
                SOLVER_COL,
                MISC_COL,
                METRICS_COL,
            ],
        )
        .unwrap();

        Self { rdb, kv }
    }

    pub async fn run(&self) -> Result<()> {
        self.migrate_intents(self.get_cf(ACTIVE_INTENT_COL)).await?;
        self.migrate_intents(self.get_cf(INACTIVE_INTENT_COL))
            .await?;
        self.migrate_solutions().await?;
        self.migrate_refinements().await?;
        self.migrate_solvers().await?;

        Ok(())
    }

    async fn migrate_intents(&self, col: &ColumnFamily) -> Result<()> {
        for (i, item) in self.kv.iterator_cf(col, IteratorMode::Start).enumerate() {
            let (key, value) = item?;
            let intent_id = IntentId::from_slice(&key[..32]);

            eprintln!("Migrating intent_{}: {}", i, intent_id);

            let intent: Intent = bcs::from_bytes(&value)?;
            let intent_status = self
                .kv
                .get_cf(self.get_cf(INTENT_STATUS_COL), intent_id)?
                .unwrap();
            let intent_status: IntentState = bcs::from_bytes(&intent_status).unwrap();
            let intent_history = self
                .kv
                .get_cf(self.get_cf(INTENT_HISTORY_COL), intent_id)?
                .unwrap();
            let intent_history: IntentHistory = bcs::from_bytes(&intent_history).unwrap();
            let intent_signature = self
                .kv
                .get_cf(self.get_cf(INTENT_SIGNATURE_COL), intent_id)?
                .unwrap();
            let intent_signature: Signature = bcs::from_bytes(&intent_signature).unwrap();
            let intent_solution_hash: Option<B256> = self
                .kv
                .get_cf(self.get_cf(INTENT_SOLUTION_COL), intent_id)?
                .map(|v| bcs::from_bytes(&v).unwrap());

            let id = Insert::one(intent::ActiveModel {
                id: ActiveValue::NotSet,
                intent_id: ActiveValue::Set(intent_id.to_vec()),
                author: ActiveValue::Set(intent.author.to_vec()),
                ttl: ActiveValue::Set(intent.ttl.to_be_bytes_vec()),
                nonce: ActiveValue::Set(intent.nonce.to_be_bytes_vec()),
                src_m_token: ActiveValue::Set(intent.src_m_token.to_vec()),
                src_amount: ActiveValue::Set(intent.src_amount.to_be_bytes_vec()),
                outcome: ActiveValue::Set(bcs::to_bytes(&intent.outcome).unwrap()),
                signature: ActiveValue::Set(Some(intent_signature.as_bytes().to_vec())),
                is_active: ActiveValue::Set(true),
                status: ActiveValue::Set(intent_status as i16),
                solution_hash: ActiveValue::Set(intent_solution_hash.map(|h| h.to_vec())),
                tx_hash: ActiveValue::Set(Some(intent_history.publish_tx_hash.unwrap().to_vec())),
                is_tx_success: ActiveValue::Set(true),
                ttl_i64: ActiveValue::Set(intent.ttl.to::<i64>()),
                timestamp: ActiveValue::Set(intent_history.publish_timestamp.unwrap() as i64),
            })
            .exec(&self.rdb)
            .await?
            .last_insert_id;

            Insert::one(intent_history::ActiveModel {
                id: ActiveValue::Set(id),
                intent_hash: ActiveValue::Set(intent_id.to_vec()),
                publish_timestamp: ActiveValue::Set(Some(
                    intent_history.publish_timestamp.unwrap() as i64,
                )),
                publish_tx_hash: ActiveValue::Set(Some(
                    intent_history.publish_tx_hash.unwrap().to_vec(),
                )),
                solve_timestamp: ActiveValue::Set(intent_history.solve_timestamp.map(|t| t as i64)),
                solve_tx_hash: ActiveValue::Set(intent_history.solve_tx_hash.map(|h| h.to_vec())),
                redeem_timestamp: ActiveValue::Set(
                    intent_history.redeem_timestamp.map(|t| t as i64),
                ),
                redeem_tx_hash: ActiveValue::Set(intent_history.redeem_tx_hash.map(|h| h.to_vec())),
                withdraw_timestamp: ActiveValue::Set(
                    intent_history.withdraw_timestamp.map(|t| t as i64),
                ),
                withdraw_tx_hash: ActiveValue::Set(
                    intent_history.withdraw_tx_hash.map(|h| h.to_vec()),
                ),
                withdraw_to_spoke_timestamp: ActiveValue::Set(
                    intent_history.withdraw_to_spoke_timestamp.map(|t| t as i64),
                ),
                cancel_timestamp: ActiveValue::Set(
                    intent_history.cancel_timestamp.map(|t| t as i64),
                ),
                cancel_tx_hash: ActiveValue::Set(intent_history.cancel_tx_hash.map(|h| h.to_vec())),
                remaining_intent_id: ActiveValue::Set(
                    intent_history.remaining_intent_id.map(|h| h.to_vec()),
                ),
                error_timestamp: ActiveValue::Set(intent_history.error_timestamp.map(|t| t as i64)),
                error_tx_hash: ActiveValue::Set(intent_history.error_tx_hash.map(|h| h.to_vec())),
                error_type: ActiveValue::Set(intent_history.error_type.map(|t| t as i16)),
            })
            .exec(&self.rdb)
            .await?;
        }

        Ok(())
    }

    async fn migrate_solutions(&self) -> Result<()> {
        for (i, item) in self
            .kv
            .iterator_cf(self.get_cf(SOLUTION_COL), IteratorMode::Start)
            .enumerate()
        {
            let (key, value) = item?;
            let solution_hash = B256::from_slice(&key[..32]);

            eprintln!("Migrating solution_{}: {}", i, solution_hash);

            let solution: SignedSolution = bcs::from_bytes(&value)?;
            let intent_history = self
                .kv
                .get_cf(
                    self.get_cf(INTENT_HISTORY_COL),
                    solution.solution.intent_ids[0],
                )?
                .unwrap();
            let intent_history: IntentHistory = bcs::from_bytes(&intent_history).unwrap();

            Insert::one(solution::ActiveModel {
                id: ActiveValue::NotSet,
                solution_hash: ActiveValue::Set(solution_hash.to_vec()),
                solution_bytes: ActiveValue::Set(bcs::to_bytes(&solution).unwrap()),
                solver: ActiveValue::Set(solution.recover_address().to_vec()),
                tx_hash: ActiveValue::Set(intent_history.solve_tx_hash.unwrap().to_vec()),
                is_tx_success: ActiveValue::Set(true),
                timestamp: ActiveValue::Set(intent_history.solve_timestamp.unwrap() as i64),
            })
            .exec(&self.rdb)
            .await?;
        }

        Ok(())
    }

    async fn migrate_refinements(&self) -> Result<()> {
        for (i, item) in self
            .kv
            .iterator_cf(self.get_cf(REFINEMENT_COL), IteratorMode::Start)
            .enumerate()
        {
            let (key, value) = item?;
            let intent_id = IntentId::from_slice(&key[..32]);

            eprintln!("Migrating refinement_{}: {}", i, intent_id);

            Insert::one(refinement::ActiveModel {
                intent_id: ActiveValue::Set(intent_id.to_vec()),
                refinement: ActiveValue::Set(Some(value.to_vec())),
            })
            .exec(&self.rdb)
            .await?;
        }

        Ok(())
    }

    async fn migrate_solvers(&self) -> Result<()> {
        let authorized_solvers = self
            .kv
            .get_cf(self.get_cf(MISC_COL), SOLVER_ADDRESS_KEY.as_slice())?
            .unwrap();
        let authorized_solvers: HashSet<Address> = bcs::from_bytes(&authorized_solvers)?;

        let solvers = authorized_solvers
            .iter()
            .map(|s| solver::ActiveModel {
                address: ActiveValue::Set(s.to_vec()),
                is_authorized: ActiveValue::Set(true),
            })
            .collect::<Vec<_>>();

        Insert::many(solvers).exec(&self.rdb).await?;

        Ok(())
    }

    fn get_cf(&self, name: &str) -> &ColumnFamily {
        self.kv.cf_handle(name).unwrap()
    }
}
