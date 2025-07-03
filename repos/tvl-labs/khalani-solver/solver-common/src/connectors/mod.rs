use std::collections::HashMap;
use std::sync::Arc;

use anyhow::{anyhow, Context, Result};
use ethers::middleware::{MiddlewareBuilder, NonceManagerMiddleware, SignerMiddleware};
use ethers::providers::{Http, Middleware, Provider, Ws};
use ethers::signers::Signer;
use ethers::types::Address;

use crate::config::chain::{ChainConfig, ChainId};
use crate::config::wallet::WalletSigner;
use crate::config::Config;
use crate::error::ChainError;

pub type RpcClient = SignerMiddleware<NonceManagerMiddleware<Provider<Http>>, WalletSigner>;
pub type WsClient = Provider<Ws>;

#[derive(Debug, Clone)]
pub struct Connector {
    address: Address,
    rpc_clients: HashMap<ChainId, Arc<RpcClient>>,
    ws_clients: HashMap<ChainId, Arc<WsClient>>,
}

impl Connector {
    pub fn get_address(&self) -> Address {
        self.address
    }

    pub fn get_rpc_client(&self, chain_id: ChainId) -> Result<Arc<RpcClient>, ChainError> {
        self.rpc_clients
            .get(&chain_id)
            .cloned()
            .ok_or(ChainError::ClientNotFound(chain_id.into()))
    }

    pub fn get_ws_client(&self, chain_id: ChainId) -> Option<Arc<WsClient>> {
        self.ws_clients.get(&chain_id).cloned()
    }
}

impl Connector {
    pub async fn new(config: Config, signer: WalletSigner) -> Result<Self> {
        let mut rpc_clients: HashMap<ChainId, Arc<RpcClient>> = HashMap::new();
        let mut ws_clients: HashMap<ChainId, Arc<WsClient>> = HashMap::new();
        for chain_config in &config.chains {
            let rpc_client = Self::create_rpc_client(chain_config, signer.clone()).await?;
            rpc_clients.insert(chain_config.chain_id, rpc_client);

            if !chain_config.ws_url.is_empty() {
                let ws_client = Self::create_ws_client(chain_config)
                    .await
                    .context(ChainError::FailedCreateWebsocket(chain_config.name.clone()))?;
                ws_clients.insert(chain_config.chain_id, ws_client);
            }
        }
        Ok(Connector {
            address: signer.address(),
            rpc_clients,
            ws_clients,
        })
    }

    async fn create_rpc_client(
        chain_config: &ChainConfig,
        signer: WalletSigner,
    ) -> Result<Arc<RpcClient>> {
        let client = Provider::<Http>::try_from(chain_config.rpc_url.clone())
            .context(ChainError::FailedCreateClient(chain_config.name.clone()))?;
        let chain_id = client.get_chainid().await?.as_u32();
        if chain_id != Into::<u32>::into(chain_config.chain_id) {
            return Err(anyhow!(
                "Chain {} has chain ID '{}' but the configuration set '{}'",
                chain_config.name,
                chain_id,
                chain_config.chain_id
            ));
        }
        let signer = signer.with_chain_id(chain_id);
        let address = signer.address();
        let client: RpcClient = client.nonce_manager(address).with_signer(signer);
        Ok(Arc::new(client))
    }

    async fn create_ws_client(chain_config: &ChainConfig) -> Result<Arc<WsClient>> {
        let ws_client: WsClient = Provider::<Ws>::connect(chain_config.ws_url.clone()).await?;
        Ok(Arc::new(ws_client))
    }
}
