mod aggregator;
mod task_subscriber;

use el_sdk::client::ElClient;
use el_sdk::client::ElConfig;
use ethers::signers::LocalWallet;
use ethers::types::H160;

use std::str::FromStr;
use std::sync::Arc;

use crate::aggregator::Aggregator;
use crate::task_subscriber::TaskSubscriber;

#[tokio::main]
async fn main() {
    let builder = ElConfig {
        eth_http_url: "http://localhost:8545".try_into().unwrap(),
        eth_ws_url: "http://localhost:8545".try_into().unwrap(),
        bls_apk_registry_addr: Default::default(),
        operator_registry_addr: Default::default(),
        registry_coordinator_addr: H160::from_str("0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690")
            .unwrap(),
        avs_name: "".to_string(),
        from_metrics_ip_port_address: "http://localhost:8545".try_into().unwrap(),
        sender: H160::from_str("0x860B6912C2d0337ef05bbC89b0C2CB6CbAEAB4A5").unwrap(),
        private_key: "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80".to_string(),
    };

    let client = ElClient::init(builder.clone()).await.unwrap();
    let task_sub = TaskSubscriber::new(client.clone(), client.registry_coordinator_addr).await;
    let aggregator = Aggregator::new(
        Arc::new(client),
        LocalWallet::from_bytes(&hex::decode(builder.private_key).unwrap()).unwrap(),
        builder.eth_ws_url,
    );

    tokio::spawn(task_sub.run());
    tokio::spawn(aggregator.run());
}
