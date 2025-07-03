use crate::bindings::{AssetReserves, MTokenManager};
use crate::chain_config::ChainConfig;
use anyhow::{anyhow, Result};
use ethers::{prelude::*, signers::Wallet, types::U256};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::broadcast::Receiver;
use tracing::{error, info};
#[derive(Debug)]
pub struct Refunder {
    pub hub_wallet: Wallet<k256::ecdsa::SigningKey>,
    pub spoke_wallets: HashMap<u32, Wallet<k256::ecdsa::SigningKey>>,
    pub chain_config: ChainConfig,
    pub spoke_receiver: Receiver<(u32, Address, Address, U256)>,
    pub hub_receiver: Receiver<(Address, Address, U256)>,
}

impl Refunder {
    pub async fn new(
        private_key: &str,
        chain_config: ChainConfig,
        spoke_receiver: Receiver<(u32, Address, Address, U256)>,
        hub_receiver: Receiver<(Address, Address, U256)>,
    ) -> Result<Self> {
        let mut key_orig = private_key;
        if private_key.starts_with("0x") {
            key_orig = key_orig.strip_prefix("0x").unwrap();
        }
        let private_key_bytes = hex::decode(key_orig)?;
        let hub_wallet =
            Wallet::from_bytes(&private_key_bytes)?.with_chain_id(chain_config.arcadia_chain_id);
        let mut spoke_wallets = HashMap::new();
        for chain_id in chain_config.get_chain_ids() {
            let spoke_wallet =
                Wallet::from_bytes(&private_key_bytes)?.with_chain_id(chain_id as u64);
            spoke_wallets.insert(chain_id, spoke_wallet);
        }

        Ok(Self {
            hub_wallet,
            spoke_wallets,
            chain_config,
            spoke_receiver,
            hub_receiver,
        })
    }

    pub async fn start(&mut self) -> Result<()> {
        loop {
            tokio::select! {
                Ok((chain_id, user_address, token, amount)) = self.spoke_receiver.recv() => {
                    info!("received spoke refund event: {:?}", (chain_id, user_address, token, amount));

                    match self.refund_from_asset_reserves(chain_id, user_address, token, amount).await {
                        Ok(_) => {
                            info!("Refund from asset reserves successful for user {:?}, token {:?}, and amount {:?}", user_address, token, amount);
                        }
                        Err(e) => {
                            error!("Error refunding from asset reserves on chain {:?}: {}", chain_id, e);
                        }
                    }
                }
                Ok((user_address, token, amount)) = self.hub_receiver.recv() => {
                    match self.refund_from_mtoken_manager(user_address, token, amount).await {
                        Ok(_) => {
                            info!("Refund from mtoken manager successful for user {:?}, mtoken {:?}, and amount {:?}", user_address, token, amount);
                        }
                        Err(e) => {
                            error!("Error refunding from mtoken manager: {}", e);
                        }
                    }
                }

            }
        }
    }

    async fn refund_from_asset_reserves(
        &self,
        chain_id: u32,
        user_address: Address,
        token: Address,
        amount: U256,
    ) -> Result<TxHash> {
        info!(
            "running refund from asset reserves for chain id: {:?}",
            chain_id
        );
        let rpc_url = self
            .chain_config
            .get_rpc_url(chain_id)
            .ok_or(anyhow!("Invalid chain ID: No RPC URL found"))?;

        let contract_address = self
            .chain_config
            .get_asset_reserves_address(chain_id)
            .ok_or(anyhow!(
                "Invalid chain ID: No AssetReserves contract address found"
            ))?;

        let provider = Provider::<Http>::try_from(rpc_url.clone())?
            .interval(std::time::Duration::from_secs(10));
        let spoke_wallet = self
            .spoke_wallets
            .get(&chain_id)
            .ok_or(anyhow!("Invalid chain ID: No spoke wallet found"))?;
        let client = SignerMiddleware::new(provider.clone(), spoke_wallet.clone());
        let contract = AssetReserves::new(contract_address.parse::<Address>()?, Arc::new(client));

        let tx = contract.refund_user(user_address, token, amount);
        let pending_tx = tx.send().await?;
        let receipt = pending_tx
            .await?
            .ok_or_else(|| anyhow!("Transaction receipt not found"))?;

        info!(
            "Refund from AssetReserves successful: {:?}",
            receipt.transaction_hash
        );
        Ok(receipt.transaction_hash)
    }

    async fn refund_from_mtoken_manager(
        &self,
        user_address: Address,
        mtoken: Address,
        amount: U256,
    ) -> Result<TxHash> {
        info!("running refund from hub mtoken manager.");
        let arcadia_rpc_url = self.chain_config.get_arcadia_rpc_url();

        let contract_address = self.chain_config.get_mtoken_manager_address();

        let provider = Provider::<Http>::try_from(arcadia_rpc_url.clone())?
            .interval(std::time::Duration::from_secs(10));
        let client = SignerMiddleware::new(provider.clone(), self.hub_wallet.clone());
        let contract = MTokenManager::new(contract_address.parse::<Address>()?, Arc::new(client));

        let tx = contract.refund_user(user_address, mtoken, amount);
        let pending_tx = tx.send().await?;
        let receipt = pending_tx
            .await?
            .ok_or_else(|| anyhow!("Transaction receipt not found"))?;

        info!(
            "Refund from MTokenManager successful: {:?}",
            receipt.transaction_hash
        );
        Ok(receipt.transaction_hash)
    }
}
