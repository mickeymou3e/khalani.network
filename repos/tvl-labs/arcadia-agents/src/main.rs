mod api_client;
mod bindings;
mod chain_config;
mod config;
mod event_listener;
mod models;
mod refunder;

use anyhow::Result;
use api_client::ApiClient;
use config::Config;
use event_listener::EventListener;
use refunder::Refunder;
use std::fs;
use std::path::Path;
use toml;

use crate::chain_config::ChainConfig;
use tracing::{error, info};
use tracing_subscriber;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    let config_path_arg = std::env::args().nth(1).expect("No argument provided");
    let config_path = Path::new(&config_path_arg);
    let config: Config = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )?;
    info!("Config loaded. converting to app config");
    let app_config = config.to_app_config().await;
    info!("App config created");

    let chain_config_path_arg = std::env::args().nth(2).expect("No argument provided");
    let chain_config_path = Path::new(&chain_config_path_arg);
    let chain_config: ChainConfig = toml::from_str(
        fs::read_to_string(chain_config_path)
            .expect("Error reading chain config file")
            .as_str(),
    )?;
    info!("Chain config loaded");

    let (hub_sender, hub_receiver) = tokio::sync::broadcast::channel(100);
    let (spoke_sender, spoke_receiver) = tokio::sync::broadcast::channel(100);
    info!("Creating api client");
    let mut api_client = ApiClient::new(app_config.medusa_api_url.clone(), hub_sender);
    info!("Api client created; creating event listener");
    let mut event_listener = EventListener::new(chain_config.clone(), spoke_sender);
    info!("Event listener created");

    info!("Creating refunder");
    let mut refunder = Refunder::new(
        &app_config.key_manager.get_key().await?,
        chain_config.clone(),
        spoke_receiver,
        hub_receiver,
    )
    .await?;
    info!("Refunder created");

    info!("Starting all services");
    let (r1, r2, r3) = tokio::join!(api_client.start(), event_listener.start(), refunder.start());
    if let Err(e) = r1 {
        error!("Api client error: {:?}", e);
    }
    if let Err(e) = r2 {
        error!("Event listener error: {:?}", e);
    }
    if let Err(e) = r3 {
        error!("Refunder error: {:?}", e);
    }
    // let mut refunder = Refunder::new(
    //     &app_config.key_manager.get_key().await?,
    //         chain_config.clone(),
    //     )
    //     .await?,
    // );
    // let event_listener = Arc::new(EventListener::new(
    //     chain_config.clone(),
    //     Arc::clone(&refunder),
    //     Arc::clone(&api_client),
    // ));

    // let api_client_clone = Arc::clone(&api_client);
    // let refunder_clone = Arc::clone(&refunder);

    // tokio::spawn(async move {
    //     loop {
    //         match api_client_clone
    //             .get_failed_intent_histories_since_last_update()
    //             .await
    //         {
    //             Ok(histories) => {
    //                 for (history, intent) in histories {
    //                     if history.error_type.is_none() {
    //                         error!("Intent history has no error type. this should never happen.",);
    //                     } else {
    //                         let error_type = history.error_type.unwrap();
    //                         match error_type {
    //                             IntentErrorType::Withdraw => {
    //                                 let user_address = intent.author;
    //                                 let token = intent.src_m_token;
    //                                 let amount = intent.src_amount;
    //                                 refunder_clone
    //                                     .refund_from_mtoken_manager(user_address, token, amount)
    //                                     .await;
    //                             }
    //                             _ => {
    //                                 info!(
    //                                     "Intent history has error type {:?}. skipping.",
    //                                     error_type
    //                                 );
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //             Err(e) => error!("Failed to fetch intent histories: {:?}", e),
    //         }
    //         tokio::time::sleep(std::time::Duration::from_secs(5)).await;
    //     }
    // });

    // let chains_to_listen = vec![17000, 43113];
    // let mut tasks = vec![];

    // for chain_id in chains_to_listen {
    //     let event_listener_clone = Arc::clone(&event_listener);
    //     tasks.push(tokio::spawn(async move {
    //         if let Err(e) = event_listener_clone.listen(chain_id).await {
    //             error!("Event Listener Error on chain {}: {:?}", chain_id, e);
    //         }
    //     }));
    // }

    // tokio::select! {
    //     _ = join_all(tasks) => {
    //         error!("One of the event listener tasks failed");
    //     }
    //     _ = signal::ctrl_c() => {
    //         info!("Received shutdown signal. Stopping listeners...");
    //     }
    // }

    Ok(())
}
