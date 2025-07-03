use std::cmp::Ordering;
use std::collections::HashSet;

use bit_vec::BitVec;
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use mirax_crypto::ed25519::{Ed25519BatchVerify, Ed25519PublicKey, Ed25519Signature};
use mirax_crypto::{BatchVerify, Signature};

use crate::error::TypesError;
use crate::{mirax_hash_bcs, Address, MiraxResult, WrappedTransaction, H256};

pub type Epoch = u64;

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct TransactionBatch {
    pub block_number: u64,
    pub transactions: Vec<WrappedTransaction>,
    pub origin: Address,
    hash: H256,
}

impl TransactionBatch {
    /// Create a new transaction batch with the given block number, transactions and origin.
    pub fn new(block_number: u64, transactions: Vec<WrappedTransaction>, origin: Address) -> Self {
        let mut ret = Self {
            block_number,
            transactions,
            origin,
            hash: H256::default(),
        };
        ret.hash = mirax_hash_bcs(&ret).unwrap();
        ret
    }

    /// Get the hash of this transaction batch.
    pub fn hash(&self) -> H256 {
        self.hash
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Certificate<S> {
    pub number: u64,
    pub previous_tx_batch_hash: H256,
    pub signatures: Vec<S>,
    pub signer_bitmap: BitVec,
}

impl<S> Certificate<S> {
    pub fn check_signature_count(&self) -> MiraxResult<()> {
        let signature_len = self.signatures.len();
        let bitmap_count = self.signer_bitmap.iter().filter(|b| *b).count();
        if signature_len != bitmap_count {
            return Err(TypesError::CertificateSignatureCountMismatch(
                self.signatures.len(),
                bitmap_count,
            )
            .into());
        }

        Ok(())
    }
}

impl<S: Serialize + DeserializeOwned> Certificate<S> {
    pub fn calc_hash(&self) -> H256 {
        mirax_hash_bcs(self).unwrap()
    }
}

impl Certificate<Ed25519Signature> {
    /// Verify the certificate with the given public keys.
    pub fn verify(&self, public_keys: &[Ed25519PublicKey]) -> MiraxResult<()> {
        Ed25519BatchVerify::verify(&self.previous_tx_batch_hash, &self.signatures, public_keys)
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct TransactionChunk<S> {
    pub transaction_batch: TransactionBatch,
    pub certificates: Vec<Certificate<S>>,
    hash: H256,
}

impl<S: Serialize + DeserializeOwned> TransactionChunk<S> {
    pub fn new(transaction_batch: TransactionBatch, certificates: Vec<Certificate<S>>) -> Self {
        let mut ret = Self {
            transaction_batch,
            certificates,
            hash: H256::default(),
        };
        ret.hash = mirax_hash_bcs(&ret).unwrap();
        ret
    }
}

impl<S> TransactionChunk<S> {
    pub fn hash(&self) -> H256 {
        self.hash
    }

    pub fn block_number(&self) -> u64 {
        self.transaction_batch.block_number
    }

    pub fn origin(&self) -> Address {
        self.transaction_batch.origin
    }

    pub fn parents(&self) -> HashSet<H256> {
        self.certificates
            .iter()
            .map(|cert| cert.previous_tx_batch_hash)
            .collect()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Committee {
    pub validators: Vec<Validator>,
    epoch: Epoch,
    threshold: u16,
}

impl Committee {
    /// Create a new committee with the given validators.
    pub fn new(validators: Vec<Validator>) -> Self {
        let mut validators = validators;
        validators.sort_unstable();

        Self {
            epoch: 0,
            threshold: (validators.len() * 2 / 3 + 1) as u16,
            validators,
        }
    }

    /// Set the epoch of this committee.
    pub fn set_epoch(self, epoch: Epoch) -> Self {
        Self { epoch, ..self }
    }

    /// Get the epoch of this committee.
    pub fn epoch(&self) -> Epoch {
        self.epoch
    }

    /// Get the bitmap correspond validators.
    pub fn get_by_bitmap<'a>(&'a self, bitmap: &'a BitVec) -> impl Iterator<Item = &'a Validator> {
        debug_assert!(bitmap.len() == self.validators.len());

        self.validators
            .iter()
            .zip(bitmap.iter())
            .filter_map(|(v, flag)| flag.then_some(v))
    }

    /// Check if the given bitmap is above the threshold.
    pub fn is_above_threshold(&self, bitmap: &BitVec) -> bool {
        self.get_by_bitmap(bitmap)
            .map(|v| v.stake_ratio as u16)
            .sum::<u16>()
            >= self.threshold
    }

    pub fn threshold(&self) -> usize {
        self.threshold as usize
    }

    /// Get the number of validators in this committee.
    pub fn len(&self) -> usize {
        self.validators.len()
    }

    /// Whether the committee is empty or not.
    pub fn is_empty(&self) -> bool {
        self.validators.is_empty()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Validator {
    public_key: Ed25519PublicKey,
    // The stake ratio is always 1 for now.
    #[serde(skip, default = "default_stake_ratio")]
    stake_ratio: u8,
}

fn default_stake_ratio() -> u8 {
    1
}

impl PartialOrd for Validator {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Validator {
    fn cmp(&self, other: &Self) -> Ordering {
        self.public_key.cmp(&other.public_key)
    }
}

impl Validator {
    /// Create a new validator with the given raw public key.
    pub fn new(raw_key: &[u8]) -> MiraxResult<Self> {
        let public_key = Ed25519PublicKey::try_from(raw_key)?;

        Ok(Validator {
            public_key,
            stake_ratio: 1,
        })
    }

    /// Verify a signature with the public key of this validator.
    pub fn verify_signature(&self, msg: &H256, signature: &Ed25519Signature) -> MiraxResult<()> {
        signature.verify(msg, &self.public_key)
    }

    /// Get the public key of this validator.
    pub fn public_key(&self) -> Ed25519PublicKey {
        self.public_key.clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mirax_crypto::ed25519::Ed25519PrivateKey;
    use mirax_crypto::{PrivateKey as _, PublicKey as _};

    struct Node {
        private_key: Ed25519PrivateKey,
        public_key: Ed25519PublicKey,
    }

    impl Node {
        fn new() -> Self {
            let mut rng = rand::thread_rng();
            let sk = Ed25519PrivateKey::generate(&mut rng);
            Node {
                public_key: sk.public_key(),
                private_key: sk,
            }
        }
    }

    #[test]
    fn test_validator() {
        let node = Node::new();
        let validator = Validator::new(node.public_key.as_bytes().as_ref()).unwrap();
        let msg = H256::random();
        let sig = node.private_key.sign(&msg);

        assert!(validator.verify_signature(&msg, &sig).is_ok());
    }

    #[test]
    fn test_committee() {
        assert!(Committee::new(vec![]).is_empty());

        let mut nodes = (0..4).map(|_| Node::new()).collect::<Vec<_>>();
        let committee = Committee::new(
            nodes
                .iter()
                .map(|node| Validator::new(node.public_key.as_bytes().as_ref()).unwrap())
                .collect(),
        );
        nodes.sort_by(|l, r| l.public_key.cmp(&r.public_key));

        nodes
            .iter()
            .zip(committee.validators.iter())
            .for_each(|(node, validator)| {
                assert_eq!(node.public_key, validator.public_key);
            });

        let committee = committee.set_epoch(1);
        assert_eq!(committee.epoch(), 1);

        let mut bitmap = BitVec::from_elem(4, true);
        bitmap.set(0, false);

        assert!(committee.is_above_threshold(&bitmap));
        committee
            .get_by_bitmap(&bitmap)
            .zip(nodes.iter().skip(1))
            .for_each(|(v, n)| {
                assert_eq!(v.public_key, n.public_key);
            });

        bitmap.set(1, false);
        assert!(!committee.is_above_threshold(&bitmap));
        committee
            .get_by_bitmap(&bitmap)
            .zip(nodes.iter().skip(2))
            .for_each(|(v, n)| {
                assert_eq!(v.public_key, n.public_key);
            });

        assert_eq!(committee.len(), 4);
        assert!(!committee.is_empty());
    }
}
