use alloy::primitives::{keccak256, Address, B256};
use alloy::signers::Signature;
use anyhow::Result;
use apm::connected_solver_gauge;
use medusa_types::{Intent, IntentId, IntentState, RefinementStatus, SignedSolution};
use rocksdb::{ColumnFamily, DBIterator, IteratorMode, Options, WriteBatch};
use rustc_hash::FxHashSet as HashSet;
use std::cell::LazyCell;
use std::path::Path;
use std::sync::Arc;
// use tracing::{debug, error, span, trace, Level};

use crate::storage::IntentHistory;

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
// connected solvers are stored under the CONNECTED_SOLVERS_KEY
const MISC_COL: &str = "c10";
const METRICS_COL: &str = "c11";
const SOLVER_ADDRESS_KEY: LazyCell<B256> = LazyCell::new(|| keccak256("solver_key"));
const CONNECTED_SOLVERS_KEY: LazyCell<B256> = LazyCell::new(|| keccak256("connected_solvers_key"));
const FAILED_INTENTS_KEY: LazyCell<B256> = LazyCell::new(|| keccak256("failed_intents_key"));

pub struct DB(Arc<rocksdb::DB>);

#[allow(dead_code)]
impl DB {
    pub fn new<P: AsRef<Path>>(path: P, reset: bool) -> Result<Self> {
        let mut db_opts = Options::default();
        db_opts.create_missing_column_families(true);
        db_opts.create_if_missing(true);
        let cfs = vec![
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
        ];
        let db = rocksdb::DB::open_cf(&db_opts, path, &cfs)?;
        let mut batch = WriteBatch::default();
        if reset {
            for cf_name in cfs {
                if cf_name != MISC_COL {
                    let cf = db.cf_handle(cf_name).unwrap();
                    let iter = db.iterator_cf(cf, IteratorMode::Start);
                    for item in iter {
                        let key = item.unwrap().0;
                        batch.delete_cf(cf, key);
                    }
                }
            }
        }
        batch.delete_cf(
            db.cf_handle(MISC_COL).unwrap(),
            CONNECTED_SOLVERS_KEY.as_slice(),
        );
        batch.delete_cf(
            db.cf_handle(MISC_COL).unwrap(),
            FAILED_INTENTS_KEY.as_slice(),
        );
        db.write(batch).unwrap();
        Ok(Self(Arc::new(db)))
    }

    fn cf(&self, name: &str) -> &ColumnFamily {
        self.0.cf_handle(name).unwrap()
    }

    // methods to modify AUTHOR_INTENT_ID_COL
    pub fn add_intent_id_to_author_col(
        &self,
        author: &Address,
        intent_id: &IntentId,
    ) -> Result<()> {
        let mut origin = self.get_intent_ids_by_author(author)?;
        origin.insert(*intent_id);
        self.0.put_cf(
            self.cf(AUTHOR_INTENT_ID_COL),
            author.as_slice(),
            bcs::to_bytes(&origin)?,
        )?;
        Ok(())
    }

    // methods to modify REFINEMENT_COL
    pub fn add_or_modify_refinement(
        &self,
        intent_id: &IntentId,
        refinement: Option<RefinementStatus>,
    ) -> Result<()> {
        self.0.put_cf(
            self.cf(REFINEMENT_COL),
            intent_id.as_slice(),
            bcs::to_bytes(&refinement)?,
        )?;
        Ok(())
    }

    // methods to modify ACTIVE_INTENT_COL
    pub fn add_intent_to_active_intent_col(&self, intent: &Intent) -> Result<()> {
        let id = intent.intent_id();
        self.0.put_cf(
            self.cf(ACTIVE_INTENT_COL),
            id.as_slice(),
            bcs::to_bytes(intent)?,
        )?;
        Ok(())
    }

    pub fn remove_intent_from_active_intent_col(&self, intent_id: &IntentId) -> Result<()> {
        self.0
            .delete_cf(self.cf(ACTIVE_INTENT_COL), intent_id.as_slice())?;
        Ok(())
    }

    // methods to modify INACTIVE_INTENT_COL
    pub fn add_intent_to_inactive_intent_col(&self, intent: &Intent) -> Result<()> {
        let id = intent.intent_id();
        self.0.put_cf(
            self.cf(INACTIVE_INTENT_COL),
            id.as_slice(),
            bcs::to_bytes(intent)?,
        )?;
        Ok(())
    }

    // methods to modify INTENT_STATUS_COL
    pub fn add_or_modify_intent_status(
        &self,
        intent_id: &IntentId,
        status: &IntentState,
    ) -> Result<()> {
        self.0.put_cf(
            self.cf(INTENT_STATUS_COL),
            intent_id.as_slice(),
            bcs::to_bytes(status)?,
        )?;
        Ok(())
    }

    // methods to modify INTENT_SIGNATURE_COL
    pub fn add_intent_signature_to_signature_col(
        &self,
        intent_id: &IntentId,
        sig: &Signature,
    ) -> Result<()> {
        self.0.put_cf(
            self.cf(INTENT_SIGNATURE_COL),
            intent_id.as_slice(),
            bcs::to_bytes(sig)?,
        )?;
        Ok(())
    }

