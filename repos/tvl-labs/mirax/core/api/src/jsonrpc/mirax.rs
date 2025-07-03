use jsonrpsee::{
    core::{async_trait, RpcResult},
    proc_macros::rpc,
};
use mirax_crypto::ed25519::Ed25519Signature;
use mirax_jsonrpc_types::Block;
use mirax_types::{BlockEnvelope, Transaction, H256};
use smol_str::ToSmolStr;

use crate::{backend::traits::APIBackend, error::RpcError};

#[rpc(server, client, namespace = "mirax")]
pub trait MiraxRpc {
    #[method(name = "getTransaction")]
    async fn get_transaction(&self, tx_hash: H256) -> RpcResult<Option<Transaction>>;

    #[method(name = "getBlockByNumber")]
    async fn get_block_by_number(&self, block_number: u64) -> RpcResult<Option<Block>>;

    #[method(name = "getBlockByHash")]
    async fn get_block_by_hash(&self, block_hash: H256) -> RpcResult<Option<Block>>;

    #[method(name = "getTipNumber")]
    async fn get_tip_number(&self) -> RpcResult<u64>;

    #[method(name = "insertTransaction")]
    async fn insert_transaction(&self, tx: Transaction) -> RpcResult<H256>;
}

pub struct MiraxRpcImpl<Backend: APIBackend> {
    backend: Backend,
}

impl<Backend: APIBackend> MiraxRpcImpl<Backend> {
    pub fn new(backend: Backend) -> Self {
        Self { backend }
    }
}

#[async_trait]
impl<Backend: APIBackend + 'static> MiraxRpcServer for MiraxRpcImpl<Backend> {
    async fn get_transaction(&self, tx_hash: H256) -> RpcResult<Option<Transaction>> {
        Ok(self
            .backend
            .get_transaction(&tx_hash)
            .await
            .map_err(|e| RpcError::Internal(e.to_smolstr()))?)
    }

    async fn get_block_by_number(&self, block_number: u64) -> RpcResult<Option<Block>> {
        let block_opt: Option<BlockEnvelope<Ed25519Signature>> = self
            .backend
            .get_block_by_number(block_number)
            .await
            .map_err(|e| RpcError::Internal(e.to_smolstr()))?;
        Ok(block_opt.map(|block| block.into()))
    }

    async fn get_block_by_hash(&self, block_hash: H256) -> RpcResult<Option<Block>> {
        let block_opt: Option<BlockEnvelope<Ed25519Signature>> = self
            .backend
            .get_block_by_hash(&block_hash)
            .await
            .map_err(|e| RpcError::Internal(e.to_smolstr()))?;
        Ok(block_opt.map(|block| block.into()))
    }

    async fn get_tip_number(&self) -> RpcResult<u64> {
        Ok(self
            .backend
            .get_tip_block_header()
            .await
            .map(|header| header.block_number)
            .map_err(|e| RpcError::Internal(e.to_smolstr()))?)
    }

    async fn insert_transaction(&self, tx: Transaction) -> RpcResult<H256> {
        Ok(self
            .backend
            .insert_transaction(tx)
            .await
            .map_err(|e| RpcError::Internal(e.to_smolstr()))?)
    }
}
