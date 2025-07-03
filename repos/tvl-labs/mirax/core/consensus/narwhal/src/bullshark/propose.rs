use std::sync::Arc;

use flume::{Receiver, Sender};
use futures::{
    future::{select, Either},
    pin_mut,
};
use mirax_codec::{Hex, TextCodec};
use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage, PackageConfig,
};
use mirax_crypto::PublicKey;
use mirax_types::{
    Address, BlockNumber, Certificate, TransactionBatch, TransactionChunk, WrappedTransaction,
};

use crate::{
    bullshark::{mediator::ConsensusMediator, BullsharkError},
    collections::NarwhalCollection,
    message::{CertificateMessage, TransactionChunkMessage},
    types::{NarwhalResult, Vote},
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
    pub(crate) async fn propose_transaction_chunk(&self) -> NarwhalResult<()> {
        let block_number = self.state.block_number();
        let previous_block_number = block_number.saturating_sub(1);

        // Check if the previous certificates are above threshold.
        if !self.is_certificates_above_threshold(&previous_block_number)? {
            return Err(BullsharkError::LackPreviousCertificates(
                previous_block_number,
                self.collection.certificates_len(&previous_block_number),
                self.mediator.threshold(),
            )
            .into());
        }

        // Goto next block number. Swap the block number as the next block number.
        let block_number = block_number + 1;
        self.state.new_block_number(block_number);

        log::info!(
            "[Narwhal] Propose transaction chunk for block: {}",
            block_number
        );

        let mediator = Arc::clone(&self.mediator);
        let address = self.address;
        let collection = Arc::clone(&self.collection);
        let tx = self.inner_tx.clone();

        tokio::spawn(async move {
            if let Err(e) = propose_tx_batch(mediator, block_number, address, collection, tx).await
            {
                log::error!("[Narwhal] Propose transaction batch failed: {:?}", e);
            }
        });

        Ok(())
    }

    fn is_certificates_above_threshold(&self, block_number: &BlockNumber) -> NarwhalResult<bool> {
        if *block_number == 0 {
            return Ok(true);
        }

        self.collection
            .is_certificates_above_threshold(block_number)
    }
}

async fn propose_tx_batch<C, G, S, T, V>(
    mediator: Arc<ConsensusMediator<C, G, S, T, V>>,
    block_number: BlockNumber,
    self_address: Address,
    collection: Arc<NarwhalCollection<C::Sig>>,
    inner_tx: Sender<TransactionChunk<C::Sig>>,
) -> NarwhalResult<()>
where
    C: ConsensusCrypto + Send + Sync + 'static,
    G: ConsensusGossip + Send + Sync + 'static,
    S: ConsensusStorage + Send + Sync + 'static,
    T: ConsensusTransactionProcess + Send + Sync + 'static,
    V: ConsensusValidatorManage + Send + Sync + 'static,
{
    // Prepare transaction batch.
    let threshold = mediator.threshold();
    let tx_batch = mediator
        .tx_process
        .package_transactions(PackageConfig::new(100, 5000))
        .await
        .map_err(|e| BullsharkError::Traits(e.to_string()))?;
    let certificates = collection
        .pack_certificates(block_number - 1, threshold)?
        .unwrap();
    let msg =
        build_transaction_chunk_message::<C>(block_number, certificates, tx_batch, self_address);

    inner_tx.send_async(msg.0.clone()).await?;

    // Persistence before update memory.
    let peers = mediator.crypto.get_all_others_public_keys();
    let peers_len = peers.len();
    let is_multi_nodes = !peers.is_empty();

    // Add self vote.
    log::debug!("[Narwhal] Vote for self proposal {}.", block_number);
    let mut votes = Vec::with_capacity(threshold);
    votes.push(Vote {
        tx_chunk_hash: msg.inner().hash(),
        tx_chunk_number: msg.inner().block_number(),
        author: self_address,
        signature: mediator.crypto.sign(&msg.inner().hash()),
    });

    // At least two nodes. so a certificate needs at least another vote.
    if is_multi_nodes {
        let (result_tx, result_rx) = flume::bounded(peers_len);
        let (stop_tx, stop_rx) = flume::bounded(1);

        // RPC call other validators to response votes.
        for peer in peers.iter() {
            log::debug!(
                "[Narwhal] Call {:?} for vote.",
                Hex::encode(peer.as_bytes())
            );

            call_for_vote(
                Arc::clone(&mediator.network),
                Arc::clone(&mediator.crypto),
                peer.clone(),
                msg.clone(),
                result_tx.clone(),
                stop_rx.clone(),
            )
            .await;
        }

        let threshold = mediator.validator.threshold();
        if votes.len() < threshold {
            while let Ok(v) = result_rx.recv_async().await {
                votes.push(v);

                // If vote count meet threshold, stop the spawn tasks.
                if votes.len() >= threshold {
                    let _ = stop_tx.send(());
                    break;
                }
            }
        }
    }

    // Build certificate.
    let mut addresses = Vec::with_capacity(votes.len());
    for v in votes.iter() {
        addresses.push(&v.author);
    }
    let bitmap = mediator
        .validator
        .generate_signed_bitmap(addresses.into_iter());
    let cert = collection
        .insert_votes_and_certificate(
            block_number,
            threshold,
            msg.inner().transaction_batch.clone(),
            (votes.clone(), bitmap.clone()),
        )
        .await?;

    if is_multi_nodes {
        // Broadcast certificate.
        mediator
            .network
            .broadcast(CertificateMessage(cert.clone()))
            .await?;
    }

    collection.set_broadcast_certificate(block_number);
    Ok(())
}

fn build_transaction_chunk_message<C: ConsensusCrypto>(
    block_number: BlockNumber,
    certificates: Vec<Certificate<C::Sig>>,
    tx_batch: Vec<WrappedTransaction>,
    address: Address,
) -> TransactionChunkMessage<C::Sig> {
    let batch = TransactionBatch::new(block_number, tx_batch, address);
    TransactionChunkMessage(TransactionChunk::new(batch, certificates))
}

async fn call_for_vote<G, C>(
    net: Arc<G>,
    crypto: Arc<C>,
    peer_id: C::Pk,
    msg: TransactionChunkMessage<C::Sig>,
    result_tx: Sender<Vote<C::Sig>>,
    stop_rx: Receiver<()>,
) where
    G: ConsensusGossip + Send + Sync + 'static,
    C: ConsensusCrypto + Send + Sync + 'static,
{
    tokio::spawn(async move {
        let hash = msg.inner().hash();
        let fut = net.call::<_, _, Vote<C::Sig>>(&peer_id, msg);
        let stop = stop_rx.recv_async();
        pin_mut!(fut, stop);

        match select(fut, stop).await {
            Either::Left((r, _)) => {
                if let Ok(vote) = r {
                    // Verify signature before postback response vote.
                    if let Some(pk) = crypto.get_public_key(&vote.author) {
                        if crypto.verify(&hash, &pk, &vote.signature).is_ok() {
                            let _ = result_tx.send(vote);
                        }
                    }
                }
            }
            Either::Right((_signal, _)) => (),
        }
    });
}
