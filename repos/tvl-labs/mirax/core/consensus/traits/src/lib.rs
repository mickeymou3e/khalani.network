use std::error::Error;
use std::fmt::Debug;

use serde::{de::DeserializeOwned, Serialize};

use mirax_crypto::{PublicKey, Signature};
use mirax_network::traits::{Gossip, RpcCall, TopicMessage};
use mirax_types::traits::BlockEnvelopeTrait;
use mirax_types::{
    Address, BitVec, BlockEnvelope, BlockNumber, Byte32, Bytes, Header, TransactionBatch,
    TransactionChunk, VerifyResult, WrappedTransaction, H256,
};

/// The consensus crypto trait.
pub trait ConsensusCrypto {
    /// The public key type.
    type Pk: PublicKey + PartialEq;

    /// The signature type.
    type Sig: Signature + Debug;

    /// Sign a message.
    fn sign(&self, hash: &H256) -> Self::Sig;

    /// Get the public key by the address.
    fn get_public_key(&self, address: &Address) -> Option<Self::Pk>;

    /// Get the public keys by the bitmap.
    fn get_public_keys(&self, bitmap: &BitVec) -> Result<Vec<Self::Pk>, Box<dyn Error + Send>>;

    /// Get all other validators' public keys.
    fn get_all_others_public_keys(&self) -> Vec<Self::Pk>;

    /// Verify the signature.
    fn verify(
        &self,
        hash: &H256,
        pk: &Self::Pk,
        sig: &Self::Sig,
    ) -> Result<(), Box<dyn Error + Send>>;

    /// Verify a batch of signatures.
    fn batch_verify(
        &self,
        hash: &H256,
        pks: &[Self::Pk],
        sigs: &[Self::Sig],
    ) -> Result<(), Box<dyn Error + Send>>;
}

#[trait_variant::make(Send + Sync)]
pub trait ConsensusGossip {
    async fn broadcast<M: TopicMessage>(&self, msg: M) -> Result<(), Box<dyn Error + Send>>;

    async fn unicast<P: PublicKey, M: TopicMessage>(
        &self,
        peer: &P,
        msg: M,
    ) -> Result<(), Box<dyn Error + Send>>;

    async fn call<P, Req, Resp>(&self, peer: &P, req: Req) -> Result<Resp, Box<dyn Error + Send>>
    where
        P: PublicKey,
        Req: TopicMessage,
        Resp: Serialize + DeserializeOwned + Send + Sync;
}

impl<T: Gossip + RpcCall> ConsensusGossip for T {
    async fn broadcast<M: TopicMessage>(&self, msg: M) -> Result<(), Box<dyn Error + Send>> {
        Gossip::broadcast(self, msg).await?;
        Ok(())
    }

    async fn unicast<P: PublicKey, M: TopicMessage>(
        &self,
        address: &P,
        msg: M,
    ) -> Result<(), Box<dyn Error + Send>> {
        Gossip::unicast(self, address, msg).await?;
        Ok(())
    }

    async fn call<P, Req, Resp>(&self, peer: &P, req: Req) -> Result<Resp, Box<dyn Error + Send>>
    where
        P: PublicKey,
        Req: TopicMessage,
        Resp: Serialize + DeserializeOwned + Send + Sync,
    {
        let resp = RpcCall::call(self, peer, req).await?;
        Ok(resp)
    }
}

pub trait ConsensusValidatorManage {
    fn validator_count(&self) -> usize;

    fn threshold(&self) -> usize;

    fn elect_leader(&self, block_number: u64) -> Address;

    fn get_address_index(&self, address: &Address) -> Option<usize>;

    fn is_above_threshold(&self, bitmap: &BitVec) -> bool;

    fn is_addresses_above_threshold(&self, addresses: &[&Address]) -> bool;

    fn generate_signed_bitmap<'a>(&self, validators: impl Iterator<Item = &'a Address>) -> BitVec;
}

#[trait_variant::make(Send + Sync)]
pub trait ConsensusStorage {
    async fn insert_committed_data(
        &self,
        key: &Byte32,
        data: &Bytes,
    ) -> Result<(), Box<dyn Error + Send>>;

    async fn insert_transaction_chunk<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        tx_chunk: &TransactionChunk<S>,
    ) -> Result<(), Box<dyn Error + Send>>;

    async fn insert_block<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block: &BlockEnvelope<S>,
    ) -> Result<(), Box<dyn Error + Send>>;

    async fn insert_state_data(&self, data: &Bytes) -> Result<(), Box<dyn Error + Send>>;

    async fn get_state_data(&self) -> Result<Option<Bytes>, Box<dyn Error + Send>>;

    async fn get_header_by_number(
        &self,
        block_number: &BlockNumber,
    ) -> Result<Option<Header>, Box<dyn Error + Send>>;

    async fn check_transactions_exist(
        &self,
        tx_hashes: &[H256],
    ) -> Result<Vec<H256>, Box<dyn Error + Send>>;

    async fn check_chunk_exist(
        &self,
        block_number: &BlockNumber,
        address: &Address,
    ) -> Result<bool, Box<dyn Error + Send>>;
}

/// The consensus transaction process trait.
#[trait_variant::make(Send + Sync)]
pub trait ConsensusTransactionProcess {
    type Block: BlockEnvelopeTrait;

    /// Package transactions in the local mempool.
    async fn package_transactions(
        &self,
        config: PackageConfig,
    ) -> Result<Vec<WrappedTransaction>, Box<dyn Error + Send>>;

    /// Fetch transactions from the remote node by the hashes.
    async fn fetch_transaction_batch(
        &self,
        tx_batch_hash: &H256,
    ) -> Result<TransactionBatch, Box<dyn Error + Send>>;

    async fn verify_transactions(
        &self,
        txs: Vec<WrappedTransaction>,
    ) -> Result<Vec<VerifyResult>, Box<dyn Error + Send>>;

    /// Execute transactions in the block.
    fn execute(&self, block: &Self::Block) -> Result<Vec<VerifyResult>, Box<dyn Error + Send>>;
}

#[derive(Clone, Debug)]
pub struct PackageConfig {
    pub max_tx_count: usize,
    pub max_tx_size: usize,
}

impl PackageConfig {
    pub fn new(max_tx_count: usize, max_tx_size: usize) -> Self {
        Self {
            max_tx_count,
            max_tx_size,
        }
    }
}
