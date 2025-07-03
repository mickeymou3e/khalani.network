use ethers::prelude::*;
use ethers::types::{Address, U256};
#[cfg(feature = "aws")]
use rusoto_kms::KmsClient;
#[cfg(feature = "aws")]
use rusoto_signature::Region;
use serde::Deserialize;
use std::{convert::TryFrom, sync::Arc};
use tokio::time::interval;

abigen!(
    GasAmountOracle,
    r#"[
        function setGasAmount(uint32 sourceChainId, uint32 destinationChainId, uint256 newGasAmount) external
        function gasAmount(uint32, uint32) view returns (uint256)
    ]"#,
);

#[cfg_attr(not(feature = "aws"), derive(Deserialize))]
#[derive(Clone)]
pub struct ChainConfig {
    pub name: String,
    pub chain_id: u64,
    pub role: String,
    pub rpc_url: String,
    pub event_verifier_address: Address,
    pub gas_oracle_address: Address,
    pub mailbox_address: Address,
    #[cfg(feature = "aws")]
    pub aws_region: Region,
    #[cfg(feature = "aws")]
    pub aws_key_id: String,
    #[cfg(feature = "aws")]
    pub aws_secret: KmsClient,
    #[cfg(not(feature = "aws"))]
    pub private_key: String,
    pub baseline_gas_usage: u64,
    pub baseline_gas_price: f64,
}

#[cfg(feature = "aws")]
impl<'de> Deserialize<'de> for ChainConfig {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        #[derive(Deserialize)]
        struct ChainConfigHelper {
            pub name: String,
            pub chain_id: u64,
            pub role: String,
            pub rpc_url: String,
            pub event_verifier_address: Address,
            pub gas_oracle_address: Address,
            pub mailbox_address: Address,
            pub aws_region: Region,
            pub aws_key_id: String,
            pub baseline_gas_usage: u64,
            pub baseline_gas_price: f64,
        }

        let config = ChainConfigHelper::deserialize(deserializer)?;
        let region = config.aws_region.clone();

        Ok(ChainConfig {
            aws_secret: KmsClient::new(region),
            aws_key_id: config.aws_key_id,
            aws_region: config.aws_region,
            baseline_gas_price: config.baseline_gas_price,
            baseline_gas_usage: config.baseline_gas_usage,
            chain_id: config.chain_id,
            event_verifier_address: config.event_verifier_address,
            gas_oracle_address: config.gas_oracle_address,
            mailbox_address: config.mailbox_address,
            name: config.name,
            rpc_url: config.rpc_url,
            role: config.role,
        })
    }
}

#[derive(Deserialize)]
pub struct Config {
    pub chains: Vec<ChainConfig>,
    pub safety_margin: f64,
    pub update_threshold: f64,
    pub interval_minutes: u64,
}


pub async fn run_gas_oracle_update_once(
    config: &Config,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n=== Starting Gas Oracle Update Routine ===");

    for origin in config.chains.iter() {
        for destination in config.chains.iter() {
            if origin.chain_id == destination.chain_id || origin.role == destination.role {
                continue;
            }
            // if origin.role != "spoke" || destination.role != "hub" {
            //     continue;
            // }
            let spoke_to_hub = origin.role == "spoke" && destination.role == "hub";
            let hub_to_spoke = origin.role == "hub"   && destination.role == "spoke";
            if !(spoke_to_hub || hub_to_spoke) {
                continue;
            }
            if let Err(e) = update_gas_for_pair(
                origin,
                destination,
                config.safety_margin,
                config.update_threshold,
            )
            .await
            {
                eprintln!(
                    "Error updating {} -> {}: {:?}",
                    origin.name, destination.name, e
                );
            }
        }
    }
    println!("=== Gas Oracle Update Routine Completed ===\n");
    Ok(())
}

async fn fetch_current_gas_price(
    rpc_url: &str,
) -> Result<f64, Box<dyn std::error::Error>> {
    let provider = Provider::<Http>::try_from(rpc_url)?;
    let gas_price = provider.get_gas_price().await?;
    Ok(gas_price.as_u64() as f64)
}

pub async fn update_gas_for_pair(
    origin: &ChainConfig,
    destination: &ChainConfig,
    safety_margin: f64,
    update_threshold: f64,
) -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "[{} -> {}] Updating gas oracle...",
        origin.name, destination.name
    );
    let baseline_usage = destination.baseline_gas_usage as f64;
    let baseline_price = destination.baseline_gas_price;

    let current_gas_price = fetch_current_gas_price(&destination.rpc_url).await?;
    println!(
        "[{} -> {}] Current gas price: {:.2} wei (baseline: {:.2} wei)",
        origin.name, destination.name, current_gas_price, baseline_price
    );

    let new_usage = baseline_usage * (current_gas_price / baseline_price);
    let adjusted_usage = (new_usage * safety_margin).ceil() as u64;
    let recommended_gas = U256::from(adjusted_usage);
    println!(
        "[{} -> {}] Recommended gas (with margin): {}",
        origin.name, destination.name, recommended_gas
    );

    let provider = Provider::<Http>::try_from(&origin.rpc_url)?;

    #[cfg(feature = "aws")]
    let signer = AwsSigner::new(
        origin.aws_secret.clone(),
        origin.aws_key_id.clone(),
        origin.chain_id,
    )
    .await?;
    #[cfg(not(feature = "aws"))]
    let signer = {
        let wallet: LocalWallet = origin.private_key.parse()?;
        wallet.with_chain_id(origin.chain_id)
    };

    let client = SignerMiddleware::new(provider, signer);
    let client = Arc::new(client);

    let gas_oracle_contract =
        GasAmountOracle::new(origin.gas_oracle_address, client.clone());

    let stored: U256 = gas_oracle_contract
        .gas_amount(origin.chain_id as u32, destination.chain_id as u32)
        .call()
        .await?;
    println!(
        "[{} -> {}] Stored gas in oracle: {}",
        origin.name, destination.name, stored
    );

    let stored_u64 = stored.as_u64();
    let diff = if stored_u64 > 0 {
        (recommended_gas.as_u64() as i64 - stored_u64 as i64).abs() as f64
            / stored_u64 as f64
    } else {
        1.0
    };
    println!(
        "[{} -> {}] Relative difference: {:.2}%",
        origin.name,
        destination.name,
        diff * 100.0
    );

    if diff > update_threshold {
        println!(
            "[{} -> {}] Updating GasAmountOracle to {}...",
            origin.name, destination.name, recommended_gas
        );
        let set_call = gas_oracle_contract.set_gas_amount(
            origin.chain_id as u32,
            destination.chain_id as u32,
            recommended_gas,
        );
        let tx_future = set_call.send();
        let tx = tx_future.await?;
        let receipt = tx.await?;
        if let Some(receipt) = receipt {
            println!(
                "[{} -> {}] Update transaction hash: {:?}, status: {:?}",
                origin.name, destination.name, receipt.transaction_hash, receipt.status
            );
        }
    } else {
        println!(
            "[{} -> {}] No update needed; difference within threshold.",
            origin.name, destination.name
        );
    }
    Ok(())
}