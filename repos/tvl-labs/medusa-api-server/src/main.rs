mod balance_monitor;
mod chain;
mod config;
#[allow(dead_code, unused_variables)]
mod dev_net;
mod key_manager;
mod metrics_wal;
mod rpc;
mod storage;

use std::fs;
use std::panic::PanicHookInfo;
use std::path::Path;
use std::str::FromStr;
use std::sync::Arc;

use alloy::network::EthereumWallet;
use alloy::providers::ProviderBuilder;
use alloy::signers::local::LocalSigner;
use apm::run_prometheus_server;
use backtrace::Backtrace;
use balance_monitor::BalanceMonitor;
use key_manager::{KeyManager, KeyManagerTrait};
use metrics_wal::{recover_metrics, run_metrics_wal};
use tokio::signal::unix::{self, SignalKind};
use tokio::sync::broadcast;
use tokio::sync::mpsc::{channel, Sender};
use tracing::debug;
use tracing_subscriber;

use crate::chain::ChainService;
use crate::config::MedusaConfig;
use crate::rpc::run_rpc_server;
use crate::storage::StorageService;

// Medusa Architecture:

// Parallel services running:
// 1. Storage Service
// 2. Chain Service
// 3. Websocket Service
// 4. Intent API Service
/*
    Websocket service is different from the websocket api Router. It basically receives messages from other services so that it can then broadcast relevant
    updates to the subscribed solvers. The websocket service is not parallel, but concurrent. It runs in the `handle_socket` function within websocket.rs.

    The broadcast channel sender for the websocket service must be part of the AppState.inboxes


    Services across different threads:
                            (main thread)
   Chain Service ----- API Server (multiple routers) ------------ Storage Service
                            |               |
                            |               |
                        WebSocket Router  Intent API Router


    Each service holds a sender to the main service.
    Each service holds a service-specific receiver that receives service-specific messages from.
    To send a message from one service to another, a service sends to the main thread, which then sends to the receiving service.


    Change:

                HTTP API Service ----Event Pub---|
                    ^                            |
                    |_______Event Sub_____       |
                                          |      V
    Chain Service ----Event Producer---> Event Manager <--------Event Producer------- Store Service
        ^                                   |      |                                    ^
        |_________Event Subscription________|      |_____________Event Subscription_____|


    Every service:
        ServiceSpecificMessage
        SpecificService {
            inner: Service<ServiceSpecificMessage, ServiceSpecificResponse>
            event_rx: EventSubscription,
            event_tx: Sender<SystemEvent>,
        }

        Each service has event loop to handle incoming from event_rx or service specific messages from inner.subscription

        Event manager has a tx to each service, where it can send ServiceSpecificMessage to service
        Event Manager event loop is over each SystemEvent AND each inbound service rx for ServiceSpecificResponse
*/
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        // .with_max_level(tracing::Level::TRACE)
        .init();
    let reset = std::env::args().any(|arg| arg == "--reset");
    let config_path_arg = std::env::args().nth(1).expect("No argument provided");

    let config_path = Path::new(&config_path_arg);
    let config: MedusaConfig = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )
    .expect("Error parsing config file");

    run_prometheus_server(config.apm_url.parse().unwrap()).await;
    let key_manager = KeyManager::new(
        config.key.clone(),
        config.mode.clone(),
        config.asm_region.clone(),
        config.asm_secret_name.clone(),
        config.asm_secret_key.clone(),
    )
    .await;
    let key = key_manager.get_medusa_key().await.unwrap();
    debug!("Using key: {}", key);

    let wallet = EthereumWallet::new(LocalSigner::from_str(&key).unwrap());
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http(config.arcadia_url.parse().unwrap());

    let (ws_tx, _ws_rx) = broadcast::channel(100);
    let (expiration_tx, _expiration_rx) = broadcast::channel(100);
    let storage_service = StorageService::new(&config.db_path, reset, expiration_tx.clone());
    let db = storage_service.inner();
    let chain_config = config.make_chain_config().to_chain_config();
    let provider = Arc::new(provider);
    let chain_service = ChainService::new(
        Arc::clone(&provider),
        chain_config.intent_book,
        chain_config.m_token_manager,
        chain_config.receipt_manager,
        chain_config.hyperlane_api_url,
        chain_config.gas_price,
    )
    .await;

    run_rpc_server(
        key_manager,
        config.medusa_rpc_url(),
        config.medusa_ws_url(),
        chain_service,
        storage_service,
        ws_tx,
        expiration_tx,
    )
    .await;

    BalanceMonitor::new(chain_config.m_tokens, provider)
        .run()
        .await;

    recover_metrics(Arc::clone(&db));
    run_metrics_wal(db).await;

    let (panic_tx, mut panic_rx) = channel(1);
    set_panic_hook(panic_tx);

    let mut interrupt_signal = unix::signal(SignalKind::interrupt()).unwrap();
    let mut terminate_signal = unix::signal(SignalKind::terminate()).unwrap();

    tokio::select! {
        _ = panic_rx.recv() => { eprintln!("child thread panic, quit.") },
        _ = interrupt_signal.recv() => { eprintln!("interrupt signal received, quit.") },
        _ = terminate_signal.recv() => { eprintln!("terminate signal received, quit.") },
    }
}

fn set_panic_hook(panic_tx: Sender<()>) {
    std::panic::set_hook(Box::new(move |info: &PanicHookInfo| {
        panic_log(info);
        panic_tx
            .blocking_send(())
            .expect("panic_receiver is dropped");
    }));
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
