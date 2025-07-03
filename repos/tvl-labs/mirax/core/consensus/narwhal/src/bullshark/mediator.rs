use std::sync::Arc;

use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage, PackageConfig,
};
use mirax_types::{Address, BlockNumber, TransactionBatch};

use crate::{bullshark::BullsharkError, types::NarwhalResult};

#[derive(Clone)]
pub struct ConsensusMediator<C, G, S, T, V> {
    pub crypto: Arc<C>,
    pub network: Arc<G>,
    pub storage: Arc<S>,
    pub tx_process: Arc<T>,
    pub validator: Arc<V>,

    address: Address,
}

impl<C, G, S, T, V> ConsensusMediator<C, G, S, T, V>
where
    C: ConsensusCrypto + Send + Sync + 'static,
    G: ConsensusGossip + Send + Sync + 'static,
    S: ConsensusStorage + Send + Sync + 'static,
    T: ConsensusTransactionProcess + Send + Sync + 'static,
    V: ConsensusValidatorManage + Send + Sync + 'static,
{
    pub fn new(
        crypto: Arc<C>,
        network: Arc<G>,
        storage: Arc<S>,
        tx_process: Arc<T>,
        validator: Arc<V>,
        address: Address,
    ) -> Self {
        ConsensusMediator {
            crypto,
            network,
            storage,
            tx_process,
            validator,
            address,
        }
    }

    pub async fn package_transaction_batch(
        &self,
        block_number: BlockNumber,
        config: PackageConfig,
    ) -> NarwhalResult<TransactionBatch> {
        let tx_batch = self
            .tx_process
            .package_transactions(config)
            .await
            .map_err(|e| BullsharkError::Traits(e.to_string()))?;
        Ok(TransactionBatch::new(block_number, tx_batch, self.address))
    }

    pub(crate) fn threshold(&self) -> usize {
        self.validator.threshold()
    }
}
