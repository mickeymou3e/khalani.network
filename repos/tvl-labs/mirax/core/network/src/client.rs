use std::sync::Arc;

use mirax_codec::{Bcs, BinaryCodec};
use mirax_primitive::MiraxResult;
use smol_str::format_smolstr;

use crate::{
    error::NetworkError,
    event_loop::{router::MessageRouter, OutboundQueue},
    protocols::transmit::types::{OutboundMessage, TransmitMessage},
    traits::{Gossip, MessageCodec, NetworkPeer, RpcCall, TopicMessage},
};

pub struct NetworkClient {
    pub(crate) outbound_queue: Arc<OutboundQueue>,
    pub(crate) router: MessageRouter,
}

impl Gossip for NetworkClient {
    async fn broadcast<M>(&self, msg: M) -> MiraxResult<()>
    where
        M: TopicMessage,
    {
        if self.outbound_queue.is_full() {
            return Err(NetworkError::SendMessage(format_smolstr!("queue is full")).into());
        }

        let msg = TransmitMessage::build(msg)?;

        let _ = self.outbound_queue.push(OutboundMessage::Broadcast(msg));

        Ok(())
    }
    async fn unicast<M, P>(&self, peer: &P, msg: M) -> MiraxResult<()>
    where
        M: TopicMessage,
        P: NetworkPeer,
    {
        if self.outbound_queue.is_full() {
            return Err(NetworkError::SendMessage(format_smolstr!("queue is full")).into());
        }

        let peer_id = peer.peer_id();
        let msg = TransmitMessage::build(msg)?;

        let _ = self
            .outbound_queue
            .push(OutboundMessage::Unicast { peer_id, msg });

        Ok(())
    }

    async fn multicast<'a, M, Iter, P>(&self, peers: Iter, msg: M) -> MiraxResult<()>
    where
        Iter: IntoIterator<Item = &'a P> + Send + Sync,
        M: TopicMessage,
        P: NetworkPeer + 'a,
    {
        if self.outbound_queue.is_full() {
            return Err(NetworkError::SendMessage(format_smolstr!("queue is full")).into());
        }

        let peer_ids = peers.into_iter().map(|p| p.peer_id()).collect();
        let msg = TransmitMessage::build(msg)?;

        let _ = self
            .outbound_queue
            .push(OutboundMessage::Multicast { peer_ids, msg });

        Ok(())
    }
}

impl RpcCall for NetworkClient {
    async fn call<Peer, Req, Resp>(&self, peer: &Peer, req: Req) -> MiraxResult<Resp>
    where
        Peer: NetworkPeer,
        Req: TopicMessage,
        Resp: MessageCodec,
    {
        let peer_id = peer.peer_id();

        let (rpc_id, rx) = self.router.rpc_call_map().insert_new_call(peer_id);

        let msg = TransmitMessage::build_rpc_request(rpc_id, req)?;
        let _ = self
            .outbound_queue
            .push(OutboundMessage::RpcCall { peer_id, msg });

        Bcs::decode(&rx.await.unwrap()?)
    }
}
