use std::time::Duration;

use libp2p::{
    identity::{ed25519, PublicKey},
    Multiaddr,
};
use mirax_config::NetworkConfig;
use smol_str::format_smolstr;

use crate::error::NetworkError;

pub const DEFAULT_LISTEN_PORT: u16 = 8712;
pub const DEFAULT_RPC_CACHE_SIZE: u64 = 10000;
pub const DEFAULT_RPC_CACHE_TTL_SECS: u64 = 30;
pub const DEFAULT_IDEL_CONNECTION_TIMEOUT_SECS: u64 = 300;
pub const DEFAULT_PROTOCOL_TRANSMIT_MAX_MESSAGE_SIZE: usize = 4098;
pub const DEFAULT_MAX_GLOBAL_OUTBOUND_QUEUE_SIZE: usize = 1024;

pub const DEFAULT_DISCOVERY_INTERVAL: Duration = Duration::from_secs(5 * 60);
pub const DEFAULT_DISCOVERY_RESPONSE_LIMIT: u16 = 40;

pub const DEFAULT_TIMEOUT: Duration = Duration::from_secs(30);
pub const DEFAULT_MAX_PEER_STORE_SIZE: usize = 200;
pub const DEFAULT_MAX_CONNECTED_PEERS: usize = 40;
pub const DEFAULT_MAX_CONN_DIAL_PEERS: usize = 20;

#[derive(Clone, Debug)]
pub(crate) struct Config {
    pub listen_port: u16,
    pub bootstrap: Vec<Multiaddr>,
}

impl TryFrom<NetworkConfig> for Config {
    type Error = NetworkError;

    fn try_from(conf: NetworkConfig) -> Result<Self, Self::Error> {
        let to_multiaddr = { conf.bootstrap.into_iter() }.map(|peer_addr| match peer_addr.pubkey {
            Some(pubkey) => {
                let mut pubkey_bytes = Vec::with_capacity(pubkey.len());
                faster_hex::hex_decode(pubkey.as_bytes(), &mut pubkey_bytes)?;

                let pk = PublicKey::from(ed25519::PublicKey::try_from_bytes(&pubkey_bytes)?);
                let addr = peer_addr.addr.with_p2p(pk.into()).map_err(|addr| {
                    NetworkError::Peer(format_smolstr!("bootstrap addr {} peer mismtach", addr))
                })?;
                Ok::<_, NetworkError>(addr)
            }
            None => Ok(peer_addr.addr),
        });

        let config = Config {
            listen_port: conf.listen_port,
            bootstrap: to_multiaddr.collect::<Result<_, _>>()?,
        };

        Ok(config)
    }
}
