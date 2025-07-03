use std::sync::Arc;

use futures::future::try_join_all;
use serde::{Deserialize, Serialize};
use smol_str::SmolStr;

use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusStorage, ConsensusTransactionProcess, ConsensusValidatorManage,
};
use mirax_network::traits::{MessageHandler, MessageKind};
use mirax_types::{Address, MiraxResult, H256};

use crate::{
    handler::ConsensusHandler,
    message::{certificate::check_certificate, TransactionChunkMessage},
    state::ConsensusState,
    try_trait_err,
    types::Vote,
};

pub struct TransactionChunkHandler<C: ConsensusCrypto, V, S, T> {
    crypto: Arc<C>,
    validator_manage: Arc<V>,
    storage: Arc<S>,
    tx_process: Arc<T>,
    state: ConsensusState,
    handler: ConsensusHandler<C::Sig>,
    address: Address,
}

impl<C, V, S, T> MessageHandler for TransactionChunkHandler<C, V, S, T>
where
    C: ConsensusCrypto + Sync + Send + 'static,
    V: ConsensusValidatorManage + Sync + Send,
    S: ConsensusStorage + Sync + Send,
    T: ConsensusTransactionProcess + Sync + Send,
{
    type Message = TransactionChunkMessage<C::Sig>;
    type Response = Result<Vote<C::Sig>, HandleTxChunkError>;

    fn kind() -> MessageKind {
        MessageKind::RequestResponse
    }

    async fn handle(&self, msg: Self::Message) -> MiraxResult<Self::Response> {
        let block_number = msg.inner().block_number();
        let chunk_hash = msg.inner().hash();
        let origin = msg.inner().origin();
        if block_number <= self.state.latest_commit_number() {
            return Ok(Err(HandleTxChunkError::Outdated(
                self.state.latest_gc_number(),
            )));
        }

        // Check if the validator has proposed.
        if try_trait_err!(
            self.storage
                .check_chunk_exist(&block_number, &msg.inner().origin())
                .await
        ) {
            return Ok(Err(HandleTxChunkError::DuplicateProposal(origin)));
        }

        // Check if transactions contains in others transaction chunks.
        let tx_hashes = msg
            .inner()
            .transaction_batch
            .transactions
            .iter()
            .map(|tx| tx.hash)
            .collect::<Vec<_>>();
        let res = try_trait_err!(self.storage.check_transactions_exist(&tx_hashes).await);
        if !res.is_empty() {
            return Ok(Err(HandleTxChunkError::DuplicateTxs(res)));
        }

        // Verify the transactions.
        let res = try_trait_err!(
            self.tx_process
                .verify_transactions(msg.inner().transaction_batch.transactions.clone(),)
                .await
        );
        let failures = tx_hashes
            .iter()
            .zip(res.iter())
            .filter_map(|(hash, r)| (!r.is_success()).then_some(*hash))
            .collect::<Vec<_>>();
        if !failures.is_empty() {
            return Ok(Err(HandleTxChunkError::VerifyFailed(failures)));
        }

        // Verify the certificates attached in the transaction chunk.
        let futs = msg
            .inner()
            .certificates
            .iter()
            .map(|cert| check_certificate(&self.crypto, &self.validator_manage, cert))
            .collect::<Vec<_>>();
        if let Err(e) = try_join_all(futs).await {
            return Ok(Err(HandleTxChunkError::InvalidCertificate(
                e.to_string().into(),
            )));
        }

        // Vote for the transaction chunk.
        let vote = Vote {
            signature: self.crypto.sign(&chunk_hash),
            tx_chunk_hash: chunk_hash,
            tx_chunk_number: block_number,
            author: self.address,
        };

        self.handler.receive_transaction_chunk(msg.0).await?;

        Ok(Ok(vote))
    }
}

impl<C: ConsensusCrypto, V, S, T> TransactionChunkHandler<C, V, S, T> {
    pub fn new(
        crypto: Arc<C>,
        validator_manage: Arc<V>,
        storage: Arc<S>,
        tx_process: Arc<T>,
        state: ConsensusState,
        handler: ConsensusHandler<C::Sig>,
        address: Address,
    ) -> Self {
        Self {
            crypto,
            validator_manage,
            storage,
            tx_process,
            state,
            handler,
            address,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum HandleTxChunkError {
    Outdated(u64),
    DuplicateProposal(Address),
    DuplicateTxs(Vec<H256>),
    VerifyFailed(Vec<H256>),
    InvalidCertificate(SmolStr),
}
