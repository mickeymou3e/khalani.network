mod consensus;
mod error;
mod handle;

pub use consensus::ConsensusMempool;
pub use handle::MempoolHandle;

use std::collections::{HashSet, VecDeque};
use std::sync::Arc;

use mirax_db::traits::{DBRead, DBStartTransaction};
use mirax_storage::StorageImpl;

use async_lock::Mutex;
use flume::Receiver;

use mirax_crypto::Signature;
use mirax_types::{WrappedTransaction, H256};

pub type ArcTxQueue = Arc<Mutex<TransactionQueue>>;

pub struct QueueService {
    rx: Receiver<WrappedTransaction>,
    queue: Arc<Mutex<TransactionQueue>>,
}

impl QueueService {
    pub fn new<DB, S>(
        verify_ctx: StorageImpl<DB>,
    ) -> (Self, MempoolHandle<DB>, ConsensusMempool<DB, S>)
    where
        DB: DBRead + DBStartTransaction + Clone + Sync + Send + 'static,
        S: Signature,
    {
        let (tx, rx) = flume::unbounded();
        let service = Self {
            rx,
            queue: Arc::new(Mutex::new(TransactionQueue::default())),
        };
        let queue = service.queue();
        let verify_ctx = Arc::new(verify_ctx);

        (
            service,
            MempoolHandle::new(Arc::clone(&verify_ctx), tx),
            ConsensusMempool::new(queue, verify_ctx),
        )
    }

    pub fn queue(&self) -> ArcTxQueue {
        Arc::clone(&self.queue)
    }

    pub async fn run(self) {
        tokio::spawn(async move {
            while let Ok(tx) = self.rx.recv_async().await {
                self.queue.lock().await.insert(tx);
            }
        });
    }
}

#[derive(Default, Debug)]
pub struct TransactionQueue {
    queue: VecDeque<WrappedTransaction>,
    hash_index: HashSet<H256>,
}

impl TransactionQueue {
    pub fn insert(&mut self, tx: WrappedTransaction) {
        if !self.hash_index.contains(&tx.hash) {
            self.hash_index.insert(tx.hash);
            self.queue.push_back(tx)
        }
    }

    pub fn package(&mut self, count: usize) -> Vec<WrappedTransaction> {
        let len = count.min(self.len());
        self.queue
            .drain(..len)
            .inspect(|tx| {
                self.hash_index.remove(&tx.hash);
            })
            .collect()
    }

    fn len(&self) -> usize {
        self.queue.len()
    }
}

#[allow(dead_code)]
#[cfg(test)]
mod tests {
    use super::*;

    use std::time::Duration;

    use mirax_consensus_traits::{ConsensusTransactionProcess, PackageConfig};
    use mirax_crypto::ed25519::Ed25519Signature;
    use mirax_db::mem::MemDatabase;
    use mirax_types::BlockEnvelope;
    use mirax_types::{MiraxResult, Transaction, VerifyResult};
    use mirax_verification::{BlockVerification, TransactionVerification};

    struct MockVerification;

    impl BlockVerification<BlockEnvelope<Ed25519Signature>> for MockVerification {
        fn verify_block(
            &mut self,
            block: &BlockEnvelope<Ed25519Signature>,
        ) -> MiraxResult<Vec<VerifyResult>> {
            Ok(vec![
                VerifyResult::Success(100);
                block.transaction_iter().count()
            ])
        }
    }

    impl TransactionVerification<WrappedTransaction> for MockVerification {
        fn verify_transaction(&self, _tx: &WrappedTransaction) -> MiraxResult<VerifyResult> {
            Ok(VerifyResult::Success(100))
        }

        fn verify_transactions(
            &mut self,
            txs: Vec<WrappedTransaction>,
        ) -> MiraxResult<Vec<VerifyResult>> {
            Ok(vec![VerifyResult::Success(100); txs.len()])
        }
    }

    #[tokio::test]
    async fn test_queue_service() {
        let (service, handle, consensus_mempool) =
            QueueService::new::<_, Ed25519Signature>(StorageImpl::new(MemDatabase::default()));
        let queue = service.queue();
        service.run().await;

        for _ in 0..5 {
            handle.test_insert(Transaction::random(0)).await.unwrap();
        }

        tokio::time::sleep(Duration::from_secs(1)).await;
        assert_eq!(queue.lock_arc_blocking().len(), 5);

        let res = consensus_mempool
            .package_transactions(PackageConfig::new(2, 100))
            .await
            .unwrap();
        assert_eq!(res.len(), 2);

        let res = consensus_mempool
            .package_transactions(PackageConfig::new(5, 100))
            .await
            .unwrap();
        assert_eq!(res.len(), 3);
    }

    #[test]
    fn test_queue() {
        let mut queue = TransactionQueue::default();
        let tx_batch = (0..5)
            .map(|_| {
                let tx = WrappedTransaction::random(0);
                queue.insert(tx.clone());
                tx
            })
            .collect::<Vec<_>>();

        assert_eq!(queue.len(), 5);
        assert_eq!(queue.package(3), tx_batch[0..3]);
        assert_eq!(queue.len(), 2);
        assert_eq!(queue.package(3), tx_batch[3..5]);

        let tx = WrappedTransaction::random(0);
        queue.insert(tx.clone());
        assert_eq!(queue.len(), 1);
        queue.insert(tx);
        assert_eq!(queue.len(), 1);
    }
}
