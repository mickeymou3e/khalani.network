pub mod metrics;

use std::{fmt::Debug, sync::Arc};

use async_trait::async_trait;
use ethers::core::types::{
    transaction::eip2718::TypedTransaction, Address, Block, BlockId, BlockNumber, BlockTrace,
    Bytes, Filter, Log, NameOrAddress, Signature, SyncingStatus, Trace, TraceFilter, TraceType,
    Transaction, TransactionReceipt, TxHash, H256, U256, U64,
};
use ethers::providers::{
    FilterKind, Http, Middleware, MiddlewareError, NodeInfo, PendingTransaction, Provider,
    ProviderError, PubsubClient, SubscriptionStream,
};
use serde::{de::DeserializeOwned, Serialize};
use thiserror::Error;
use url::Url;

macro_rules! auto_metrics {
    ($self: ident, $rpc_name: ident, $request_kind: ident $(,$args: ident)*) => {{
        let instant = std::time::Instant::now();
        let ret = $self.0.$rpc_name($($args),*).await.map_err(|e| ElMiddlewareError::Middleware(e))?;
        crate::provider::metrics::API_REQUEST_RESULT_COUNTER_VEC_STATIC.$request_kind.inc();
        crate::provider::metrics::API_REQUEST_TIME_HISTOGRAM_STATIC
            .$request_kind
            .observe(instant.elapsed().as_secs_f64());
        Ok(ret)
    }};
}

pub type ElProvider = ElMiddleware<Provider<Http>>;

#[derive(Clone, Debug)]
pub struct ElMiddleware<M>(Arc<M>);

impl From<Url> for ElMiddleware<Provider<Http>> {
    fn from(url: Url) -> Self {
        Self(Arc::new(Provider::try_from(url.to_string()).unwrap()))
    }
}

impl<M: Middleware> ElMiddleware<M> {
    pub fn new(inner: M) -> Self {
        Self(Arc::new(inner))
    }
}

#[derive(Debug, Error)]
pub enum ElMiddlewareError<M: Middleware> {
    #[error("{0}")]
    Middleware(M::Error),
    #[error("{0}")]
    Provider(#[from] ProviderError),
}

impl<M: Middleware> MiddlewareError for ElMiddlewareError<M> {
    type Inner = M::Error;

    fn from_err(e: Self::Inner) -> Self {
        ElMiddlewareError::Middleware(e)
    }

    fn as_inner(&self) -> Option<&Self::Inner> {
        match self {
            ElMiddlewareError::Middleware(inner) => Some(inner),
            _ => None,
        }
    }
}

#[async_trait]
impl<M: Middleware> Middleware for ElMiddleware<M> {
    type Error = ElMiddlewareError<M>;
    type Inner = M;
    type Provider = M::Provider;

    fn inner(&self) -> &M {
        &self.0
    }

    async fn get_accounts(&self) -> Result<Vec<Address>, Self::Error> {
        auto_metrics!(self, get_accounts, eth_accounts)
    }

    async fn get_block_number(&self) -> Result<U64, Self::Error> {
        auto_metrics!(self, get_block_number, eth_blockNumber)
    }

    async fn call(
        &self,
        tx: &TypedTransaction,
        block: Option<BlockId>,
    ) -> Result<Bytes, Self::Error> {
        auto_metrics!(self, call, eth_call, tx, block)
    }

    async fn get_chainid(&self) -> Result<U256, Self::Error> {
        auto_metrics!(self, get_chainid, eth_chainId)
    }

    async fn estimate_gas(
        &self,
        tx: &TypedTransaction,
        block: Option<BlockId>,
    ) -> Result<U256, Self::Error> {
        auto_metrics!(self, estimate_gas, eth_estimateGas, tx, block)
    }

    async fn get_gas_price(&self) -> Result<U256, Self::Error> {
        auto_metrics!(self, get_gas_price, eth_gasPrice)
    }

    async fn get_balance<T: Into<NameOrAddress> + Send + Sync>(
        &self,
        from: T,
        block: Option<BlockId>,
    ) -> Result<U256, Self::Error> {
        auto_metrics!(self, get_balance, eth_getBalance, from, block)
    }

    async fn get_block<T: Into<BlockId> + Send + Sync>(
        &self,
        block_hash_or_number: T,
    ) -> Result<Option<Block<TxHash>>, Self::Error> {
        let block_id = block_hash_or_number.into();
        match block_id {
            BlockId::Hash(_) => {
                auto_metrics!(self, get_block, eth_getBlockByHash, block_id)
            }
            BlockId::Number(_) => {
                auto_metrics!(self, get_block, eth_getBlockByNumber, block_id)
            }
        }
    }

