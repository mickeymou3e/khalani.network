use crate::chain_config::ChainConfig;
use std::str::FromStr;
// use crate::refunder::Refunder;
use anyhow::{anyhow, Result};
use ethers::prelude::*;
// use ethers::types::{Log, H256}
use futures_util::StreamExt;
use tracing::{error, info, warn};
// use std::any;
// use std::collections::HashMap;
// use std::sync::Arc;
use tokio::sync::broadcast::Sender;

#[derive(Clone, Debug)]
pub struct EventListener {
    pub chain_config: ChainConfig,
    // pub refunder: Arc<Refunder>,
    pub sender: Sender<(u32, Address, Address, U256)>,
}

impl EventListener {
    pub fn new(chain_config: ChainConfig, sender: Sender<(u32, Address, Address, U256)>) -> Self {
        Self {
            chain_config,
            sender,
        }
    }

    pub async fn start(&mut self) -> Result<()> {
        let mut handles = Vec::new();
        for chain_id in self.chain_config.get_chain_ids() {
            let tx_clone = self.sender.clone();
            let spoke_ws_url = self.chain_config.get_ws_url(chain_id).unwrap().clone();
            let spoke_contract_address = self
                .chain_config
                .get_asset_reserves_address(chain_id)
                .ok_or(anyhow!(
                    "No AssetReserves address configured for this chain"
                ))?
                .parse::<Address>()?;
            let hub_rpc_url = self.chain_config.get_arcadia_rpc_url().clone();
            let hub_contract_address = self
                .chain_config
                .get_mtoken_manager_address()
                .parse::<Address>()?;
            info!("Starting event listener for chain {}", chain_id);
            let handle = tokio::spawn(async move {
                let spoke_provider = Provider::<Ws>::connect(spoke_ws_url).await.unwrap();

                let spoke_filter = Filter::new()
                    .from_block(BlockNumber::Latest)
                    .address(spoke_contract_address)
                    .event("AssetDeposited(address,address,uint256)");
                let mut stream = spoke_provider.subscribe_logs(&spoke_filter).await?;
                info!("listening to log updates. chain id {}", chain_id);
                while let Some(event_log) = stream.next().await.take() {
                    info!("received log update for chain {}", chain_id);
                    let token: Address = event_log.topics[1].into();
                    let depositor: Address = event_log.topics[2].into();
                    let amount: U256 = U256::from_big_endian(&event_log.data.0);
                    let hub_provider = Provider::<Http>::connect(&hub_rpc_url).await;

                    let duration = tokio::time::Duration::from_secs(300);
                    let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(10));
                    let elapsed = tokio::time::Instant::now();
                    let mut found_logs = false;
                    while elapsed.elapsed() < duration {
                        let last_block = hub_provider
                            .get_block(BlockNumber::Latest)
                            .await?
                            .unwrap()
                            .number
                            .unwrap();
                        let hub_filter = Filter::new()
                            .from_block(last_block - 100)
                            .address(hub_contract_address)
                            .event("MTokenMinted(address,bytes32,uint256)");
                        info!(
                            "polling hub logs from block {} to block {}",
                            last_block - 100,
                            last_block
                        );
                        let hub_logs = hub_provider
                            .get_logs(&hub_filter)
                            .await
                            .map_err(|e| anyhow!("Failed to get hub logs: {}", e))?;
                        info!("polled hub logs: {:?}", hub_logs);
                        if !hub_logs.is_empty() {
                            found_logs = true;
                            break;
                        }

                        interval.tick().await;
                    }
                    if found_logs {
                        info!("Deposit successful, skipping");
                    } else {
                        info!("Deposit failed, refunding");
                        tx_clone.send((chain_id, depositor, token, amount))?;
                    }
                }
                info!("connection closed for chain id {}", chain_id);
                Ok::<(), anyhow::Error>(())
            });
            handles.push(handle);
        }
        futures::future::try_join_all(handles).await.unwrap();
        Ok(())
    }

    // pub async fn listen(
    //     &self,
    //     chain_id: u32,
    //     sender: &Sender<(u32, Address, Address, U256)>,
    // ) -> Result<()> {
    //     let ws_url = self
    //         .chain_config
    //         .get_ws_url(chain_id)
    //         .ok_or(anyhow!("No WebSocket URL configured for this chain"))?;

    //     let contract_address = self
    //         .chain_config
    //         .get_asset_reserves_address(chain_id)
    //         .ok_or(anyhow!(
    //             "No AssetReserves address configured for this chain"
    //         ))?
    //         .parse::<Address>()?;

    //     let provider = Provider::<Ws>::connect(ws_url).await?;
    //     let provider = Arc::new(provider);

    //     let filter = Filter::new().address(contract_address).event(
    //         "AssetDeposited(address indexed token, address indexed depositor, uint256 amount)",
    //     );

    //     let mut stream = provider.subscribe_logs(&filter).await?;
    //     info!("Listening for AssetDeposited events on chain {}", chain_id);

    //     while let Some(event_log) = stream.next().await {
    //         let token: Address = event_log.topics[1].into();
    //         let depositor: Address = event_log.topics[2].into();
    //         let amount: U256 = U256::from_big_endian(&event_log.data.0);

    //         info!(
    //             "New AssetDeposited Event - Token: {:?}, Depositor: {:?}, Amount: {:?}",
    //             token, depositor, amount
    //         );

    //         if let Some(tx_hash) = event_log.transaction_hash {
    //             match self
    //                 .api_client
    //                 .get_hyperlane_status(&tx_hash.to_string())
    //                 .await
    //             {
    //                 Ok(status) if status == "failed" => {
    //                     if let Err(e) = self
    //                         .refunder
    //                         .refund_from_asset_reserves(chain_id, depositor, token, amount)
    //                         .await
    //                     {
    //                         error!("Failed to refund user: {:?}", e);
    //                     } else {
    //                         info!("Successfully refunded user: {:?}", depositor);
    //                     }
    //                 }
    //                 Ok(_) => {
    //                     info!("Hyperlane transaction successful, skipping refund.");
    //                 }
    //                 Err(e) => error!("Failed to get Hyperlane status: {:?}", e),
    //             }
    //         }
    //     }

    //     Ok(())
    // }
}
