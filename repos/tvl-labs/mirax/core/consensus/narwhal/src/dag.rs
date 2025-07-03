use std::collections::{HashMap, HashSet};
use std::fmt::{self, Debug, Formatter};
use std::sync::Arc;

use arc_swap::ArcSwap;
use dashmap::DashMap;
use derive_more::{Constructor, Display};
use mirax_consensus_traits::ConsensusStorage;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use thiserror::Error;

use mirax_types::{Address, BlockNumber, Byte32, TransactionChunk, H256};

use crate::types::NarwhalResult;

/// Directed acyclic graph of transaction chunks.
pub struct Dag<Sig, CS> {
    inner: DashMap<BlockNumber, DashMap<Address, TransactionChunk<Sig>>>,
    validator_number: ArcSwap<usize>,
    storage: Arc<CS>,
}

impl<Sig, CS> Debug for Dag<Sig, CS>
where
    Sig: Serialize + DeserializeOwned + Clone + Debug + Send + Sync,
    CS: ConsensusStorage,
{
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        f.debug_struct("Dag")
            .field("inner", &self.inner)
            .field("validator_number", &self.validator_number)
            .finish()
    }
}

impl<Sig, CS> Dag<Sig, CS>
where
    Sig: Serialize + DeserializeOwned + Clone + Debug + Send + Sync,
    CS: ConsensusStorage,
{
    pub fn new(validator_count: usize, storage: Arc<CS>) -> Self {
        Self {
            inner: DashMap::new(),
            validator_number: ArcSwap::from_pointee(validator_count),
            storage,
        }
    }

    pub fn get_tx_chunk(
        &self,
        block_number: &BlockNumber,
        origin: &Address,
    ) -> Option<TransactionChunk<Sig>> {
        self.inner
            .get(block_number)
            .and_then(|sub_dag| sub_dag.get(origin).map(|i| i.value().clone()))
    }

    pub fn get_children_support(
        &self,
        block_number: &BlockNumber,
        origin: &Address,
    ) -> NarwhalResult<Vec<Address>> {
        let tx_chunk =
            self.get_tx_chunk(block_number, origin)
                .ok_or(DagError::CannotFindVertex(Vertex::new(
                    *block_number,
                    *origin,
                )))?;
        let batch_hash = tx_chunk.transaction_batch.hash();

        let next_block_number = block_number + 1;
        if let Some(sub_dag) = self.inner.get(&next_block_number) {
            let mut children = Vec::with_capacity(**self.validator_number.load());

            sub_dag.iter().for_each(|chunk| {
                children.extend(chunk.certificates.iter().filter_map(|cert| {
                    (cert.previous_tx_batch_hash == batch_hash).then_some(chunk.origin())
                }));
            });

            return Ok(children);
        }

        Ok(Vec::new())
    }

    pub async fn insert_chunk(
        &self,
        block_number: BlockNumber,
        chunk: TransactionChunk<Sig>,
    ) -> NarwhalResult<()> {
        let origin = chunk.origin();
        if self.is_proposed(&block_number, &origin) {
            return Err(DagError::DuplicateProposal(block_number, origin).into());
        }

        let tx_hashes = chunk
            .transaction_batch
            .transactions
            .iter()
            .map(|tx| tx.hash)
            .collect::<Vec<_>>();
        let duplicate_txs = self.storage.check_transactions_exist(&tx_hashes).await?;
        if !duplicate_txs.is_empty() {
            return Err(DagError::DuplicateTransactions(duplicate_txs).into());
        }

        log::debug!("[Narwhal] Insert transaction chunk: {:?}", chunk);

        // Save the transaction chunk to the storage before update the memory.
        self.storage.insert_transaction_chunk(&chunk).await?;
        self.inner
            .entry(block_number)
            .or_default()
            .insert(origin, chunk);
        Ok(())
    }

    pub fn is_linked(&self, prev: &TransactionChunk<Sig>, base: &TransactionChunk<Sig>) -> bool {
        let mut set = base
            .certificates
            .iter()
            .map(|cert| cert.previous_tx_batch_hash)
            .collect::<HashSet<_>>();

        for number in (prev.block_number()..base.block_number()).rev() {
            let mut new_set = HashSet::new();
            self.inner.get(&number).unwrap().iter().for_each(|chunk| {
                if set.contains(&chunk.transaction_batch.hash()) {
                    chunk.certificates.iter().for_each(|cert| {
                        new_set.insert(cert.previous_tx_batch_hash);
                    })
                }
            });

            set = new_set;
        }

        set.contains(&prev.hash())
    }

    pub fn order(
        &self,
        leader: &TransactionChunk<Sig>,
        gc_depth: u64,
        last_committed: &HashMap<Address, BlockNumber>,
    ) -> Vec<TransactionChunk<Sig>> {
        log::debug!("[Narwhal] Current DAG is {:#?}", self);

        let gc_number = leader.block_number().saturating_sub(gc_depth);
        let mut ordered = Vec::new();
        let mut ordered_set = HashSet::new();
        let mut buffer = vec![leader.clone()];

        while let Some(chunk) = buffer.pop() {
            let block_number = chunk.block_number();
            ordered.push(chunk.clone());

            if block_number == gc_number + 1 {
                continue;
            }

            for &parent in chunk.parents().iter() {
                let parent_chunk = self
                    .inner
                    .get(&(block_number - 1))
                    .and_then(|level| {
                        level
                            .value()
                            .iter()
                            .find(|c| c.transaction_batch.hash() == parent)
                            .map(|c| c.value().clone())
                    })
                    .unwrap();

                let is_skip = ordered_set.contains(&parent)
                    || last_committed
                        .get(&parent_chunk.origin())
                        .map_or_else(|| false, |num| &parent_chunk.block_number() <= num);

                if !is_skip {
                    buffer.push(parent_chunk.clone());
                    ordered_set.insert(parent);
                }
            }
        }

        ordered.sort_by_key(|o| o.block_number());
        ordered
    }

    pub fn clean_up(&self, retain_num: &BlockNumber) {
        self.inner.retain(|num, _| num >= retain_num)
    }

    fn is_proposed(&self, block_number: &BlockNumber, origin: &Address) -> bool {
        self.inner
            .get(block_number)
            .map(|sub_dag| sub_dag.contains_key(origin))
            .unwrap_or_default()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CommittedDagState<S> {
    last_committed: HashMap<Address, BlockNumber>,
    committed_dag: CommittedSubDag<S>,
}

impl<S> CommittedDagState<S> {
    pub fn new(
        last_committed: HashMap<Address, BlockNumber>,
        committed_dag: CommittedSubDag<S>,
    ) -> Self {
        Self {
            last_committed,
            committed_dag,
        }
    }

    pub fn unique_key(&self) -> Byte32 {
        let mut id = [0u8; 32];
        let block_number = self.committed_dag.leader_propose.block_number();
        let leader = self.committed_dag.leader_propose.origin();
        let index = self.committed_dag.index;

        id[0..8].copy_from_slice(&block_number.to_le_bytes());
        id[8..28].copy_from_slice(leader.as_bytes());
        id[28..32].copy_from_slice(&(index as u32).to_le_bytes());

        Byte32::new(id)
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct CommittedSubDag<S> {
    pub index: u64,
    pub chunks: Vec<TransactionChunk<S>>,
    pub leader_propose: TransactionChunk<S>,
}

impl<S> CommittedSubDag<S> {
    pub fn new(
        chunks: Vec<TransactionChunk<S>>,
        leader_propose: TransactionChunk<S>,
        index: u64,
    ) -> Self {
        Self {
            index,
            leader_propose,
            chunks,
        }
    }
}

#[derive(Constructor, Clone, Display, Debug)]
#[display("block number {}, origin {}", block_number, origin)]
pub struct Vertex {
    pub block_number: BlockNumber,
    pub origin: Address,
}

#[derive(Clone, Debug, Error)]
pub enum DagError {
    #[error("Cannot find vertex {0}")]
    CannotFindVertex(Vertex),

    #[error("Duplicate proposal at block number {0} by {1}")]
    DuplicateProposal(BlockNumber, Address),

    #[error("Duplicate transactions: {0:?}")]
    DuplicateTransactions(Vec<H256>),
}
