use anyhow::{Context, Result};
use ethers::prelude::LocalWallet;
use std::env;
use std::path::Path;

use crate::config::{self, Config};
use crate::connectors::Connector;

// https://sepolia.etherscan.io/address/0x18F814fA6CB21cC51ae0C5594418766F17DFb6A9
// https://testnet.snowtrace.io/address/0x18F814fA6CB21cC51ae0C5594418766F17DFb6A9
pub const E2E_PRIVATE_KEY_HEX: &str =
    "0x4f91dd71525e3acf4b83ffb493d16e5ed9bcdea36e8076eb3d74f361ae7dc0ff";

pub async fn create_connector() -> Result<Connector> {
    let wallet: LocalWallet = E2E_PRIVATE_KEY_HEX
        .parse::<LocalWallet>()
        .context("Failed to parse private key")?;

    let config: Config = create_e2e_config()?;
    let connector = Connector::new(config, config::wallet::WalletSigner::Local(wallet)).await?;
    Ok(connector)
}
pub fn create_e2e_config() -> Result<Config> {
    let paths = [
        &env::var("CONFIG_FILE").unwrap_or_default(),
        "../config/.local.config.json",
        "./config/.local.config.json",
        "../config/config.json",
        "./config/config.json",
    ];

    let config_path = paths
        .iter()
        .find(|&&path| !path.is_empty() && Path::new(path).exists())
        .context("No config file path exists")?;

    Config::read_config(config_path)
        .context(format!("Failed to read config from file: {}", config_path))
}
