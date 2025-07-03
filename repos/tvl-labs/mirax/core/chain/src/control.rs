use std::panic::PanicHookInfo;
use std::sync::Arc;

use backtrace::Backtrace;
use flume::{bounded, Receiver, Sender};
use tokio::task::JoinHandle;

use mirax_api::{
    run_graphql_server, run_jsonrpc_server, APIBackendImpl, GraphQLServer, JsonRpcServer,
};
use mirax_config::MiraxConfig;
use mirax_consensus::crypto::ConsensusCryptoImpl;
use mirax_consensus_traits::ConsensusValidatorManage;
use mirax_crypto::ed25519::{Ed25519PrivateKey, Ed25519Signature};
use mirax_db::rocks::RocksDatabase;
use mirax_mempool::{ConsensusMempool, MempoolHandle, QueueService};
use mirax_narwhal::message::{CertificateHandler, TransactionChunkHandler};
use mirax_narwhal::{
    collections::NarwhalCollection, handler::ConsensusHandler, state::ConsensusState,
    BullsharkBuilder,
};
use mirax_network::NetworkBuilder;
use mirax_signal::{init_stop_signal, ShutdownRx};
use mirax_signer::Ed25519Signer;
use mirax_spec::MiraxSpec;
use mirax_storage::{db_cols, StorageImpl};
use mirax_types::MiraxResult;

use crate::{ChainController, RocksStorage};

type ConsensusMempoolImpl = ConsensusMempool<RocksDatabase, Ed25519Signature>;
type MempoolHandleImpl = MempoolHandle<RocksDatabase>;

pub struct MiraxChain {
    crypto: Arc<ConsensusCryptoImpl>,
    storage: RocksStorage,
    api: Option<Api>,

    shutdown_handle: JoinHandle<()>,
    shutdown_rx: ShutdownRx,
    panic_rx: Receiver<()>,

    config: MiraxConfig,
}

impl ChainController for MiraxChain {
    async fn run(mut self) -> MiraxResult<()> {
        let (consensus_mempool, mempool_handle) = self.run_mempool().await;
        self.run_consensus_network(consensus_mempool).await?;
        self.run_api_server(mempool_handle).await?;

        tokio::select! {
            _ = self.shutdown_handle => { log::info!("ctrl + c is pressed, quit.") },
            _ = self.panic_rx.recv_async() => { log::info!("child thread panic, quit.") },
        };

        Ok(())
    }
}

impl MiraxChain {
    pub async fn new(spec: MiraxSpec, config: MiraxConfig) -> MiraxResult<Self> {
        let storage = StorageImpl::new(RocksDatabase::open(config.rocks_db_path(), db_cols())?);
        let crypto = ConsensusCryptoImpl::new(
            spec.metadata.validator_list()?,
            Ed25519Signer::new(config.private_key.as_slice().try_into()?),
        );
        let (shutdown_handle, shutdown_rx) = init_stop_signal().await;
        let (panic_tx, panic_rx) = bounded(1);

        Self::set_panic_hook(panic_tx);

        Ok(MiraxChain {
            crypto: Arc::new(crypto),
            storage,
            api: None,
            shutdown_handle,
            shutdown_rx,
            panic_rx,
            config,
        })
    }

    async fn run_mempool(&mut self) -> (ConsensusMempoolImpl, MempoolHandleImpl) {
        log::info!("[Mirax] Run mempool service");
        let (mempool_service, handle, consensus_mempool) = QueueService::new(self.storage.clone());
        mempool_service.run().await;
        (consensus_mempool, handle)
    }

    async fn run_consensus_network(
        &mut self,
        consensus_mempool: ConsensusMempoolImpl,
    ) -> MiraxResult<()> {
        let consensus_mempool = Arc::new(consensus_mempool);
        let consensus_builder: BullsharkBuilder<_, ConsensusCryptoImpl> =
            BullsharkBuilder::new(Arc::new(self.storage.clone())).await;

        log::info!("[Mirax] Register consensus message handler");

        let network_builder = self
            .register_message_handler(
                consensus_builder.state.clone(),
                consensus_builder.collection.clone(),
                consensus_builder.handler(),
                Arc::clone(&consensus_mempool),
            )
            .await?;
        let node = network_builder.build(&Ed25519PrivateKey::try_from(
            self.config.private_key.as_slice(),
        )?)?;

        let consensus = consensus_builder.build(
            Arc::clone(&self.crypto),
            Arc::new(node.client()),
            consensus_mempool,
            Arc::clone(&self.crypto),
            self.config.consensus.gc_depth,
            self.config.address,
        );

        tokio::spawn(async move {
            node.start().unwrap();
        });

        log::info!(
            "[Mirax] Run consensus service with {} nodes",
            self.crypto.validator_count()
        );
        consensus.run().await;

        Ok(())
    }

    async fn run_api_server(&mut self, mempool_handle: MempoolHandleImpl) -> MiraxResult<()> {
        let backend = APIBackendImpl::new(mempool_handle, Arc::new(self.storage.clone()));
        self.api = Some(Api {
            jsonrpc: run_jsonrpc_server(self.config.api.clone(), backend.clone()).await?,
            graphql: run_graphql_server(self.config.api.clone(), backend, self.shutdown_rx.clone())
                .await?,
        });

        Ok(())
    }

    async fn register_message_handler(
        &mut self,
        state: ConsensusState,
        collection: Arc<NarwhalCollection<Ed25519Signature>>,
        handler: ConsensusHandler<Ed25519Signature>,
        mempool: Arc<ConsensusMempoolImpl>,
    ) -> MiraxResult<NetworkBuilder> {
        // Register certificate handler
        let certificate_handler = CertificateHandler::new(
            Arc::clone(&self.crypto),
            state.clone(),
            Arc::clone(&self.crypto),
            collection,
        );

        let builder = NetworkBuilder::new(self.config.network.clone())
            .with_grateful_shutdown(self.shutdown_rx.clone());

        // Register transaction chunk handler
        let tx_chunk_handler = TransactionChunkHandler::new(
            Arc::clone(&self.crypto),
            Arc::clone(&self.crypto),
            Arc::new(self.storage.clone()),
            mempool,
            state,
            handler,
            self.config.address,
        );

        builder
            .register_message_handler(certificate_handler)?
            .register_message_handler(tx_chunk_handler)
    }

    fn set_panic_hook(panic_tx: Sender<()>) {
        std::panic::set_hook(Box::new(move |info: &PanicHookInfo| {
            panic_log(info);
            panic_tx.try_send(()).expect("panic_receiver is dropped");
        }));
    }
}

fn panic_log(info: &PanicHookInfo) {
    let backtrace = Backtrace::new();
    let thread = std::thread::current();
    let name = thread.name().unwrap_or("unnamed");
    let location = info.location().unwrap(); // The current implementation always returns Some
    let msg = match info.payload().downcast_ref::<&'static str>() {
        Some(s) => *s,
        None => match info.payload().downcast_ref::<String>() {
            Some(s) => &**s,
            None => "Box<Any>",
        },
    };

    log::error!(
        target: "panic", "thread '{}' panicked at '{}': {}:{} {:?}",
        name,
        msg,
        location.file(),
        location.line(),
        backtrace,
    );
}

#[derive(Default)]
#[allow(dead_code)]
struct Api {
    jsonrpc: JsonRpcServer,
    graphql: GraphQLServer,
}
