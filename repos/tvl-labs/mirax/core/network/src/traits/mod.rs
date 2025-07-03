use libp2p::PeerId;
use mirax_primitive::MiraxResult;
use serde::{de::DeserializeOwned, Serialize};

#[cfg(test)]
mod demo;

#[trait_variant::make(Send + Sync)]
pub trait MessageCodec: Serialize + DeserializeOwned {}
impl<T: Serialize + DeserializeOwned + Send + Sync> MessageCodec for T {}

pub trait NetworkPeer: Send + Sync {
    fn peer_id(&self) -> PeerId;
}

pub enum MessageCompression {
    None,
    Zstd,
}

pub enum MessagePriority {
    Normal,
    High,
}

pub trait TopicMessage: MessageCodec {
    fn topic_id() -> u8;
    fn topic() -> &'static str;

    fn compression() -> MessageCompression {
        MessageCompression::Zstd
    }

    fn priority() -> MessagePriority {
        MessagePriority::Normal
    }
}

// TODO: context
#[trait_variant::make(Send + Sync)]
pub trait Gossip {
    async fn broadcast<M: TopicMessage>(&self, msg: M) -> MiraxResult<()>;

    async fn unicast<M: TopicMessage, P: NetworkPeer>(&self, peer: &P, msg: M) -> MiraxResult<()>;

    async fn multicast<'a, M, Iter, P>(&self, peers: Iter, msg: M) -> MiraxResult<()>
    where
        Iter: IntoIterator<Item = &'a P> + Sync + Send,
        M: TopicMessage,
        P: NetworkPeer + 'a;
}

#[trait_variant::make(Send + Sync)]
pub trait RpcCall {
    async fn call<Peer, Req, Resp>(&self, peer: &Peer, req: Req) -> MiraxResult<Resp>
    where
        Peer: NetworkPeer,
        Req: TopicMessage,
        Resp: MessageCodec;
}

pub enum MessageKind {
    OneWay,
    RequestResponse,
}

#[trait_variant::make(Send + Sync)]
pub trait MessageHandler {
    type Message: TopicMessage;
    type Response: MessageCodec;

    fn kind() -> MessageKind;

    async fn handle(&self, msg: Self::Message) -> MiraxResult<Self::Response>;
}
