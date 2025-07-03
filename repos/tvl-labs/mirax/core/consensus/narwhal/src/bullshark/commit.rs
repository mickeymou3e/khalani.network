use std::collections::VecDeque;

use mirax_codec::{Bcs, BinaryCodec as _};
use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage,
};
use mirax_types::{BlockNumber, TransactionChunk};

use crate::dag::{CommittedDagState, CommittedSubDag};
use crate::{
    bullshark::BullsharkError, constants::COMMIT_NUMBER_STEP, types::NarwhalResult,
    BullsharkConsensus,
};

impl<C, G, S, T, V> BullsharkConsensus<C, G, S, T, V>
where
    C: ConsensusCrypto + Send + Sync + 'static,
    G: ConsensusGossip + Send + Sync + 'static,
    S: ConsensusStorage + Send + Sync + 'static,
    T: ConsensusTransactionProcess + Send + Sync + 'static,
    V: ConsensusValidatorManage + Send + Sync + 'static,
{
    pub(crate) async fn commit_process(
        &mut self,
        start_number: BlockNumber,
    ) -> NarwhalResult<Vec<CommittedSubDag<C::Sig>>> {
        log::info!(
            "[Narwhal] Start commit process of block {:?}.",
            start_number
        );

        let validator_len = self.validator_len();
        let leader = self.mediator.validator.elect_leader(start_number);
        let tmp = self.dag.get_children_support(&start_number, &leader)?;
        let children_support = tmp.iter().collect::<Vec<_>>();
        if !self
            .mediator
            .validator
            .is_addresses_above_threshold(&children_support)
        {
            return Err(BullsharkError::LeaderLackSupport(children_support.len()).into());
        }

        let leader = self.dag.get_tx_chunk(&start_number, &leader).unwrap();
        let mut committed_sub_dags = Vec::with_capacity(validator_len * 2);
        let mut leaders_to_commit = self.order_past_leader_proposals(&leader);

        log::debug!("[Narwhal] leader to commit {:#?}", leaders_to_commit);

        while let Some(to_commit) = leaders_to_commit.pop_front() {
            let sub_dag_index = self.net_sub_dag_index();
            let mut seq = Vec::with_capacity(validator_len * 2);

            for c in self
                .dag
                .order(&to_commit, self.gc_depth, &self.last_committed)
            {
                self.update_latest_committed(&c);
                seq.push(c.clone());
            }

            let sub_dag = CommittedSubDag::new(seq, leader.clone(), sub_dag_index);
            self.save_committed_dag_state(&sub_dag).await?;
            committed_sub_dags.push(sub_dag);
        }

        log::debug!("[Narwhal] Committed sub dags: {:#?}", committed_sub_dags);

        Ok(committed_sub_dags)
    }

    fn order_past_leader_proposals(
        &self,
        tail: &TransactionChunk<C::Sig>,
    ) -> VecDeque<TransactionChunk<C::Sig>> {
        let mut queue = VecDeque::new();
        queue.push_front(tail.clone());

        let mut tail = tail.clone();
        let (begin, end) = (
            self.state.latest_commit_number() + COMMIT_NUMBER_STEP,
            tail.block_number() - COMMIT_NUMBER_STEP,
        );

        for number in (begin..=end).rev().step_by(2) {
            let leader = self.mediator.validator.elect_leader(number);
            let prev = self.dag.get_tx_chunk(&number, &leader).unwrap();

            if self.dag.is_linked(&prev, &tail) {
                queue.push_front(prev.clone());
                tail = prev.clone();
            }
        }

        queue
    }

    async fn save_committed_dag_state(
        &self,
        committed_dag: &CommittedSubDag<C::Sig>,
    ) -> NarwhalResult<()> {
        let committed_dag =
            CommittedDagState::new(self.last_committed.clone(), committed_dag.clone());
        let key = committed_dag.unique_key();
        let val = Bcs::encode(&committed_dag).unwrap();

        self.mediator
            .storage
            .insert_committed_data(&key, &val)
            .await?;
        Ok(())
    }
}
