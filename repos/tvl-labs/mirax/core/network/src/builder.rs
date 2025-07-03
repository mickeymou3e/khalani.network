use std::time::Duration;

use libp2p::{
    identity::{self, ed25519},
    SwarmBuilder,
};
use mirax_config::NetworkConfig;
use mirax_crypto::{ed25519::Ed25519PrivateKey, PrivateKey};
use mirax_primitive::MiraxResult;
use mirax_signal::ShutdownRx;

use crate::{
    config::{self, Config},
    error::NetworkError,
    event_loop::{self, router::MessageRouter},
    traits::MessageHandler,
    Network,
};

#[derive(Default)]
pub struct NetworkBuilder {
    config: NetworkConfig,
    shutdown_rx: Option<ShutdownRx>,
    router: MessageRouter,
}

impl NetworkBuilder {
    pub fn new(config: NetworkConfig) -> Self {
        NetworkBuilder {
            config,
            shutdown_rx: None,
            router: Default::default(),
        }
    }

    pub fn with_config(mut self, config: NetworkConfig) -> Self {
        self.config = config;
        self
    }

    pub fn with_grateful_shutdown(mut self, shutdown_rx: ShutdownRx) -> Self {
        self.shutdown_rx = Some(shutdown_rx);
        self
    }

    pub fn register_message_handler<H>(self, handler: H) -> MiraxResult<Self>
    where
        H: MessageHandler + 'static,
    {
        self.router.register_topic_handler(handler)?;
        Ok(self)
    }

    pub fn build(self, sk: &Ed25519PrivateKey) -> MiraxResult<Network> {
        fn inner_build(
            config: Config,
            router: MessageRouter,
            sk: &Ed25519PrivateKey,
        ) -> Result<Network, NetworkError> {
            log::info!("[Network] Building network with config: {:?}", config);

            let keypair: ed25519::Keypair =
                ed25519::SecretKey::try_from_bytes(&mut sk.as_bytes().to_vec())?.into();
            let pubkey = keypair.public();
            let keypair: identity::Keypair = keypair.into();

            let swarm = SwarmBuilder::with_existing_identity(keypair.clone())
                .with_tokio()
                .with_quic()
                .with_behaviour(event_loop::Behaviour::new)?
                .with_swarm_config(|cfg| {
                    cfg.with_idle_connection_timeout(Duration::from_secs(
                        config::DEFAULT_IDEL_CONNECTION_TIMEOUT_SECS,
                    ))
                })
                .build();

            let outbound_queue = Default::default();

            let network = Network {
                config,
                keypair,
                pubkey,
                swarm,
                outbound_queue,
                router,
            };

            Ok::<_, NetworkError>(network)
        }

        let config = Config::try_from(self.config)?;

        Ok(inner_build(config, self.router, sk)?)
    }

    pub fn build_with_random_sk(self) -> MiraxResult<Network> {
        use libp2p::identity::ed25519::Keypair;

        let keypair = Keypair::generate();
        let sk = Ed25519PrivateKey::try_from(keypair.to_bytes().as_slice())?;

        self.build(&sk)
    }
}
