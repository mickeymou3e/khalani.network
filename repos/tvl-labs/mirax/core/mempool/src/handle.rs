use std::sync::Arc;

use flume::Sender;
use tokio::sync::oneshot;

use mirax_db::traits::{DBRead, DBStartTransaction};
use mirax_storage::StorageImpl;
use mirax_storage_traits::ReadOnlyStorage as _;
use mirax_types::{MiraxResult, Transaction, WrappedTransaction, H256};
use mirax_verification::{AxiVerifierBuilder, TransactionVerification, TransactionVerifierBuilder};

use crate::error::MempoolError;

#[derive(Clone)]
pub struct MempoolHandle<DB: Clone + DBStartTransaction> {
    verify_ctx: Arc<StorageImpl<DB>>,
    tx: Sender<WrappedTransaction>,
}

impl<DB> MempoolHandle<DB>
where
    DB: DBRead + DBStartTransaction + Clone + Sync + Send + 'static,
{
    pub fn new(verify_ctx: Arc<StorageImpl<DB>>, tx: Sender<WrappedTransaction>) -> Self {
        MempoolHandle { verify_ctx, tx }
    }

    pub async fn insert(&self, tx: Transaction) -> MiraxResult<H256> {
        let wrapped_tx = WrappedTransaction::from(tx);
        let verifier = AxiVerifierBuilder::new(Arc::clone(&self.verify_ctx)).build(&wrapped_tx)?;
        let verify_ctx = self.verify_ctx.clone();
        let tx_sender = self.tx.clone();
        let (res_tx, res_rx) = oneshot::channel();

        tokio::spawn(async move {
            let res =
                Self::verify_and_insert_inner(verifier, verify_ctx, tx_sender, &wrapped_tx).await;
            res_tx.send(res).unwrap();
        });

        res_rx.await.unwrap()
    }

    #[cfg(test)]
    pub(crate) async fn test_insert(&self, tx: Transaction) -> MiraxResult<H256> {
        let wrapped_tx = WrappedTransaction::from(tx);
        let tx_sender = self.tx.clone();
        let (res_tx, res_rx) = oneshot::channel();

        tokio::spawn(async move {
            tx_sender.send(wrapped_tx.clone()).unwrap();
            res_tx.send(Ok(wrapped_tx.hash)).unwrap();
        });

        res_rx.await.unwrap()
    }

    async fn verify_and_insert_inner(
        verifier: Box<dyn TransactionVerification<WrappedTransaction> + Send + Sync>,
        verify_ctx: Arc<StorageImpl<DB>>,
        tx_sender: Sender<WrappedTransaction>,
        tx: &WrappedTransaction,
    ) -> MiraxResult<H256> {
        let tx_hash = tx.hash;
        if verify_ctx
            .get_transaction_by_hash(&tx_hash)
            .await?
            .is_some()
        {
            return Err(MempoolError::DuplicateTransaction(tx_hash).into());
        }

        verifier.verify_transaction(tx)?;
        tx_sender.send(tx.clone()).map_err(MempoolError::from)?;

        Ok(tx_hash)
    }
}
