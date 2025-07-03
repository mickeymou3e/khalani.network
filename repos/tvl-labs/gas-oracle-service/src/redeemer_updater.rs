use ethers::prelude::*;
use ethers::types::{Address, U256};
use reqwest;
use serde::Deserialize;
use std::path::Path;
use std::str::FromStr;
use std::{convert::TryFrom, fs, sync::Arc};
use tokio::time::interval;

abigen!(
    EthAipRedeemer,
    r#"[
        function s_aipEthRate() view returns (uint256)
        function setAipEthRate(uint256 rate) external
    ]"#,
);

#[derive(Deserialize, Debug, Clone)]
pub struct RedeemerConfig {
    pub name: String,
    pub chain_id: u64,
    pub rpc_url: String,
    pub redeemer_address: String,
    pub private_key: String,
    pub baselineAipEthRate: String,
    pub baselineEthPrice: f64,
}

#[derive(Deserialize, Debug)]
pub struct RedeemerServiceConfig {
    pub redeemer: RedeemerConfig,
    pub update_threshold: f64,
    pub interval_minutes: u64,
}

async fn fetch_current_eth_price() -> Result<f64, Box<dyn std::error::Error>> {
    let response = reqwest::get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    )
    .await?;
    let json: serde_json::Value = response.json().await?;
    let price = json["ethereum"]["usd"]
        .as_f64()
        .ok_or("Failed to parse ETH price")?;
    Ok(price)
}

fn calculate_new_rate(
    baseline_rate: U256,
    current_eth_price: f64,
    baseline_eth_price: f64,
) -> U256 {
    // new_rate = baseline_rate * (current_eth_price / baseline_eth_price)
    let multiplier = current_eth_price / baseline_eth_price;
    // Scale multiplier by 10,000 to preserve precision
    let scale: u64 = 10_000;
    let multiplier_scaled = (multiplier * scale as f64).round() as u64;
    baseline_rate * multiplier_scaled / U256::from(scale)
}

pub async fn run_redeemer_update_once(
    config: &RedeemerServiceConfig,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n=== Starting Redeemer Updater Routine ===");
    if let Err(e) =
        update_redeemer_rate(&config.redeemer, config.update_threshold).await
    {
        eprintln!("Error updating rate for {}: {:?}", config.redeemer.name, e);
    }
    println!("=== Redeemer Updater Routine Completed ===\n");
    Ok(())
}

pub async fn update_redeemer_rate(
    config: &RedeemerConfig,
    update_threshold: f64,
) -> Result<(), Box<dyn std::error::Error>> {
    let current_eth_price = fetch_current_eth_price().await?;
    println!("[{}] Current ETH Price: ${}", config.name, current_eth_price);

    let baseline_rate = U256::from_dec_str(&config.baselineAipEthRate)?;
    let new_rate = calculate_new_rate(baseline_rate, current_eth_price, config.baselineEthPrice);
    println!("[{}] Calculated new AIP/ETH rate: {}", config.name, new_rate);

    let provider = Provider::<Http>::try_from(config.rpc_url.trim())?;
    let wallet: LocalWallet = config.private_key.trim().parse()?;
    let wallet = wallet.with_chain_id(config.chain_id);
    let client = SignerMiddleware::new(provider, wallet);
    let client = Arc::new(client);

    let redeemer_address =
        Address::from_str(config.redeemer_address.trim_start_matches("0x"))?;
    let redeemer_contract = EthAipRedeemer::new(redeemer_address, client.clone());

    let current_onchain_rate: U256 = redeemer_contract.s_aip_eth_rate().call().await?;
    println!("[{}] On-chain AIP/ETH rate: {}", config.name, current_onchain_rate);

    let current_onchain_rate_u64 = current_onchain_rate.as_u64();
    let new_rate_u64 = new_rate.as_u64();
    let diff = if current_onchain_rate_u64 > 0 {
        ((new_rate_u64 as i64 - current_onchain_rate_u64 as i64).abs() as f64)
            / (current_onchain_rate_u64 as f64)
    } else {
        1.0
    };
    println!("[{}] Rate difference: {:.2}%", config.name, diff * 100.0);

    if diff > update_threshold {
        println!("[{}] Updating AIP/ETH rate to: {}", config.name, new_rate);
        let set_rate_call = redeemer_contract.set_aip_eth_rate(new_rate);
        let tx_future = set_rate_call.send();
        let tx = tx_future.await?;
        let receipt = tx.await?;
        if let Some(receipt) = receipt {
            println!(
                "[{}] Update transaction hash: {:?}",
                config.name, receipt.transaction_hash
            );
        }
    } else {
        println!(
            "[{}] No update needed; rate difference within threshold.",
            config.name
        );
    }
    Ok(())
}