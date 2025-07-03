use std::collections::{BTreeMap, HashSet};
use std::sync::atomic::{AtomicU64, Ordering};

use dashmap::DashMap;
use derive_more::Display;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use thiserror::Error;

use mirax_codec::{Bcs, BinaryCodec};
use mirax_types::{Address, BitVec, BlockNumber, Bytes, Certificate, TransactionBatch, H256};

use crate::types::{NarwhalResult, Vote};

/// The Narwhal collection data structure.
pub struct NarwhalCollection<S> {
    inner: InnerCollection<S>,
}

impl<S> NarwhalCollection<S>
where
    S: Serialize + DeserializeOwned + Send + Sync + Clone,
{
    /// Create a new Narwhal collection.
    pub fn new(inner: InnerCollection<S>) -> Self {
        Self { inner }
    }

    pub fn as_bytes(&self) -> Bytes {
        Bcs::encode(&self.inner).unwrap()
    }

    /// Create a new block number layer of collection.
    pub fn new_block_number(
        &self,
        block_number: BlockNumber,
        threshold: usize,
        tx_batch: TransactionBatch,
    ) {
        let mut layer = BlockNumberLayerCollection::new(block_number, threshold);
        layer.set_transaction_batch(tx_batch);

        self.inner.data.entry(block_number).or_insert_with(|| layer);
    }

    /// Prune the collection until the last gc number.
    pub fn prune(&self, last_gc_number: BlockNumber) {
        self.inner.data.retain(|k, _| *k >= last_gc_number);
        self.inner
            .last_gc_number
            .swap(last_gc_number, Ordering::Release);
    }

    /// Set the transaction batch into the collection.
    pub fn set_transaction_batch(
        &self,
        block_number: BlockNumber,
        threshold: usize,
        tx_batch: TransactionBatch,
    ) -> NarwhalResult<()> {
        self.check_block_number_outdated(&block_number, CollectionType::TransactionBatch)?;

        log::debug!("[Narwhal] Set transaction batch of block {}", block_number);

        self.inner
            .data
            .entry(block_number)
            .or_insert_with(|| BlockNumberLayerCollection::new(block_number, threshold))
            .set_transaction_batch(tx_batch);
        Ok(())
    }

    /// Insert votes into the collection.
    pub async fn insert_votes_and_certificate(
        &self,
        block_number: BlockNumber,
        threshold: usize,
        tx_batch: TransactionBatch,
        votes: (Vec<Vote<S>>, BitVec),
    ) -> NarwhalResult<Certificate<S>> {
        self.check_block_number_outdated(&block_number, CollectionType::Vote)?;

        log::debug!("[Narwhal] Insert votes of block {}", block_number);

        if !self.inner.data.contains_key(&block_number) {
            self.new_block_number(block_number, threshold, tx_batch);
        }

        let mut layer = self.inner.data.get_mut(&block_number).unwrap();
        let cert = layer.insert_votes(votes).await?;
        layer.insert_certificate(cert.clone());

        Ok(cert)
    }

    pub fn set_broadcast_certificate(&self, block_number: BlockNumber) {
        log::debug!(
            "[Narwhal] Set broadcast certificate of block {}",
            block_number
        );

        self.inner
            .data
            .entry(block_number)
            .or_insert_with(|| BlockNumberLayerCollection::new(block_number, 0))
            .votes
            .is_broadcast_certificate = true;
    }

    /// Insert a certificate into the collection.
    pub fn insert_certificate(
        &self,
        threshold: usize,
        certificate: Certificate<S>,
    ) -> NarwhalResult<()> {
        let block_number = certificate.number;
        self.check_block_number_outdated(&block_number, CollectionType::Certificate)?;

        log::debug!(
            "[Narwhal] Insert certificate of block {} hash {}",
            block_number,
            certificate.previous_tx_batch_hash
        );

        self.inner
            .data
            .entry(block_number)
            .or_insert_with(|| BlockNumberLayerCollection::new(block_number, threshold))
            .insert_certificate(certificate);
        Ok(())
    }

    pub fn pack_certificates(
        &self,
        block_number: BlockNumber,
        threshold: usize,
    ) -> NarwhalResult<Option<Vec<Certificate<S>>>> {
        self.check_block_number_outdated(&block_number, CollectionType::Certificate)?;

        if block_number == 0 {
            return Ok(Some(vec![]));
        }

        Ok(self
            .inner
            .data
            .entry(block_number)
            .or_insert_with(|| BlockNumberLayerCollection::new(block_number, threshold))
            .pack_certificates())
    }

    pub fn is_certificates_above_threshold(
        &self,
        block_number: &BlockNumber,
    ) -> NarwhalResult<bool> {
        self.check_block_number_outdated(block_number, CollectionType::Certificate)?;

        if block_number == &0 {
            return Ok(true);
        }

        Ok(self
            .inner
            .data
            .get(block_number)
            .map(|l| l.certificates.is_above_threshold())
            .unwrap_or_default())
    }

    pub fn certificates_len(&self, block_number: &BlockNumber) -> usize {
        self.inner
            .data
            .get(block_number)
            .map(|layer| layer.certificates.len())
            .unwrap_or_default()
    }

    pub fn used_contains(&self, block_number: &BlockNumber, cert_hash: &H256) -> bool {
        self.inner
            .data
            .get(block_number)
            .map(|layer| layer.certificates.used_contains(cert_hash))
            .unwrap_or(false)
    }

    fn check_block_number_outdated(
        &self,
        block_number: &BlockNumber,
        type_: CollectionType,
    ) -> NarwhalResult<()> {
        let last_gc_number = self.inner.last_gc_number.load(Ordering::Acquire);
        if block_number < &last_gc_number {
            return Err(CollectionError::Outdated {
                type_,
                current: last_gc_number,
                actual: *block_number,
            }
            .into());
        }

        Ok(())
    }
}

