use std::collections::HashMap;
use std::sync::Arc;

use flume::{Receiver, Sender};

use mirax_codec::{Bcs, BinaryCodec};
use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage,
};
use mirax_types::{Address, TransactionChunk, GENESIS_NUMBER};

use crate::{
    bullshark::{mediator::ConsensusMediator, ProposeTimer},
    collections::{InnerCollection, NarwhalCollection},
    constants::{MAX_PROPOSE_INTERVAL, MIN_PROPOSE_INTERVAL},
    dag::Dag,
    handler::ConsensusHandler,
    state::ConsensusState,
    BullsharkConsensus,
};

pub struct BullsharkBuilder<S, C: ConsensusCrypto> {
    pub storage: Arc<S>,
    pub state: ConsensusState,
    pub collection: Arc<NarwhalCollection<C::Sig>>,
    pub tx: Sender<TransactionChunk<C::Sig>>,
    pub rx: Receiver<TransactionChunk<C::Sig>>,
}

impl<S, C> BullsharkBuilder<S, C>
where
    S: ConsensusStorage + Send + Sync + 'static,
    C: ConsensusCrypto + Send + Sync + 'static,
{
    pub async fn new(storage: Arc<S>) -> Self {
        let state = if let Ok(Some(raw)) = storage.get_state_data().await {
            Bcs::decode(&raw).unwrap()
        } else {
            ConsensusState::init(GENESIS_NUMBER, GENESIS_NUMBER, GENESIS_NUMBER)
        };

        let collection = Arc::new(NarwhalCollection::new(
            InnerCollection::with_last_gc_number(state.latest_gc_number()),
        ));
        let (tx, rx) = flume::unbounded();

        BullsharkBuilder {
            storage,
            state,
            collection,
            tx,
            rx,
        }
    }

    pub fn handler(&self) -> ConsensusHandler<C::Sig> {
        ConsensusHandler::new(self.tx.clone())
    }

    pub fn build<G, T, V>(
        self,
        crypto: Arc<C>,
        network: Arc<G>,
        tx_process: Arc<T>,
        validator: Arc<V>,
        gc_depth: u64,
        address: Address,
    ) -> BullsharkConsensus<C, G, S, T, V>
    where
        G: ConsensusGossip + Send + Sync + 'static,
        T: ConsensusTransactionProcess + Send + Sync + 'static,
        V: ConsensusValidatorManage + Send + Sync + 'static,
    {
        BullsharkConsensus {
            state: self.state,
            collection: self.collection,
            dag: Arc::new(Dag::new(
                validator.validator_count(),
                Arc::clone(&self.storage),
            )),
            committed_dag: None,
            last_committed: HashMap::new(),
            gc_depth,
            propose_timer: ProposeTimer::new(MAX_PROPOSE_INTERVAL, MIN_PROPOSE_INTERVAL),
            address,
            inner_tx: self.tx,
            inner_rx: self.rx,
            mediator: Arc::new(ConsensusMediator::new(
                crypto,
                network,
                self.storage,
                tx_process,
                validator,
                address,
            )),
        }
    }
}