    async fn get_transaction_count<T: Into<NameOrAddress> + Send + Sync>(
        &self,
        from: T,
        block: Option<BlockId>,
    ) -> Result<U256, Self::Error> {
        if let Some(block_id) = block {
            let id = Some(block_id);
            match block_id {
                BlockId::Hash(_) => {
                    auto_metrics!(
                        self,
                        get_transaction_count,
                        eth_getBlockTransactionCountByHash,
                        from,
                        id
                    )
                }
                BlockId::Number(_) => {
                    auto_metrics!(
                        self,
                        get_transaction_count,
                        eth_getBlockTransactionCountByNumber,
                        from,
                        id
                    )
                }
            }
        } else {
            auto_metrics!(
                self,
                get_transaction_count,
                eth_getTransactionCount,
                from,
                None
            )
        }
    }

    async fn get_code<T: Into<NameOrAddress> + Send + Sync>(
        &self,
        at: T,
        block: Option<BlockId>,
    ) -> Result<Bytes, Self::Error> {
        auto_metrics!(self, get_code, eth_getCode, at, block)
    }

    async fn get_filter_changes<T, R>(&self, id: T) -> Result<Vec<R>, Self::Error>
    where
        T: Into<U256> + Send + Sync,
        R: Serialize + DeserializeOwned + Send + Sync + Debug,
    {
        auto_metrics!(self, get_filter_changes, eth_getFilterChanges, id)
    }

    async fn get_logs(&self, filter: &Filter) -> Result<Vec<Log>, Self::Error> {
        auto_metrics!(self, get_logs, eth_getLogs, filter)
    }

    async fn get_storage_at<T: Into<NameOrAddress> + Send + Sync>(
        &self,
        from: T,
        location: H256,
        block: Option<BlockId>,
    ) -> Result<H256, Self::Error> {
        auto_metrics!(
            self,
            get_storage_at,
            eth_getStorageAt,
            from,
            location,
            block
        )
    }

    async fn get_transaction_by_block_and_index<T: Into<BlockId> + Send + Sync>(
        &self,
        block_hash_or_number: T,
        idx: U64,
    ) -> Result<Option<Transaction>, Self::Error> {
        let block_id = block_hash_or_number.into();
        match block_id {
            BlockId::Hash(_) => {
                auto_metrics!(
                    self,
                    get_transaction_by_block_and_index,
                    eth_getBlockTransactionCountByHash,
                    block_id,
                    idx
                )
            }
            BlockId::Number(_) => {
                auto_metrics!(
                    self,
                    get_transaction_by_block_and_index,
                    eth_getBlockTransactionCountByNumber,
                    block_id,
                    idx
                )
            }
        }
    }

    async fn get_transaction<T: Send + Sync + Into<TxHash>>(
        &self,
        transaction_hash: T,
    ) -> Result<Option<Transaction>, Self::Error> {
        auto_metrics!(
            self,
            get_transaction,
            eth_getTransactionByHash,
            transaction_hash
        )
    }

    async fn client_version(&self) -> Result<String, Self::Error> {
        auto_metrics!(self, client_version, web3_clientVersion)
    }

    async fn fill_transaction(
        &self,
        tx: &mut TypedTransaction,
        block: Option<BlockId>,
    ) -> Result<(), Self::Error> {
        auto_metrics!(self, fill_transaction, eth_fillTransaction, tx, block)
    }

    async fn get_transaction_receipt<T: Send + Sync + Into<TxHash>>(
        &self,
        transaction_hash: T,
    ) -> Result<Option<TransactionReceipt>, Self::Error> {
        auto_metrics!(
            self,
            get_transaction_receipt,
            eth_getTransactionReceipt,
            transaction_hash
        )
    }

    async fn get_uncle<T: Into<BlockId> + Send + Sync>(
        &self,
        block_hash_or_number: T,
        idx: U64,
    ) -> Result<Option<Block<H256>>, Self::Error> {
        let block_id = block_hash_or_number.into();
        match block_id {
            BlockId::Hash(_) => {
                auto_metrics!(
                    self,
                    get_uncle,
                    eth_getUncleByBlockHashAndIndex,
                    block_id,
                    idx
                )
            }
            BlockId::Number(_) => {
                auto_metrics!(
                    self,
                    get_uncle,
                    eth_getUncleByBlockNumberAndIndex,
                    block_id,
                    idx
                )
            }
        }
    }

    async fn get_uncle_count<T: Into<BlockId> + Send + Sync>(
        &self,
        block_hash_or_number: T,
    ) -> Result<U256, Self::Error> {
        let block_id = block_hash_or_number.into();
        match block_id {
            BlockId::Hash(_) => {
                auto_metrics!(
                    self,
                    get_uncle_count,
                    eth_getUncleCountByBlockHash,
                    block_id
                )
            }
            BlockId::Number(_) => {
                auto_metrics!(
                    self,
                    get_uncle_count,
                    eth_getUncleCountByBlockNumber,
                    block_id
                )
            }
        }
    }

    async fn mining(&self) -> Result<bool, Self::Error> {
        auto_metrics!(self, mining, eth_mining)
    }

    async fn new_filter(&self, filter: FilterKind<'_>) -> Result<U256, Self::Error> {
        auto_metrics!(self, new_filter, eth_newFilter, filter)
    }

    async fn node_info(&self) -> Result<NodeInfo, Self::Error> {
        auto_metrics!(self, node_info, eth_protocolVersion)
    }

