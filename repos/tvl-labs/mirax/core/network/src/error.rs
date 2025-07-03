use std::convert::Infallible;

use libp2p::swarm::DialError;
use mirax_error::impl_into_mirax_error;
use smol_str::SmolStr;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum NetworkError {
    #[error("Message Handler: {0}")]
    MessageHandler(SmolStr),
    #[error("Router: {0}")]
    Router(SmolStr),
    #[error("RpcCall: {0}")]
    RpcCall(SmolStr),
    #[error("SendMessage: {0}")]
    SendMessage(SmolStr),
    #[error("Peer: {0}")]
    Peer(SmolStr),
    #[error(transparent)]
    DialError(#[from] DialError),
    #[error(transparent)]
    Hex(#[from] faster_hex::Error),
    #[error(transparent)]
    Ed25519(#[from] libp2p::identity::DecodingError),
    #[error(transparent)]
    Multiaddr(#[from] libp2p::multiaddr::Error),
    #[error(transparent)]
    TransportError(#[from] libp2p::TransportError<std::io::Error>),
    #[error("infallable")]
    Infallible,
}

impl_into_mirax_error!(NetworkError, Network);

impl From<Infallible> for NetworkError {
    fn from(_err: Infallible) -> Self {
        NetworkError::Infallible
    }
}
