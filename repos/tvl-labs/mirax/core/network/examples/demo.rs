use std::sync::Arc;

use mirax_config::{NetworkConfig, PeerAddress};
use mirax_network::{
    traits::{
        Gossip, MessageCompression, MessageHandler, MessageKind, MessagePriority, RpcCall,
        TopicMessage,
    },
    NetworkBuilder,
};
use mirax_primitive::MiraxResult;
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use tracing_subscriber::filter::LevelFilter;
use tracing_subscriber::prelude::*;

#[tokio::main]
async fn main() -> MiraxResult<()> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(
            tracing_subscriber::EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .init();

    let (node1, store) = {
        let store = Arc::new(Store {
            block_height: RwLock::new(0),
        });
        let new_block_height_handler = NewBlockHeightHandler {
            store: Arc::clone(&store),
        };
        let get_block_height_handler = GetBlockHeightHandler {
            store: Arc::clone(&store),
        };

        let config = NetworkConfig {
            listen_port: 8111,
            ..Default::default()
        };

        let node = NetworkBuilder::new(config)
            .register_message_handler(new_block_height_handler)?
            .register_message_handler(get_block_height_handler)?
            .build_with_random_sk()?;

        (node, store)
    };

    let node2 = {
        let store = Arc::new(Store {
            block_height: RwLock::new(0),
        });
        let new_block_height_handler = NewBlockHeightHandler {
            store: Arc::clone(&store),
        };
        let get_block_height_handler = GetBlockHeightHandler {
            store: Arc::clone(&store),
        };
        let config = NetworkConfig {
            listen_port: 8112,
            bootstrap: vec![PeerAddress::new(("127.0.0.1".parse().unwrap(), 8111), None)],
        };

        NetworkBuilder::new(config)
            .register_message_handler(new_block_height_handler)?
            .register_message_handler(get_block_height_handler)?
            .build_with_random_sk()
            .unwrap()
    };

    let node3 = {
        let store = Arc::new(Store {
            block_height: RwLock::new(0),
        });
        let new_block_height_handler = NewBlockHeightHandler {
            store: Arc::clone(&store),
        };
        let get_block_height_handler = GetBlockHeightHandler {
            store: Arc::clone(&store),
        };
        let config = NetworkConfig {
            listen_port: 8113,
            bootstrap: vec![PeerAddress::new(("127.0.0.1".parse().unwrap(), 8111), None)],
        };

        NetworkBuilder::new(config)
            .register_message_handler(new_block_height_handler)?
            .register_message_handler(get_block_height_handler)?
            .build_with_random_sk()
            .unwrap()
    };

    let node2_client = node2.client();
    let node1_pubkey = node1.pubkey();
    let node3_pubkey = node3.pubkey();

    tokio::spawn(node1.start().unwrap());
    tokio::spawn(node2.start().unwrap());
    tokio::spawn(node3.start().unwrap());

    tokio::time::sleep(std::time::Duration::from_secs(5)).await;

    node2_client.broadcast(NewBlockHeight(99)).await.unwrap();

    let block_height: u64 = { node2_client.call(&node1_pubkey, GetBlockHeight {}).await }.unwrap();
    assert_eq!(block_height, 99);
    assert_eq!(*store.block_height.read().await, 99);

    let node3_block_height: u64 =
        { node2_client.call(&node3_pubkey, GetBlockHeight {}).await }.unwrap();
    assert_eq!(node3_block_height, 99);

    Ok(())
}

struct Store {
    block_height: RwLock<u64>,
}

#[derive(Serialize, Deserialize)]
struct NewBlockHeight(u64);

impl TopicMessage for NewBlockHeight {
    fn topic_id() -> u8 {
        0
    }

    fn topic() -> &'static str {
        "new block height"
    }

    fn compression() -> MessageCompression {
        MessageCompression::None
    }
}

struct NewBlockHeightHandler {
    store: Arc<Store>,
}

impl MessageHandler for NewBlockHeightHandler {
    type Message = NewBlockHeight;
    type Response = ();

    fn kind() -> MessageKind {
        MessageKind::OneWay
    }

    async fn handle(&self, msg: Self::Message) -> MiraxResult<Self::Response> {
        *self.store.block_height.write().await = msg.0;
        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
struct GetBlockHeight {}

impl TopicMessage for GetBlockHeight {
    fn topic_id() -> u8 {
        1
    }

    fn topic() -> &'static str {
        "get block height"
    }

    fn priority() -> MessagePriority {
        MessagePriority::High
    }
}

struct GetBlockHeightHandler {
    store: Arc<Store>,
}

impl MessageHandler for GetBlockHeightHandler {
    type Message = GetBlockHeight;
    type Response = u64;

    fn kind() -> MessageKind {
        MessageKind::RequestResponse
    }

    async fn handle(&self, _msg: Self::Message) -> MiraxResult<Self::Response> {
        Ok(*self.store.block_height.read().await)
    }
}
