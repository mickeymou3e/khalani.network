use libp2p::PeerId;
use mirax_codec::{Bcs, BinaryCodec};
use mirax_primitive::{Bytes, MiraxResult};
use serde::{Deserialize, Serialize};
use smol_str::{format_smolstr, SmolStr};

use crate::traits::{MessageCodec, TopicMessage};

#[derive(Debug)]
pub enum OutboundMessage {
    Broadcast(TransmitMessage),
    Multicast {
        peer_ids: Vec<PeerId>,
        msg: TransmitMessage,
    },
    Unicast {
        peer_id: PeerId,
        msg: TransmitMessage,
    },
    RpcCall {
        peer_id: PeerId,
        msg: TransmitMessage,
    },
    RpcResponse {
        peer_id: PeerId,
        msg: TransmitMessage,
    },
}

#[derive(Debug)]
pub struct PeerTransmitMessage {
    pub peer_id: PeerId,
    pub data: TransmitMessage,
}

impl PeerTransmitMessage {
    pub fn new(peer_id: PeerId, data: TransmitMessage) -> Self {
        PeerTransmitMessage { peer_id, data }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TransmitMessage(Bytes);

impl From<Bytes> for TransmitMessage {
    fn from(data: Bytes) -> Self {
        TransmitMessage(data)
    }
}

impl From<TransmitMessage> for Vec<u8> {
    fn from(msg: TransmitMessage) -> Vec<u8> {
        msg.0.into()
    }
}

impl TransmitMessage {
    pub fn from_vec(data: Vec<u8>) -> Self {
        TransmitMessage(data.into())
    }

    pub fn topic_id(&self) -> u8 {
        self.0[0]
    }

    pub fn decode<T: MessageCodec>(&self) -> MiraxResult<T> {
        Bcs::<_>::decode(&self.0[1..])
    }

    pub fn build<M: TopicMessage>(msg: M) -> MiraxResult<Self> {
        let mut data: Vec<u8> = Bcs::<_>::encode(&msg)?.into();
        data.insert(0, M::topic_id());
        Ok(TransmitMessage(data.into()))
    }

    pub fn build_rpc_request<Req: TopicMessage>(id: RpcId, req: Req) -> MiraxResult<Self> {
        let req = RpcRequest { id, payload: req };
        let mut data: Vec<u8> = Bcs::<_>::encode(&RpcPayload::Request(req))?.into();
        data.insert(0, Req::topic_id());

        Ok(TransmitMessage(data.into()))
    }

    pub fn build_rpc_response<T: TopicMessage, R: MessageCodec>(
        id: RpcId,
        result: MiraxResult<R>,
    ) -> MiraxResult<Self> {
        let result = match result {
            Ok(r) => Ok(Bcs::<R>::encode(&r)?),
            Err(e) => Err(format_smolstr!("{:?}", e)),
        };
        let resp = RpcPayload::<T>::Response(RpcResponse { id, result });

        let mut data: Vec<u8> = Bcs::<_>::encode(&resp)?.into();
        data.insert(0, T::topic_id());

        Ok(TransmitMessage(data.into()))
    }
}

#[derive(Serialize, Deserialize, Eq, PartialEq, Hash, Debug, Clone, Copy)]
pub struct RpcId(pub u16);

#[derive(Serialize, Deserialize)]
pub struct RpcRequest<T> {
    pub id: RpcId,
    pub payload: T,
}

#[derive(Serialize, Deserialize)]
pub struct RpcResponse {
    pub id: RpcId,
    pub result: Result<Bytes, SmolStr>,
}

#[derive(Serialize, Deserialize)]
pub enum RpcPayload<T> {
    Request(RpcRequest<T>),
    Response(RpcResponse),
}
