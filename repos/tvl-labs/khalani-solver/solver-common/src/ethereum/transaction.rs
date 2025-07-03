use crate::config::chain::ChainId;
use crate::connectors::RpcClient;
use anyhow::{anyhow, Result};
use ethers::abi::Detokenize;
use ethers::prelude::ContractCall;
use ethers::types::TransactionReceipt;
use std::time::Duration;
use tracing::{debug, info};

// Inspired by https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/rust/chains/hyperlane-ethereum/src/tx.rs
pub async fn submit_transaction<D: Detokenize>(
    mut transaction: ContractCall<RpcClient, D>,
) -> Result<TransactionReceipt> {
    debug!(?transaction.tx, "Dispatching transaction");
    if let Some(chain_id) = transaction.tx.chain_id() {
        if chain_id.as_u32() == Into::<u32>::into(ChainId::Khalani) {
            transaction.tx.set_gas_price(8);
            transaction.tx.set_gas(7000000);
        }
    }

    let dispatched_transaction = transaction.send().await?;
    let tx_hash = dispatched_transaction.tx_hash();
    info!(?tx_hash, "Dispatched transaction");
    let timeout = Duration::from_secs(300);
    match tokio::time::timeout(timeout, dispatched_transaction).await {
        // all good
        Ok(Ok(Some(receipt))) => {
            info!(?tx_hash, "Confirmed transaction");
            Ok(receipt)
        }
        // ethers-rs will return None if it can no longer poll for the tx in the mempool
        Ok(Ok(None)) => Err(anyhow!("Transaction {} dropped from the mempool", tx_hash)),
        // Received error, pass it through
        Ok(Err(error)) => Err(anyhow!(
            "Failed to wait for the receipt of {} {}",
            tx_hash,
            error
        )),
        // Timed out
        Err(_) => Err(anyhow!(
            "Timed out waiting for the transaction receipt {}",
            tx_hash
        )),
    }
}
