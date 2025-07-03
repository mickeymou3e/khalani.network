mod builder;
mod commit;
mod error;
mod mediator;
mod metrics;
mod propose;
mod utils;

pub use builder::BullsharkBuilder;
pub use error::BullsharkError;

use std::{collections::HashMap, sync::Arc, time::Duration};

use flume::{Receiver, Sender};
use smol_str::format_smolstr;

use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage,
};
use mirax_time::PinnedSleep;
use mirax_types::{Address, BlockEnvelope, BlockNumber, MiraxResult, TransactionChunk};

use crate::dag::{CommittedSubDag, Dag};
use crate::{
    bullshark::mediator::ConsensusMediator, collections::NarwhalCollection, error::NarwhalError,
    state::ConsensusState,
};

pub struct BullsharkConsensus<C: ConsensusCrypto, G, S, T, V> {
    state: ConsensusState,
    collection: Arc<NarwhalCollection<C::Sig>>,
    dag: Arc<Dag<C::Sig, S>>,
    committed_dag: Option<CommittedSubDag<C::Sig>>,
    last_committed: HashMap<Address, BlockNumber>,

    gc_depth: u64,
    propose_timer: ProposeTimer,
    address: Address,

    inner_tx: Sender<TransactionChunk<C::Sig>>,
    inner_rx: Receiver<TransactionChunk<C::Sig>>,

    mediator: Arc<ConsensusMediator<C, G, S, T, V>>,
}

impl<C, G, S, T, V> BullsharkConsensus<C, G, S, T, V>
where
    C: ConsensusCrypto + Send + Sync + 'static,
    G: ConsensusGossip + Send + Sync + 'static,
    S: ConsensusStorage + Send + Sync + 'static,
    T: ConsensusTransactionProcess<Block = BlockEnvelope<C::Sig>> + Send + Sync + 'static,
    V: ConsensusValidatorManage + Send + Sync + 'static,
{
    /// Get the consensus state.
    pub fn state(&self) -> ConsensusState {
        self.state.clone()
    }

    pub fn collection(&self) -> Arc<NarwhalCollection<C::Sig>> {
        Arc::clone(&self.collection)
    }

    pub async fn run(self) {
        tokio::spawn(self.inner_run());
    }

    async fn inner_run(mut self) {
        log::info!(
            "[Narwhal] Bullshark consensus start running from block {}.",
            self.state.block_number()
        );

        loop {
            tokio::select! {
                Ok(msg) = self.inner_rx.recv_async() => {
                    if let Err(e) = self.handle_transaction_chunk(msg).await {
                        log::error!("[Narwhal] Error when handle transaction chunk: {:?}", e);
                    }
                }

                _ = &mut self.propose_timer.max_timer => {
                    if let Err(e) = self.propose_transaction_chunk().await {
                        log::error!("[Narwhal] Error when propose process: {:?}", e);
                    }
                    self.propose_timer.max_timer.reset();
                }
            }
        }
    }

    async fn handle_transaction_chunk(
        &mut self,
        chunk: TransactionChunk<C::Sig>,
    ) -> MiraxResult<()> {
        let block_number = chunk.block_number();

        if block_number <= self.state.latest_gc_number() {
            log::info!("[Narwhal] Received certificate of block {:?} which is outdate, current status {:?}.", block_number, self.state);
            return Ok(());
        }

        log::info!(
            "[Narwhal] Received certificate of block {:?}.",
            block_number
        );

        self.dag.insert_chunk(block_number, chunk.clone()).await?;

        if !self.is_anchor(block_number - 1) {
            return Ok(());
        }

        let leader_block_number = block_number - 1;
        if leader_block_number <= self.state.latest_commit_number() {
            log::info!(
                "[Narwhal] Received leader block {:?} which is outdate, current status {:?}.",
                leader_block_number,
                self.state
            );
            return Ok(());
        }

        log::info!(
            "[Narwhal] Is anchor number {:?}, enter commit process.",
            leader_block_number
        );

        let committed = self.commit_process(leader_block_number).await?;
        let blocks = self.build_blocks(committed).await?;

        for block in blocks.iter() {
            self.mediator
                .tx_process
                .execute(block)
                .map_err(|e| NarwhalError::Traits(format_smolstr!("{:?}", e)))?;

            // Save block header.
            self.mediator
                .storage
                .insert_block(block)
                .await
                .map_err(|e| NarwhalError::Traits(format_smolstr!("{:?}", e)))?;

            // Clean the outdate data.
            self.dag.clean_up(&block.number());
            self.collection.prune(self.state.latest_gc_number());
        }

        Ok(())
    }
}

struct ProposeTimer {
    max_timer: PinnedSleep,
    min_timer: PinnedSleep,
}

impl ProposeTimer {
    pub fn new(max_sleep_duration: Duration, min_sleep_duration: Duration) -> Self {
        Self {
            max_timer: PinnedSleep::new(max_sleep_duration),
            min_timer: PinnedSleep::new(min_sleep_duration),
        }
    }
}
