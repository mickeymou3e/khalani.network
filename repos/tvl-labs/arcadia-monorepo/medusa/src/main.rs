mod balance_monitor;

use std::fs;
use std::panic::PanicHookInfo;
use std::path::Path;
use std::sync::Arc;
use std::time::Duration;

use alloy::providers::ProviderBuilder;
use backtrace::Backtrace;
use balance_monitor::BalanceMonitor;
use medusa_api::run_rpc_server;
use medusa_apm::run_metrics_server;
use medusa_config::MedusaConfig;
use medusa_tx_worker::ChainService;
use tokio::signal::unix::{self, SignalKind};
use tokio::sync::broadcast;
use tokio::sync::mpsc::{Sender, channel};

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
    let config_path_arg = std::env::args().nth(1).expect("No argument provided");

    let config_path = Path::new(&config_path_arg);
    let config: MedusaConfig = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )
    .expect("Error parsing config file");

    let wallet = config.to_wallet().await.unwrap();
    let medusa_signer_address = wallet.default_signer().address();
    let provider = ProviderBuilder::default()
        .with_recommended_fillers()
        .wallet(wallet)
        .connect_http(config.arcadia_url.parse().unwrap());

    let (ws_tx, _ws_rx) = broadcast::channel(100);
    let storage_service = medusa_storage::connect(&config.db_path)
        .await
        .unwrap()
        .build()
        .await
        .unwrap();
    tokio::spawn(
        storage_service
            .clone()
            .poll_process_expired_intents(Duration::from_secs(10)),
    );
    let chain_config = config.make_chain_config().to_chain_config();
    let provider = Arc::new(provider);
    let chain_service = ChainService::new(
        Arc::clone(&provider),
        storage_service.clone(),
        chain_config.intent_book,
        chain_config.m_token_manager,
        chain_config.receipt_manager,
        chain_config.gas_price,
    )
    .await;

    run_rpc_server(
        medusa_signer_address,
        config.medusa_rpc_url(),
        config.medusa_ws_url(),
        chain_service,
        storage_service.clone(),
        ws_tx,
    )
    .await;

    // Update at least once so that the metrics make sense when the metrics
    // server starts.
    if let Err(e) = storage_service.update_all_metrics().await {
        tracing::warn!("Error updating metrics: {e:#}");
    }
    // Default scrape interval is 15 seconds (in the default config file).
    // TODO: make this configurable.
    storage_service.spawn_update_metrics_task(Duration::from_secs(15));

    tokio::spawn(async move {
        BalanceMonitor::new(chain_config.m_tokens, provider)
            .run()
            .await;
    });

    run_metrics_server(config.apm_url.parse().unwrap());

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
