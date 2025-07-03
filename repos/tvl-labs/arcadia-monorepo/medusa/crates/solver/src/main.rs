mod matchmaker;
mod solver;

use std::fs;
use std::path::Path;

use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use solver::Solver;
use tracing::{error, info};

#[derive(Default, Debug, Serialize, Deserialize)]
struct SolverConfig {
    key: String,
    medusa_url: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();
    dotenv().ok();
    let arg = std::env::args().nth(1).expect("No argument provided");
    let config_path = Path::new(&arg);
    let config: SolverConfig = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )
    .expect("Error parsing config file");

    let solver = Solver::new(config.medusa_url, config.key)
        .await
        .map_err(|e| {
            error!("Error creating solver: {:?}", e);
        })
        .unwrap();
    let running = solver.get_running_state();
    let (shutdown_tx, shutdown_rx) = tokio::sync::oneshot::channel();

    tokio::spawn(async move {
        let timeout = tokio::time::Duration::from_secs(5);
        if let Ok(()) = tokio::signal::ctrl_c().await {
            match tokio::time::timeout(timeout, running.lock()).await {
                Ok(mut running) => {
                    *running = false;
                    info!("Shutdown signal received, initiating graceful shutdown...");
                    let _ = shutdown_tx.send(());
                }
                Err(_) => {
                    error!("Shutdown signal timed out, forcing shutdown...");
                    std::process::exit(1);
                }
            }
        }
    });

    // ctrlc_async::set_async_handler(async move {
    //     let timeout = tokio::time::Duration::from_secs(5);
    //     match tokio::time::timeout(timeout, running.lock()).await {
    //         Ok(mut running) => {
    //             *running = false;
    //             info!("Shutdown signal received, initiating graceful shutdown...");
    //             tokio::time::sleep(Duration::from_millis(100)).await;
    //         }
    //         Err(_) => {
    //             error!("Shutdown signal timed out, forcing shutdown...");
    //             std::process::exit(1);
    //         }
    //     }
    // })
    // .expect("Error setting up shutdown handler.");

    tokio::select! {
        _ = shutdown_rx => {
            info!("Shutdown signal received, shutting down...");
        }
        result = solver.run() => {
            if let Err(e) = result {
                error!("Error running solver: {:?}", e);
                std::process::exit(1);
            }
        }
    }
}