    async fn send_raw_transaction<'a>(
        &'a self,
        tx: Bytes,
    ) -> Result<PendingTransaction<'a, Self::Provider>, Self::Error> {
        auto_metrics!(self, send_raw_transaction, eth_sendRawTransaction, tx)
    }

    async fn sign<T: Into<Bytes> + Send + Sync>(
        &self,
        data: T,
        from: &Address,
    ) -> Result<Signature, Self::Error> {
        auto_metrics!(self, sign, eth_sign, data, from)
    }

    async fn sign_transaction(
        &self,
        tx: &TypedTransaction,
        from: Address,
    ) -> Result<Signature, Self::Error> {
        auto_metrics!(self, sign_transaction, eth_signTransaction, tx, from)
    }

    async fn send_transaction<T: Into<TypedTransaction> + Send + Sync>(
        &self,
        tx: T,
        block: Option<BlockId>,
    ) -> Result<PendingTransaction<'_, Self::Provider>, Self::Error> {
        auto_metrics!(self, send_transaction, eth_sendRawTransaction, tx, block)
    }

    async fn syncing(&self) -> Result<SyncingStatus, Self::Error> {
        auto_metrics!(self, syncing, eth_syncing)
    }

    async fn uninstall_filter<T: Into<U256> + Send + Sync>(
        &self,
        id: T,
    ) -> Result<bool, Self::Error> {
        auto_metrics!(self, uninstall_filter, eth_uninstallFilter, id)
    }

    // Pubsub Namespace
    async fn subscribe<T, R>(
        &self,
        params: T,
    ) -> Result<SubscriptionStream<'_, Self::Provider, R>, Self::Error>
    where
        T: Debug + Serialize + Send + Sync,
        R: DeserializeOwned + Send + Sync,
        <Self as Middleware>::Provider: PubsubClient,
    {
        auto_metrics!(self, subscribe, eth_subscribe, params)
    }

    async fn unsubscribe<T>(&self, id: T) -> Result<bool, Self::Error>
    where
        T: Into<U256> + Send + Sync,
        <Self as Middleware>::Provider: PubsubClient,
    {
        auto_metrics!(self, unsubscribe, eth_unsubscribe, id)
    }

    // Trace Namespace
    async fn trace_call<T: Into<TypedTransaction> + Send + Sync>(
        &self,
        req: T,
        trace_type: Vec<TraceType>,
        block: Option<BlockNumber>,
    ) -> Result<BlockTrace, Self::Error> {
        auto_metrics!(self, trace_call, trace_call, req, trace_type, block)
    }

    async fn trace_call_many<T: Into<TypedTransaction> + Send + Sync>(
        &self,
        req: Vec<(T, Vec<TraceType>)>,
        block: Option<BlockNumber>,
    ) -> Result<Vec<BlockTrace>, Self::Error> {
        auto_metrics!(self, trace_call_many, trace_callMany, req, block)
    }

    async fn trace_raw_transaction(
        &self,
        data: Bytes,
        trace_type: Vec<TraceType>,
    ) -> Result<BlockTrace, Self::Error> {
        auto_metrics!(
            self,
            trace_raw_transaction,
            trace_rawTransaction,
            data,
            trace_type
        )
    }

    async fn trace_replay_transaction(
        &self,
        hash: H256,
        trace_type: Vec<TraceType>,
    ) -> Result<BlockTrace, Self::Error> {
        auto_metrics!(
            self,
            trace_replay_transaction,
            trace_replayTransaction,
            hash,
            trace_type
        )
    }

    async fn trace_replay_block_transactions(
        &self,
        block: BlockNumber,
        trace_type: Vec<TraceType>,
    ) -> Result<Vec<BlockTrace>, Self::Error> {
        auto_metrics!(
            self,
            trace_replay_block_transactions,
            trace_replayBlockTransactions,
            block,
            trace_type
        )
    }

    async fn trace_block(&self, block: BlockNumber) -> Result<Vec<Trace>, Self::Error> {
        auto_metrics!(self, trace_block, trace_block, block)
    }

    async fn trace_filter(&self, filter: TraceFilter) -> Result<Vec<Trace>, Self::Error> {
        auto_metrics!(self, trace_filter, trace_filter, filter)
    }

    async fn trace_get<T: Into<U64> + Send + Sync>(
        &self,
        hash: H256,
        index: Vec<T>,
    ) -> Result<Trace, Self::Error> {
        auto_metrics!(self, trace_get, trace_get, hash, index)
    }

    async fn trace_transaction(&self, hash: H256) -> Result<Vec<Trace>, Self::Error> {
        auto_metrics!(self, trace_transaction, trace_transaction, hash)
    }

    // Parity namespace
    async fn parity_block_receipts<T: Into<BlockNumber> + Send + Sync>(
        &self,
        block: T,
    ) -> Result<Vec<TransactionReceipt>, Self::Error> {
        auto_metrics!(self, parity_block_receipts, parity_blockReceipts, block)
    }
}
