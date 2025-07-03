// Defined codec

use asynchronous_codec::{Framed, LengthCodec};
use libp2p::{
    core::UpgradeInfo,
    futures::{AsyncRead, AsyncWrite},
    InboundUpgrade, OutboundUpgrade, StreamProtocol,
};
use std::{
    convert::Infallible,
    future::{ready, Future},
    pin::Pin,
};

pub const DISCOVERY_PROTOCOL_1_0_0: ProtocolId = ProtocolId {
    protocol: StreamProtocol::new("/mirax/discovery/1.0.0"),
};
pub const DISCOVERY_PROTOCOL_MESSAGE_VERSION: u8 = 0;

#[derive(Debug, Clone)]
pub struct ProtocolConfig {
    pub protocol_ids: Vec<ProtocolId>,
}

impl Default for ProtocolConfig {
    fn default() -> Self {
        Self {
            protocol_ids: vec![DISCOVERY_PROTOCOL_1_0_0],
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct ProtocolId {
    pub protocol: StreamProtocol,
}

impl AsRef<str> for ProtocolId {
    fn as_ref(&self) -> &str {
        self.protocol.as_ref()
    }
}

impl UpgradeInfo for ProtocolConfig {
    type Info = ProtocolId;
    type InfoIter = Vec<Self::Info>;

    fn protocol_info(&self) -> Self::InfoIter {
        self.protocol_ids.clone()
    }
}

impl<TSocket> InboundUpgrade<TSocket> for ProtocolConfig
where
    TSocket: AsyncRead + AsyncWrite + Unpin + Send + 'static,
{
    type Output = Framed<TSocket, DiscoveryCodec>;
    type Error = Infallible;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Output, Self::Error>> + Send>>;

    fn upgrade_inbound(self, socket: TSocket, _info: Self::Info) -> Self::Future {
        Box::pin(ready(Ok(Framed::new(socket, DiscoveryCodec {}))))
    }
}

impl<TSocket> OutboundUpgrade<TSocket> for ProtocolConfig
where
    TSocket: AsyncWrite + AsyncRead + Unpin + Send + 'static,
{
    type Output = Framed<TSocket, DiscoveryCodec>;
    type Error = Infallible;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Output, Self::Error>> + Send>>;

    fn upgrade_outbound(self, socket: TSocket, _protocol_id: Self::Info) -> Self::Future {
        Box::pin(ready(Ok(Framed::new(socket, DiscoveryCodec {}))))
    }
}

pub type DiscoveryCodec = LengthCodec;
