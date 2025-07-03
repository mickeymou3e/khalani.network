use std::net::IpAddr;

use libp2p::{multiaddr::Protocol, Multiaddr};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PeerAddress {
    pub addr: Multiaddr,
    pub pubkey: Option<String>,
}

impl PeerAddress {
    pub fn new(ip_port: (IpAddr, u16), pubkey: Option<String>) -> Self {
        let mut addr = Multiaddr::empty();

        match ip_port.0 {
            IpAddr::V4(ip) => addr.push(Protocol::Ip4(ip)),
            IpAddr::V6(ip) => addr.push(Protocol::Ip6(ip)),
        };
        addr.push(Protocol::Udp(ip_port.1));
        addr.push(Protocol::QuicV1);

        PeerAddress { addr, pubkey }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NetworkConfig {
    pub listen_port: u16,
    pub bootstrap: Vec<PeerAddress>,
}

impl Default for NetworkConfig {
    fn default() -> Self {
        Self {
            listen_port: 8712,
            bootstrap: Default::default(),
        }
    }
}