#[derive(Serialize, Deserialize, Default)]
pub struct InnerCollection<S> {
    last_gc_number: AtomicU64,
    data: DashMap<BlockNumber, BlockNumberLayerCollection<S>>,
}

impl<S> InnerCollection<S> {
    pub fn with_last_gc_number(last_gc_number: BlockNumber) -> Self {
        Self {
            last_gc_number: AtomicU64::new(last_gc_number),
            data: DashMap::new(),
        }
    }
}

#[derive(Serialize, Deserialize)]
struct BlockNumberLayerCollection<S> {
    block_number: BlockNumber,
    threshold: usize,
    votes: BlockNumberVoteCollection<S>,
    certificates: BlockNumberCertificateCollection<S>,
}

impl<S: Serialize + DeserializeOwned + Send + Sync + Clone> BlockNumberLayerCollection<S> {
    fn new(block_number: BlockNumber, threshold: usize) -> Self {
        Self {
            block_number,
            threshold,
            votes: BlockNumberVoteCollection::new(block_number, threshold),
            certificates: BlockNumberCertificateCollection::new(block_number, threshold),
        }
    }

    fn set_transaction_batch(&mut self, tx_batch: TransactionBatch) {
        self.votes.tx_batch = Some(tx_batch);
    }

    fn insert_certificate(&mut self, certificate: Certificate<S>) {
        self.certificates.insert(certificate);
    }

    async fn insert_votes(
        &mut self,
        votes: (Vec<Vote<S>>, BitVec),
    ) -> NarwhalResult<Certificate<S>> {
        self.votes.insert_batch(votes).await
    }

    fn pack_certificates(&mut self) -> Option<Vec<Certificate<S>>> {
        self.certificates.pack()
    }
}

#[derive(Serialize, Deserialize)]
struct BlockNumberCertificateCollection<S> {
    block_number: BlockNumber,
    certificates: Vec<Certificate<S>>,
    threshold: usize,
    used: HashSet<H256>,
}

impl<S: Serialize + DeserializeOwned + Clone> BlockNumberCertificateCollection<S> {
    fn new(block_number: BlockNumber, threshold: usize) -> Self {
        Self {
            block_number,
            threshold,
            certificates: Vec::new(),
            used: HashSet::new(),
        }
    }

    fn insert(&mut self, certificate: Certificate<S>) {
        self.certificates.push(certificate);
    }

    fn is_above_threshold(&self) -> bool {
        self.certificates.len() >= self.threshold
    }

    fn len(&self) -> usize {
        self.certificates.len()
    }

    fn pack(&mut self) -> Option<Vec<Certificate<S>>> {
        if self.certificates.len() < self.threshold {
            log::warn!(
                "[Narwhal] Block {} certificates length {} is less than threshold {}",
                self.block_number,
                self.certificates.len(),
                self.threshold
            );
            return None;
        }

        let mut certs = Vec::with_capacity(self.certificates.len());
        for cert in self.certificates.iter() {
            let cert_hash = cert.calc_hash();
            if self.used.contains(&cert_hash) {
                continue;
            }

            self.used.insert(cert_hash);
            certs.push(cert.to_owned());
        }

        Some(certs)
    }

    fn used_contains(&self, hash: &H256) -> bool {
        self.used.contains(hash)
    }
}

#[derive(Serialize, Deserialize)]
struct BlockNumberVoteCollection<S> {
    block_number: BlockNumber,
    tx_batch: Option<TransactionBatch>,
    votes: BTreeMap<Address, Vote<S>>,
    threshold: usize,
    is_broadcast_certificate: bool,
}

impl<S: Serialize + DeserializeOwned + Send + Sync + Clone> BlockNumberVoteCollection<S> {
    fn new(block_number: BlockNumber, threshold: usize) -> Self {
        Self {
            block_number,
            tx_batch: None,
            votes: BTreeMap::new(),
            threshold,
            is_broadcast_certificate: false,
        }
    }

    async fn insert_batch(
        &mut self,
        votes: (Vec<Vote<S>>, BitVec),
    ) -> NarwhalResult<Certificate<S>> {
        debug_assert!(
            votes.0.len() >= self.threshold,
            "Votes length is less than threshold"
        );

        let bitmap = votes.1;
        let votes = votes.0;
        let mut sigs = Vec::with_capacity(votes.len());

        for vote in votes.iter() {
            sigs.push(vote.signature.clone());
            self.votes.entry(vote.author).or_insert(vote.to_owned());
        }

        let cert = Certificate {
            number: self.block_number,
            previous_tx_batch_hash: self.tx_batch.as_ref().unwrap().hash(),
            signatures: sigs,
            signer_bitmap: bitmap,
        };

        Ok(cert)
    }
}

#[derive(Clone, Debug, Display)]
pub enum CollectionType {
    Certificate,
    TransactionBatch,
    Vote,
}

#[derive(Clone, Debug, Error)]
pub enum CollectionError {
    #[error("The {type_} number {actual} is outdated, current block number {current}")]
    Outdated {
        type_: CollectionType,
        current: BlockNumber,
        actual: BlockNumber,
    },
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_btree_order() {
        let mut addresses = [
            Address::random(),
            Address::random(),
            Address::random(),
            Address::random(),
            Address::random(),
            Address::random(),
        ];
        addresses.sort_unstable();

        let tree_map = addresses
            .iter()
            .map(|addr| (*addr, 0))
            .collect::<BTreeMap<_, _>>();
        tree_map
            .keys()
            .zip(addresses.iter())
            .for_each(|(addr_0, addr_1)| {
                assert_eq!(addr_0, addr_1);
            });
    }
}
