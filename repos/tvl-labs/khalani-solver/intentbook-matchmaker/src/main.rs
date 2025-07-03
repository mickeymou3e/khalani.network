use anyhow::Result;
use artemis_core::engine::Engine;
use intentbook_matchmaker::workflow::action::Action;
use intentbook_matchmaker::workflow::engine::configure_engine;
use intentbook_matchmaker::workflow::event::Event;
use intentbook_matchmaker::workflow::state::in_memory_state_manager::InMemoryStateManager;
use solver_common::config::args::Args;
use solver_common::connectors::Connector;
use solver_common::diagnostics::logs::configure_logs;
use solver_common::inventory::Inventory;
use solver_common::workflow::run_engine;
use std::sync::Arc;
use tracing::info;

#[tokio::main]
async fn main() -> Result<()> {
    configure_logs();
    info!("Starting Intentbook Matchmaker");

    let (config, wallet) = Args::get_config_and_wallet().await?;

    let state_manager = InMemoryStateManager::new();

    let connector = Connector::new(config.clone(), wallet).await?;
    let connector = Arc::new(connector);
    let inventory = Inventory::new(config.clone(), connector.clone()).await?;
    let _inventory = Arc::new(inventory);

    // Set up engine.
    let engine: Engine<Event, Action> = configure_engine(&config, connector.clone(), state_manager);

    // Start engine.
    run_engine(engine).await?;

    Ok(())
}
