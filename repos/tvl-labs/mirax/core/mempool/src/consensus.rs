use std::error::Error;
use std::marker::PhantomData;
use std::sync::Arc;

use mirax_consensus_traits::{ConsensusTransactionProcess, PackageConfig};
use mirax_crypto::Signature;
use mirax_db::traits::{DBRead, DBStartTransaction};
use mirax_storage::StorageImpl;
use mirax_types::{BlockEnvelope, TransactionBatch, VerifyResult, WrappedTransaction, H256};
use mirax_verification::{AxiVerifierBuilder, BlockVerifierBuilder, TransactionVerifierBuilder};

use crate::ArcTxQueue;

pub struct ConsensusMempool<DB: Clone + DBStartTransaction, S> {
    tx_queue: ArcTxQueue,
    verify_ctx: Arc<StorageImpl<DB>>,
    pin_s: PhantomData<S>,
}

impl<DB, S> ConsensusTransactionProcess for ConsensusMempool<DB, S>
where
    DB: DBRead + DBStartTransaction + Clone + Sync + Send + 'static,
    S: Signature,
{
    type Block = BlockEnvelope<S>;

    async fn package_transactions(
        &self,
        config: PackageConfig,
    ) -> Result<Vec<WrappedTransaction>, Box<dyn Error + Send>> {
        Ok(self.tx_queue.lock_arc().await.package(config.max_tx_count))
    }

    async fn fetch_transaction_batch(
        &self,
        _tx_batch_hash: &H256,
    ) -> Result<TransactionBatch, Box<dyn Error + Send>> {
        todo!()
    }

    async fn verify_transactions(
        &self,
        txs: Vec<WrappedTransaction>,
    ) -> Result<Vec<VerifyResult>, Box<dyn Error + Send>> {
        let builder = AxiVerifierBuilder::new(Arc::clone(&self.verify_ctx));
        let mut verifier = TransactionVerifierBuilder::build(&builder, &txs[0])?;
        let ret = verifier.verify_transactions(txs)?;

        Ok(ret)
    }

    fn execute(
        &self,
        block: &BlockEnvelope<S>,
    ) -> Result<Vec<VerifyResult>, Box<dyn Error + Send>> {
        let builder = AxiVerifierBuilder::new(Arc::clone(&self.verify_ctx));
        let mut verifier = BlockVerifierBuilder::build(&builder, block)?;
        let ret = verifier.verify_block(block)?;

        Ok(ret)
    }
}

impl<DB, S> ConsensusMempool<DB, S>
where
    DB: DBRead + DBStartTransaction + Clone + Sync + Send + 'static,
    S: Signature,
{
    pub fn new(tx_queue: ArcTxQueue, verify_ctx: Arc<StorageImpl<DB>>) -> Self {
        ConsensusMempool {
            tx_queue,
            verify_ctx,
            pin_s: PhantomData,
        }
    }
}
