use crate::client::ElClient;
use crate::contract::bls_apk_registry::bls_apk_registry::BLSApkRegistryEvents;
use crate::types::{operator_id_from_g1_pub_key, OperatorPubKeys};

use ethers::contract::EthLogDecode;
use ethers::providers::{Middleware, Provider, StreamExt, Ws};
use ethers::{abi::RawLog, types::Address};

use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::{
    mpsc,
    mpsc::UnboundedSender,
    oneshot::{self, Sender},
};

#[derive(Debug)]
pub struct OperatorInfoServiceInMemory {
    client: Arc<ElClient>,
    web_socket: Arc<Provider<Ws>>,
    pub_keys: UnboundedSender<OperatorsInfoMessage>,
}

#[derive(Debug)]
enum OperatorsInfoMessage {
    InsertOperatorInfo(Address, OperatorPubKeys),
    Remove(Address),
    Get(Address, Sender<Option<OperatorPubKeys>>),
}

impl OperatorInfoServiceInMemory {
    pub async fn new(client: Arc<ElClient>, web_socket: Arc<Provider<Ws>>) -> Self {
        let (pubkeys_tx, mut pubkeys_rx) = mpsc::unbounded_channel();

        let mut operator_info_data = HashMap::new();

        let mut operator_addr_to_id = HashMap::new();

        tokio::spawn(async move {
            while let Some(cmd) = pubkeys_rx.recv().await {
                match cmd {
                    OperatorsInfoMessage::InsertOperatorInfo(addr, keys) => {
                        operator_info_data.insert(addr, keys.clone());
                        let operator_id = operator_id_from_g1_pub_key(keys.g1_pub_key);
                        operator_addr_to_id.insert(addr, operator_id);
                    }
                    OperatorsInfoMessage::Remove(addr) => {
                        operator_info_data.remove(&addr);
                    }
                    OperatorsInfoMessage::Get(addr, responder) => {
                        let result = operator_info_data.get(&addr).cloned();
                        let _ = responder.send(result);
                    }
                }
            }
        });

        Self {
            client,
            web_socket,
            pub_keys: pubkeys_tx,
        }
    }

    pub async fn start_service(&self) {
        // query past operator registrations
        self.query_past_registered_operator_events_and_fill_db()
            .await;

        let filter = self
            .client
            .get_new_pub_key_registration_filter(self.web_socket.clone())
            .await;

        let mut subcription_new_operator_registration_stream =
            self.web_socket.subscribe_logs(&filter).await.unwrap();

        while let Some(log) = subcription_new_operator_registration_stream.next().await {
            let data = BLSApkRegistryEvents::decode_log(&RawLog::from(log)).unwrap();

            match data {
                BLSApkRegistryEvents::NewPubkeyRegistrationFilter(pubkeyreg) => {
                    let operator_pub_key = OperatorPubKeys {
                        g1_pub_key: pubkeyreg.pubkey_g1,
                        g2_pub_key: pubkeyreg.pubkey_g2,
                    };
                    // send message
                    let _ = self.pub_keys.send(OperatorsInfoMessage::InsertOperatorInfo(
                        pubkeyreg.operator,
                        operator_pub_key,
                    ));
                }
                _ => {}
            }
        }
    }

    pub async fn get_operator_info(&self, address: Address) -> Option<OperatorPubKeys> {
        let (responder_tx, responder_rx) = oneshot::channel();
        let _ = self
            .pub_keys
            .send(OperatorsInfoMessage::Get(address, responder_tx));
        responder_rx.await.unwrap_or(None)
    }

    pub async fn query_past_registered_operator_events_and_fill_db(&self) {
        // Assuming ethers rs fetches data from first block . Have to validate this .
        let (operator_address, operator_pub_keys) = self
            .client
            .query_existing_registered_operator_pub_keys(None, None)
            .await
            .unwrap();

        for (i, address) in operator_address.iter().enumerate() {
            // let mut pub_keys  = map.lock().unwrap();
            let message =
                OperatorsInfoMessage::InsertOperatorInfo(*address, operator_pub_keys[i].clone());
            let _ = self.pub_keys.send(message);
        }
    }
}
