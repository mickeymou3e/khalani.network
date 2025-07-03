use std::error::Error;
use std::fmt::{Debug, Formatter, Result as FmtResult};

use multi_index_map::MultiIndexMap;

use mirax_consensus_traits::{ConsensusCrypto, ConsensusValidatorManage};
use mirax_crypto::ed25519::{Ed25519BatchVerify, Ed25519PublicKey, Ed25519Signature};
use mirax_crypto::{BatchVerify, Signature};
use mirax_signer::Ed25519Signer;
use mirax_types::{Address, BitVec, BlockNumber, Committee, Validator, H256};

/// The implementation of the `ConsensusCrypto` trait.
pub struct ConsensusCryptoImpl {
    committee: WrappedCommittee,
    signer: Ed25519Signer,
    self_pub_key: Ed25519PublicKey,
}

impl ConsensusCryptoImpl {
    pub fn new(validators: Vec<Validator>, signer: Ed25519Signer) -> Self {
        Self {
            committee: Committee::new(validators).into(),
            self_pub_key: signer.public_key(),
            signer,
        }
    }
}

impl ConsensusCrypto for ConsensusCryptoImpl {
    type Pk = Ed25519PublicKey;
    type Sig = Ed25519Signature;

    fn get_public_key(&self, address: &Address) -> Option<Self::Pk> {
        let index = self.committee.address_map.get_by_address(address)?.index;
        Some(self.committee.committee.validators[index].public_key())
    }

    fn get_public_keys(&self, bitmap: &BitVec) -> Result<Vec<Self::Pk>, Box<dyn Error + Send>> {
        Ok(self
            .committee
            .get_by_bitmap(bitmap)
            .map(|v| v.public_key())
            .collect())
    }

    fn get_all_others_public_keys(&self) -> Vec<Self::Pk> {
        if self.committee.len() == 1 {
            return vec![];
        }

        self.committee
            .committee
            .validators
            .iter()
            .filter_map(|v| (v.public_key() != self.self_pub_key).then_some(v.public_key()))
            .collect()
    }

    fn sign(&self, hash: &H256) -> Self::Sig {
        self.signer.sign(hash)
    }

    fn verify(
        &self,
        hash: &H256,
        pk: &Self::Pk,
        sig: &Self::Sig,
    ) -> Result<(), Box<dyn Error + Send>> {
        sig.verify(hash, pk)?;
        Ok(())
    }

    fn batch_verify(
        &self,
        hash: &H256,
        pks: &[Self::Pk],
        sigs: &[Self::Sig],
    ) -> Result<(), Box<dyn Error + Send>> {
        Ed25519BatchVerify::verify(hash, sigs, pks)?;
        Ok(())
    }
}

impl ConsensusValidatorManage for ConsensusCryptoImpl {
    fn validator_count(&self) -> usize {
        self.committee.len()
    }

    fn threshold(&self) -> usize {
        self.committee.committee.threshold()
    }

    fn elect_leader(&self, block_number: BlockNumber) -> Address {
        let validator_count = self.committee.len();
        let index = block_number as usize % validator_count;
        self.committee
            .address_map
            .get_by_index(&index)
            .unwrap()
            .address
    }

    fn get_address_index(&self, address: &Address) -> Option<usize> {
        self.committee
            .address_map
            .get_by_address(address)
            .map(|v| v.index)
    }

    fn is_above_threshold(&self, bitmap: &BitVec) -> bool {
        self.committee.is_above_threshold(bitmap)
    }

    fn is_addresses_above_threshold(&self, addresses: &[&Address]) -> bool {
        addresses.len() >= self.committee.committee.threshold()
    }

    fn generate_signed_bitmap<'a>(&self, validators: impl Iterator<Item = &'a Address>) -> BitVec {
        let mut bitmap = BitVec::from_elem(self.committee.len(), false);
        validators.for_each(|addr| {
            let index = self
                .committee
                .address_map
                .get_by_address(addr)
                .unwrap()
                .index;
            bitmap.set(index, true);
        });

        bitmap
    }
}

#[derive(MultiIndexMap, Clone, Debug)]
struct ValidatorAddress {
    #[multi_index(hashed_unique)]
    address: Address,
    #[multi_index(ordered_unique)]
    index: usize,
}

impl Debug for MultiIndexValidatorAddressMap {
    fn fmt(&self, f: &mut Formatter<'_>) -> FmtResult {
        for (index, address) in self.iter() {
            writeln!(f, "{}: {:?}", index, address)?;
        }
        Ok(())
    }
}

impl ValidatorAddress {
    fn new(address: Address, index: usize) -> Self {
        Self { address, index }
    }
}

struct WrappedCommittee {
    committee: Committee,
    address_map: MultiIndexValidatorAddressMap,
}

impl From<Committee> for WrappedCommittee {
    fn from(committee: Committee) -> Self {
        let mut address_map = MultiIndexValidatorAddressMap::with_capacity(committee.len());
        committee.validators.iter().enumerate().for_each(|(i, v)| {
            address_map.insert(ValidatorAddress::new(v.public_key().into(), i));
        });

        Self {
            address_map,
            committee,
        }
    }
}

impl WrappedCommittee {
    pub fn get_by_bitmap<'a>(&'a self, bitmap: &'a BitVec) -> impl Iterator<Item = &'a Validator> {
        self.committee.get_by_bitmap(bitmap)
    }

    pub fn is_above_threshold(&self, bitmap: &BitVec) -> bool {
        self.committee.is_above_threshold(bitmap)
    }

    pub fn len(&self) -> usize {
        self.committee.len()
    }
}