    // methods to modify INTENT_HISTORY_COL
    pub fn add_or_modify_intent_history(
        &self,
        intent_id: &IntentId,
        history: IntentHistory,
    ) -> Result<()> {
        self.0.put_cf(
            self.cf(INTENT_HISTORY_COL),
            intent_id.as_slice(),
            bcs::to_bytes(&history)?,
        )?;
        Ok(())
    }

    // methods to modify SOLUTION_COL
    pub fn add_solution_to_solution_col(&self, solution: &SignedSolution) -> Result<()> {
        let hash = solution.hash();
        self.0.put_cf(
            self.cf(SOLUTION_COL),
            hash.as_slice(),
            bcs::to_bytes(solution)?,
        )?;
        Ok(())
    }

    // methods to modify INTENT_SOLUTION_COL
    pub fn add_solution_to_intent_solution_col(
        &self,
        intent_id: &IntentId,
        solution_hash: B256,
    ) -> Result<()> {
        self.0.put_cf(
            self.cf(INTENT_SOLUTION_COL),
            intent_id.as_slice(),
            bcs::to_bytes(&solution_hash)?,
        )?;
        Ok(())
    }

    // methods to modify SOLVER_COL

    pub fn add_solution_hash_to_solver_col(
        &self,
        solver: Address,
        solution_hash: B256,
    ) -> Result<()> {
        let mut solver_solution_hashes = self.get_solution_hashes_by_solver_address(&solver)?;
        solver_solution_hashes.push(solution_hash);
        self.0.put_cf(
            self.cf(SOLVER_COL),
            solver.as_slice(),
            bcs::to_bytes(&solver_solution_hashes)?,
        )?;
        Ok(())
    }

    // methods related to MISC_COL
    pub fn add_misc(&self, key: &[u8], value: &[u8]) -> Result<()> {
        self.0.put_cf(self.cf(MISC_COL), key, value)?;
        Ok(())
    }

    pub fn add_metrics(&self, key: &[u8], value: &[u8]) -> Result<()> {
        self.0.put_cf(self.cf(METRICS_COL), key, value)?;
        Ok(())
    }

    pub fn metrics_iter_from_start(&self) -> DBIterator {
        self.0
            .iterator_cf(self.cf(METRICS_COL), IteratorMode::Start)
    }

    pub fn add_solver_to_authorized_solvers_list(&self, solver: Address) -> Result<()> {
        let mut origin = self.get_authorized_solvers()?;
        origin.insert(solver);
        self.0.put_cf(
            self.cf(MISC_COL),
            SOLVER_ADDRESS_KEY.as_slice(),
            bcs::to_bytes(&origin)?,
        )?;

        connected_solver_gauge().set(origin.len() as i64);

        Ok(())
    }

    pub fn remove_solver_from_authorized_solvers_list(&self, solver: Address) -> Result<()> {
        let mut origin = self.get_authorized_solvers()?;
        origin.remove(&solver);
        self.0.put_cf(
            self.cf(MISC_COL),
            SOLVER_ADDRESS_KEY.as_slice(),
            bcs::to_bytes(&origin)?,
        )?;

        connected_solver_gauge().set(origin.len() as i64);

        Ok(())
    }

    pub fn add_solver_to_connected_solvers_list(&self, solver: Address) -> Result<()> {
        let mut origin = self.get_connected_solvers()?;
        origin.insert(solver);
        self.0.put_cf(
            self.cf(MISC_COL),
            CONNECTED_SOLVERS_KEY.as_slice(),
            bcs::to_bytes(&origin)?,
        )?;
        Ok(())
    }

    pub fn remove_solver_from_connected_solvers_list(&self, solver: Address) -> Result<()> {
        let mut origin = self.get_connected_solvers()?;
        origin.remove(&solver);
        self.0.put_cf(
            self.cf(MISC_COL),
            CONNECTED_SOLVERS_KEY.as_slice(),
            bcs::to_bytes(&origin)?,
        )?;
        Ok(())
    }

    pub fn add_intent_to_failed_intents_list(&self, intent_id: IntentId) -> Result<()> {
        let mut origin = self.get_failed_intent_ids()?;
        origin.push(intent_id);
        self.0.put_cf(
            self.cf(MISC_COL),
            FAILED_INTENTS_KEY.as_slice(),
            bcs::to_bytes(&origin)?,
        )?;
        Ok(())
    }

