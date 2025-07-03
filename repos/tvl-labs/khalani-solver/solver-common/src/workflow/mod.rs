use anyhow::{anyhow, Result};
use artemis_core::engine::Engine;
use tracing::info;

pub mod action_confirmation_collector;
pub mod collector_filter_map;

pub async fn run_engine<Event, Action>(engine: Engine<Event, Action>) -> Result<()>
where
    Event: Send + Clone + 'static + std::fmt::Debug,
    Action: Send + Clone + 'static + std::fmt::Debug,
{
    let mut set = engine.run().await.map_err(|e| anyhow!("{e}"))?;
    if let Some(res) = set.join_next().await {
        info!("task completed: {:?}", res);
    }
    info!("aborting all tasks");
    set.abort_all();
    while let Some(res) = set.join_next().await {
        info!("task completed: {:?}", res);
    }
    Ok(())
}
