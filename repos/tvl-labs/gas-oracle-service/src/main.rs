mod gas_oracle_updater;
mod redeemer_updater;

use std::{cmp, fs, time::Duration};
use tokio::time::sleep;
use serde_json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Combined Off-Chain Service...");

    let gas_config_data = fs::read_to_string("config.json")?;
    let gas_config: gas_oracle_updater::Config = serde_json::from_str(&gas_config_data)?;

    let redeemer_config_data = fs::read_to_string("redeemer_config.json")?;
    let redeemer_config: redeemer_updater::RedeemerServiceConfig =
        serde_json::from_str(&redeemer_config_data)?;

    let gas_interval = Duration::from_secs(gas_config.interval_minutes * 60);
    let redeemer_interval = Duration::from_secs(redeemer_config.interval_minutes * 60);
    let cycle_interval = cmp::max(gas_interval, redeemer_interval);

    loop {
        if let Err(e) =
            gas_oracle_updater::run_gas_oracle_update_once(&gas_config).await
        {
            eprintln!("Gas Oracle Updater error: {:?}", e);
        }

        if let Err(e) =
            redeemer_updater::run_redeemer_update_once(&redeemer_config).await
        {
            eprintln!("Redeemer Updater error: {:?}", e);
        }

        println!(
            "Sleeping for {:?} before next cycle...\n",
            cycle_interval
        );
        sleep(cycle_interval).await;
    }
}