    // public getters
    pub fn get_intent_ids_by_author(&self, author: &Address) -> Result<HashSet<IntentId>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(AUTHOR_INTENT_ID_COL), author.as_slice())?
        {
            let set: HashSet<IntentId> = bcs::from_bytes(&raw)?;
            Ok(set)
        } else {
            Ok(HashSet::default())
        }
    }

    pub fn get_refinement_mapping_by_id(
        &self,
        intent_id: IntentId,
    ) -> Result<Option<RefinementStatus>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(REFINEMENT_COL), intent_id.as_slice())?
        {
            let refinement: Option<RefinementStatus> = bcs::from_bytes(&raw)?;
            return Ok(refinement);
        }
        Ok(None)
    }

    pub fn get_active_intent_col_iter_from_start(&self) -> Result<DBIterator> {
        Ok(self
            .0
            .iterator_cf(self.cf(ACTIVE_INTENT_COL), IteratorMode::Start))
    }

    pub fn get_active_intent_col_iter_from_end(&self) -> Result<DBIterator> {
        Ok(self
            .0
            .iterator_cf(self.cf(ACTIVE_INTENT_COL), IteratorMode::End))
    }

    pub fn get_active_intent_by_id(&self, id: &IntentId) -> Result<Option<Intent>> {
        if let Some(raw) = self.0.get_cf(self.cf(ACTIVE_INTENT_COL), id.as_slice())? {
            let intent: Intent = bcs::from_bytes(&raw)?;
            return Ok(Some(intent));
        }
        Ok(None)
    }

    pub fn get_inactive_intent_col_iter_from_start(&self) -> Result<DBIterator> {
        Ok(self
            .0
            .iterator_cf(self.cf(INACTIVE_INTENT_COL), IteratorMode::Start))
    }

    pub fn get_inactive_intent_col_iter_from_end(&self) -> Result<DBIterator> {
        Ok(self
            .0
            .iterator_cf(self.cf(INACTIVE_INTENT_COL), IteratorMode::End))
    }

    pub fn get_inactive_intent_by_id(&self, id: &IntentId) -> Result<Option<Intent>> {
        if let Some(raw) = self.0.get_cf(self.cf(INACTIVE_INTENT_COL), id.as_slice())? {
            let intent: Intent = bcs::from_bytes(&raw)?;
            return Ok(Some(intent));
        }
        Ok(None)
    }

    pub fn get_intent_status_by_id(&self, intent_id: &IntentId) -> Result<Option<IntentState>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(INTENT_STATUS_COL), intent_id.as_slice())?
        {
            let status: IntentState = bcs::from_bytes(&raw)?;
            return Ok(Some(status));
        }
        Ok(None)
    }

    pub fn get_intent_signature_by_id(&self, id: &IntentId) -> Result<Option<Signature>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(INTENT_SIGNATURE_COL), id.as_slice())?
        {
            let sig: Signature = bcs::from_bytes(&raw)?;
            return Ok(Some(sig));
        }
        Ok(None)
    }

    pub fn get_intent_history_by_id(&self, intent_id: &IntentId) -> Result<IntentHistory> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(INTENT_HISTORY_COL), intent_id.as_slice())?
        {
            let history: IntentHistory = bcs::from_bytes(&raw)?;
            return Ok(history);
        }
        Ok(IntentHistory::default())
    }

    pub fn get_solution_by_hash(&self, hash: &B256) -> Result<Option<SignedSolution>> {
        if let Some(raw) = self.0.get_cf(self.cf(SOLUTION_COL), hash.as_slice())? {
            let solution: SignedSolution = bcs::from_bytes(&raw)?;
            return Ok(Some(solution));
        }
        Ok(None)
    }

    pub fn get_solution_hash_by_intent_id(&self, id: &IntentId) -> Result<Option<B256>> {
        if let Some(hash) = self.0.get_cf(self.cf(INTENT_SOLUTION_COL), id.as_slice())? {
            let hash: B256 = bcs::from_bytes(&hash)?;
            return Ok(Some(hash));
        }
        Ok(None)
    }

    pub fn get_solution_hashes_by_solver_address(&self, solver: &Address) -> Result<Vec<B256>> {
        if let Some(raw) = self.0.get_cf(self.cf(SOLVER_COL), solver.as_slice())? {
            let set: Vec<B256> = bcs::from_bytes(&raw)?;
            return Ok(set);
        }
        Ok(Vec::default())
    }

    pub fn get_solution_col_iter_from_start(&self) -> Result<DBIterator> {
        Ok(self
            .0
            .iterator_cf(self.cf(SOLUTION_COL), IteratorMode::Start))
    }

    pub fn get_solution_col_iter_from_end(&self) -> Result<DBIterator> {
        Ok(self.0.iterator_cf(self.cf(SOLUTION_COL), IteratorMode::End))
    }

    pub fn get_authorized_solvers(&self) -> Result<HashSet<Address>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(MISC_COL), SOLVER_ADDRESS_KEY.as_slice())?
        {
            let solvers: HashSet<Address> = bcs::from_bytes(&raw)?;
            return Ok(solvers);
        }
        Ok(HashSet::default())
    }

    pub fn get_connected_solvers(&self) -> Result<HashSet<Address>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(MISC_COL), CONNECTED_SOLVERS_KEY.as_slice())?
        {
            let solvers: HashSet<Address> = bcs::from_bytes(&raw)?;
            return Ok(solvers);
        }
        Ok(HashSet::default())
    }

    pub fn get_failed_intent_ids(&self) -> Result<Vec<IntentId>> {
        if let Some(raw) = self
            .0
            .get_cf(self.cf(MISC_COL), FAILED_INTENTS_KEY.as_slice())?
        {
            let set: Vec<IntentId> = bcs::from_bytes(&raw)?;
            return Ok(set);
        }
        Ok(Vec::default())
    }
}
