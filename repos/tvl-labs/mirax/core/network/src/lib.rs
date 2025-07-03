pub mod builder;
pub mod client;
pub mod config;
pub mod error;
pub mod traits;

mod event_loop;
mod protocols;

use smol_str::format_smolstr;
use traits::NetworkPeer;

pub use builder::NetworkBuilder;

pub struct Network {
    config: config::Config,
    keypair: libp2p::identity::Keypair,
    pubkey: libp2p::identity::ed25519::PublicKey,
    swarm: libp2p::Swarm<event_loop::Behaviour>,
    outbound_queue: std::sync::Arc<event_loop::OutboundQueue>,
    router: event_loop::router::MessageRouter,
}

impl Network {
    pub fn client(&self) -> client::NetworkClient {
        client::NetworkClient {
            outbound_queue: std::sync::Arc::clone(&self.outbound_queue),
            router: self.router.clone(),
        }
    }

    pub fn pubkey(&self) -> mirax_crypto::ed25519::Ed25519PublicKey {
        mirax_crypto::ed25519::Ed25519PublicKey::try_from(self.pubkey.to_bytes().as_slice())
            .expect("impossible")
    }

    pub fn start(mut self) -> mirax_primitive::MiraxResult<event_loop::EventLoop> {
        log::info!("[Network] Node start listening and dialing");

        fn listen_and_dial(network: &mut Network) -> Result<(), error::NetworkError> {
            let ipv4 = format_smolstr!("/ip4/0.0.0.0/udp/{}/quic-v1", network.config.listen_port);
            let ipv6 = format_smolstr!("/ip6/::1/udp/{}/quic-v1", network.config.listen_port);

            network.swarm.listen_on(ipv4.parse()?)?;
            network.swarm.listen_on(ipv6.parse()?)?;

            for bootstrap_addr in network.config.bootstrap.iter() {
                network.swarm.dial(bootstrap_addr.to_owned())?;
            }

            Ok(())
        }

        listen_and_dial(&mut self)?;

        Ok(event_loop::EventLoop::new(self))
    }
}

/// Only support **Ed25519** public key in Mirax.
impl<T: mirax_crypto::PublicKey> NetworkPeer for T {
    fn peer_id(&self) -> libp2p::PeerId {
        use libp2p::identity::{self, ed25519};

        let pk = identity::PublicKey::from(
            ed25519::PublicKey::try_from_bytes(&self.as_bytes()).expect("impossible"),
        );

        pk.into()
    }
}
