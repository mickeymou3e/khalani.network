use std::sync::Arc;

use anyhow::Result;
use tracing::info;

use cross_chain_market_maker::engine::configure_engine;
use cross_chain_market_maker::state::in_memory::InMemoryStateManager;
use solver_common::config::args::Args;
use solver_common::connectors::Connector;
use solver_common::diagnostics::logs::configure_logs;
use solver_common::inventory::Inventory;
use solver_common::workflow::run_engine;

#[tokio::main]
async fn main() -> Result<()> {
    configure_logs();
    info!("Starting Cross Chain Market Maker");

    let (config, wallet) = Args::get_config_and_wallet().await?;

    let state_manager = InMemoryStateManager::new();

    let connector = Connector::new(config.clone(), wallet).await?;
    let connector = Arc::new(connector);
    let inventory = Inventory::new(config.clone(), connector.clone()).await?;
    let inventory = Arc::new(inventory);

    // Set up engine.
    let engine = configure_engine(&config, state_manager, connector, inventory).await;

    // Start engine.
    run_engine(engine).await?;

    Ok(())
}
