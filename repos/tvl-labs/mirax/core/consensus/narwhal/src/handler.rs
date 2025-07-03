use flume::Sender;
use mirax_types::TransactionChunk;

use crate::types::NarwhalResult;

#[derive(Clone)]
pub struct ConsensusHandler<S> {
    inner_tx: Sender<TransactionChunk<S>>,
}

impl<S> ConsensusHandler<S> {
    pub fn new(inner_tx: Sender<TransactionChunk<S>>) -> Self {
        ConsensusHandler { inner_tx }
    }

    pub fn inner_tx(&self) -> Sender<TransactionChunk<S>> {
        self.inner_tx.clone()
    }

    pub async fn receive_transaction_chunk(&self, chunk: TransactionChunk<S>) -> NarwhalResult<()> {
        self.inner_tx.send_async(chunk).await?;
        Ok(())
    }
}
