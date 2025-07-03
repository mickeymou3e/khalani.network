use std::sync::{
    atomic::{AtomicU16, Ordering},
    Arc,
};

use async_trait::async_trait;
use dashmap::DashMap;
use libp2p::PeerId;
use mirax_primitive::{Bytes, MiraxResult};
use smol_str::format_smolstr;
use tokio::sync::oneshot;

use crate::{
    error::NetworkError,
    protocols::transmit::types::{RpcId, RpcPayload, TransmitMessage},
    traits::{MessageHandler, MessageKind, TopicMessage},
};

#[derive(Clone, Default)]
pub struct MessageRouter {
    topic_handlers: Arc<DashMap<u8, Arc<dyn TransmitMessageHandler>>>,
    rpc_call_map: Arc<RpcCallMap>,
}

impl MessageRouter {
    pub fn register_topic_handler<H>(&self, handler: H) -> MiraxResult<()>
    where
        H: MessageHandler + 'static,
    {
        let topic_id = <H::Message>::topic_id();
        let topic = <H::Message>::topic();
        let handler = TopicMessageHandler { handler };

        if self.topic_handlers.contains_key(&topic_id) {
            let err_msg = format_smolstr!("topic {} handler has registered", topic);
            return Err(NetworkError::Router(err_msg).into());
        }

        self.topic_handlers.insert(topic_id, Arc::new(handler));

        Ok(())
    }

    pub fn get_topic_handler(
        &self,
        msg: &TransmitMessage,
    ) -> Option<Arc<dyn TransmitMessageHandler>> {
        self.topic_handlers
            .get(&msg.topic_id())
            .map(|h| Arc::clone(&*h))
    }

    pub async fn route_msg(&self, ctx: RouterContext, msg: TransmitMessage) -> MiraxResult<()> {
        let handler = self.get_topic_handler(&msg).ok_or({
            let err_msg = format_smolstr!("unknown topic {}", msg.topic_id());
            NetworkError::Router(err_msg)
        })?;

        handler.handle(&ctx, &msg).await
    }

    pub fn rpc_call_map(&self) -> Arc<RpcCallMap> {
        Arc::clone(&self.rpc_call_map)
    }
}

#[derive(PartialEq, Eq, Hash, Clone)]
pub struct RpcCallKey {
    pub peer_id: PeerId,
    pub rpc_id: RpcId,
}

pub struct RpcCallMap {
    pub next_rpc_id: AtomicU16,
    pub map: DashMap<RpcCallKey, oneshot::Sender<MiraxResult<Bytes>>>,
}

impl Default for RpcCallMap {
    fn default() -> Self {
        Self {
            next_rpc_id: AtomicU16::new(1),
            map: Default::default(),
        }
    }
}

impl RpcCallMap {
    pub fn insert_new_call(
        &self,
        peer_id: PeerId,
    ) -> (RpcId, oneshot::Receiver<MiraxResult<Bytes>>) {
        let (tx, rx) = oneshot::channel();
        let rpc_id = RpcId(self.next_rpc_id.fetch_add(1, Ordering::SeqCst));

        let key = RpcCallKey { peer_id, rpc_id };
        self.map.insert(key, tx);

        (rpc_id, rx)
    }

    pub fn take_call(
        &self,
        peer_id: PeerId,
        rpc_id: RpcId,
    ) -> Option<oneshot::Sender<MiraxResult<Bytes>>> {
        let key = RpcCallKey { peer_id, rpc_id };
        self.map.remove(&key).map(|(_, tx)| tx)
    }
}

pub struct RouterContext {
    pub peer_id: PeerId,
    pub rpc_call_resp: Arc<dyn RpcCallResponse>,
    pub rpc_call_map: Arc<RpcCallMap>,
}

#[async_trait]
pub trait RpcCallResponse: Send + Sync {
    async fn response(&self, peer_id: &PeerId, resp: TransmitMessage) -> MiraxResult<()>;
}
// FIXME: https://github.com/rust-lang/impl-trait-utils/issues/31
#[async_trait]
pub trait TransmitMessageHandler: Send + Sync {
    async fn handle(&self, ctx: &RouterContext, msg: &TransmitMessage) -> MiraxResult<()>;
}

struct TopicMessageHandler<H: MessageHandler> {
    handler: H,
}

#[async_trait]
impl<H: MessageHandler> TransmitMessageHandler for TopicMessageHandler<H> {
    async fn handle(&self, ctx: &RouterContext, msg: &TransmitMessage) -> MiraxResult<()> {
        let kind = <H as MessageHandler>::kind();
        match kind {
            MessageKind::OneWay => {
                let msg = msg.decode::<<H as MessageHandler>::Message>()?;
                self.handler.handle(msg).await?;
                Ok(())
            }
            MessageKind::RequestResponse => {
                use RpcPayload::*;

                let payload = msg.decode::<RpcPayload<<H as MessageHandler>::Message>>()?;
                match payload {
                    Request(req) => {
                        let result = self.handler.handle(req.payload).await;
                        let resp = TransmitMessage::build_rpc_response::<
                            <H as MessageHandler>::Message,
                            _,
                        >(req.id, result)?;
                        ctx.rpc_call_resp.response(&ctx.peer_id, resp).await
                    }
                    Response(resp) => {
                        let call_map = &ctx.rpc_call_map;
                        let ret_tx =
                            { call_map.take_call(ctx.peer_id, resp.id) }.ok_or_else(|| {
                                let err = format_smolstr!("rpc {:?} cache miss, timeout?", resp.id);
                                NetworkError::RpcCall(err)
                            })?;

                        let result = resp.result.map_err(|e| NetworkError::RpcCall(e).into());
                        ret_tx.send(result).map_err(|err| {
                            let err_msg = format_smolstr!("rpc send result {:?}", err);
                            NetworkError::RpcCall(err_msg).into()
                        })
                    }
                }
            }
        }
    }
}
