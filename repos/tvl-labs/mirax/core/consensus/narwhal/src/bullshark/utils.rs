use std::{cmp::max, collections::BTreeMap, marker::PhantomData};

use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage,
};
use mirax_merkle::binary::BinaryMerkleTree;
use mirax_time::system_time_as_millis;
use mirax_types::{
    BlockEnvelope, BlockNumber, Bytes, Header, Transaction, TransactionChunk,
    DEFAULT_BLOCK_VERSION, H256,
};

use crate::{
    bullshark::BullsharkError, dag::CommittedSubDag, types::NarwhalResult, BullsharkConsensus,
};

impl<C, G, S, T, V> BullsharkConsensus<C, G, S, T, V>
where
    C: ConsensusCrypto + Send + Sync + 'static,
    G: ConsensusGossip + Send + Sync + 'static,
    S: ConsensusStorage + Send + Sync + 'static,
    T: ConsensusTransactionProcess + Send + Sync + 'static,
    V: ConsensusValidatorManage + Send + Sync + 'static,
{
    pub(crate) fn is_anchor(&self, block_number: BlockNumber) -> bool {
        block_number % 2 == 0 && block_number > 0
    }

    pub(crate) fn net_sub_dag_index(&self) -> u64 {
        self.committed_dag
            .as_ref()
            .map(|dag| dag.index)
            .unwrap_or_default()
            + 1
    }

    pub(crate) fn update_latest_committed(&mut self, chunk: &TransactionChunk<C::Sig>) {
        self.last_committed
            .entry(chunk.origin())
            .and_modify(|num| *num = max(*num, chunk.block_number()))
            .or_insert_with(|| chunk.block_number());

        self.state
            .new_latest_commit_number(max(self.state.latest_commit_number(), chunk.block_number()));
        self.state.new_latest_gc_number(
            self.state
                .latest_commit_number()
                .saturating_sub(self.gc_depth),
        );

        self.dag.clean_up(&self.state.latest_gc_number());
    }

    pub(crate) fn validator_len(&self) -> usize {
        self.mediator.validator.validator_count()
    }

    pub(crate) async fn build_blocks(
        &self,
        commits: Vec<CommittedSubDag<C::Sig>>,
    ) -> NarwhalResult<Vec<BlockEnvelope<C::Sig>>> {
        let builder = BlocksBuilderHelper::<C>::from_commits(
            commits,
            self.mediator.validator.validator_count(),
        )?;

        let first_number = builder.first_commit_number();
        let previous_header = self
            .mediator
            .storage
            .get_header_by_number(&(first_number - 1))
            .await?
            .unwrap();

        Ok(builder.build(previous_header.calc_hash()))
    }
}

#[derive(Debug)]
struct BlocksBuilderHelper<C: ConsensusCrypto> {
    buckets: BTreeMap<BlockNumber, Vec<TransactionChunk<C::Sig>>>,
    pin_c: PhantomData<C>,
}

impl<C: ConsensusCrypto> BlocksBuilderHelper<C> {
    fn from_commits(
        commits: Vec<CommittedSubDag<C::Sig>>,
        validator_len: usize,
    ) -> NarwhalResult<Self> {
        debug_assert!(!commits.is_empty());

        let mut buckets = BTreeMap::new();
        let (mut start_number, mut end_number) = (BlockNumber::MAX, BlockNumber::MIN);

        for dag in commits.into_iter() {
            for c in dag.chunks.iter() {
                let c_number = c.block_number();
                if c_number < start_number {
                    start_number = c_number;
                }

                if c_number > end_number {
                    end_number = c_number;
                }

                buckets
                    .entry(c_number)
                    .or_insert_with(|| Vec::with_capacity(validator_len))
                    .push(c.to_owned());
            }
        }

        if buckets.len() as u64 != (end_number + 1 - start_number) {
            let discontinuity = (start_number..=end_number)
                .filter(|n| !buckets.contains_key(n))
                .collect::<Vec<_>>();
            return Err(BullsharkError::DiscontinuityCommit(discontinuity).into());
        }

        log::debug!("[Narwhal] Block buckets {:#?}", buckets);

        Ok(Self {
            buckets,
            pin_c: PhantomData,
        })
    }

    fn first_commit_number(&self) -> BlockNumber {
        self.buckets.first_key_value().map(|(n, _)| *n).unwrap()
    }

    fn build(self, last_ancestor_hash: H256) -> Vec<BlockEnvelope<C::Sig>> {
        let mut parent_hash = last_ancestor_hash;
        let mut blocks = Vec::with_capacity(self.buckets.len());

        for (number, mut commits) in self.buckets.into_iter() {
            commits.sort_by_key(|c| c.hash());

            // Change variable as immutable.
            let chunks = commits;
            let chunk_hashes = chunks.iter().map(|c| c.hash()).collect::<Vec<_>>();
            let tx_hashes = chunks
                .iter()
                .flat_map(|c| c.transaction_batch.transactions.iter().map(|tx| tx.hash))
                .collect::<Vec<_>>();
            let header = Header {
                version: DEFAULT_BLOCK_VERSION,
                block_number: number,
                parent_hash,
                live_cells_root: H256::default(),
                chunks_root: BinaryMerkleTree::build_merkle_root(&chunk_hashes),
                transactions_root: BinaryMerkleTree::build_merkle_root(&tx_hashes),
                timestamp: system_time_as_millis(),
                extra_data: Bytes::new(),
            };

            // Update parent hash.
            parent_hash = header.calc_hash();

            blocks.push(BlockEnvelope {
                header,
                cellbase: Transaction::empty().into(),
                chunks,
            })
        }

        blocks
    }
}

fn adjust_commits<C: ConsensusCrypto>(
    commits: Vec<CommittedSubDag<C::Sig>>,
) -> (Vec<TransactionChunk<C::Sig>>, Vec<H256>, Vec<H256>) {
    let (mut chunks, mut chunk_hashes, mut tx_hashes) = (
        Vec::with_capacity(commits.len()),
        Vec::with_capacity(commits.len()),
        Vec::new(),
    );
    for c in commits.into_iter() {
        for tx in c.leader_propose.transaction_batch.transactions.iter() {
            tx_hashes.push(tx.hash);
        }
        chunk_hashes.push(c.leader_propose.hash());
        chunks.push(c.leader_propose);
    }

    (chunks, chunk_hashes, tx_hashes)
}
