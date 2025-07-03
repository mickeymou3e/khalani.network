use std::sync::{
    atomic::{AtomicU64, Ordering::SeqCst},
    Arc,
};

use async_trait::async_trait;
use libp2p::PeerId;
use mirax_codec::{Bcs, BinaryCodec};
use mirax_primitive::MiraxResult;
use serde::{Deserialize, Serialize};
use tokio::sync::{
    mpsc::{Receiver, Sender},
    RwLock,
};

use crate::{
    event_loop::router::{MessageRouter, RouterContext, RpcCallResponse},
    protocols::transmit::types::TransmitMessage,
    traits::{
        Gossip, MessageCodec, MessageHandler, MessageKind, NetworkPeer, RpcCall, TopicMessage,
    },
};

#[derive(Clone)]
struct TestConnection {
    tx: Sender<TransmitMessage>,
    rx: Arc<RwLock<Receiver<TransmitMessage>>>,
}

impl TestConnection {
    fn make() -> (TestConnection, TestConnection) {
        let (tx1, rx1) = tokio::sync::mpsc::channel(100);
        let (tx2, rx2) = tokio::sync::mpsc::channel(100);
        let conn1 = TestConnection {
            tx: tx1,
            rx: Arc::new(RwLock::new(rx2)),
        };
        let conn2 = TestConnection {
            tx: tx2,
            rx: Arc::new(RwLock::new(rx1)),
        };

        (conn1, conn2)
    }

    async fn send(&self, msg: TransmitMessage) {
        self.tx.send(msg).await.unwrap();
    }

    async fn recv(&self) -> Option<TransmitMessage> {
        let mut rx = self.rx.write().await;
        rx.recv().await
    }
}

#[derive(Clone)]
struct TestNode {
    conn: Arc<TestConnection>,
    topic: Arc<AtomicU64>,
    router: MessageRouter,
}

impl TestNode {
    fn new(conn: TestConnection) -> Self {
        let router = MessageRouter::default();
        let topic = Arc::new(AtomicU64::new(0));
        router
            .register_topic_handler(NewTopicHandler {
                topic: topic.clone(),
            })
            .unwrap();
        router
            .register_topic_handler(GetTopicHandler {
                topic: topic.clone(),
            })
            .unwrap();

        TestNode {
            conn: Arc::new(conn),
            topic,
            router,
        }
    }

    async fn recv_msg(&self) {
        let ctx = RouterContext {
            peer_id: RandomPeerId.peer_id(),
            rpc_call_map: self.router.rpc_call_map(),
            rpc_call_resp: Arc::new(self.conn.clone()),
        };
        if let Some(msg) = self.conn.recv().await {
            self.router.route_msg(ctx, msg).await.unwrap();
        }
    }
}

#[derive(Default)]
pub struct RandomPeerId;

impl NetworkPeer for RandomPeerId {
    fn peer_id(&self) -> PeerId {
        use once_cell::sync::Lazy;
        static PEER_ID: Lazy<PeerId> = Lazy::new(PeerId::random);

        *PEER_ID
    }
}

impl Gossip for TestNode {
    async fn broadcast<M: TopicMessage>(&self, msg: M) -> MiraxResult<()> {
        let msg = TransmitMessage::build(msg)?;
        self.conn.send(msg).await;
        Ok(())
    }

    async fn unicast<M, P>(&self, _peer: &P, _msg: M) -> MiraxResult<()>
    where
        M: TopicMessage,
        P: NetworkPeer,
    {
        unimplemented!()
    }

    async fn multicast<'a, M, Iter, P>(&self, _peers: Iter, _msg: M) -> MiraxResult<()>
    where
        Iter: IntoIterator<Item = &'a P> + Send + Sync,
        M: TopicMessage,
        P: NetworkPeer + 'a,
    {
        unimplemented!()
    }
}

impl RpcCall for TestNode {
    async fn call<Peer, Req, Resp>(&self, peer: &Peer, req: Req) -> MiraxResult<Resp>
    where
        Peer: NetworkPeer,
        Req: TopicMessage,
        Resp: MessageCodec,
    {
        let (rpc_id, rx) = self.router.rpc_call_map().insert_new_call(peer.peer_id());

        let msg = TransmitMessage::build_rpc_request(rpc_id, req)?;
        self.conn.send(msg).await;

        Bcs::decode(&rx.await.unwrap()?)
    }
}

#[async_trait]
impl RpcCallResponse for Arc<TestConnection> {
    async fn response(&self, _peer_id: &PeerId, resp: TransmitMessage) -> MiraxResult<()> {
        self.send(resp).await;

        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
struct NewTopic {
    topic: u64,
}

impl TopicMessage for NewTopic {
    fn topic_id() -> u8 {
        0
    }

    fn topic() -> &'static str {
        "new topic"
    }
}

struct NewTopicHandler {
    topic: Arc<AtomicU64>,
}

impl MessageHandler for NewTopicHandler {
    type Message = NewTopic;
    type Response = ();

    fn kind() -> MessageKind {
        MessageKind::OneWay
    }

    async fn handle(&self, msg: Self::Message) -> MiraxResult<()> {
        self.topic.store(msg.topic, SeqCst);
        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
struct GetTopic {}

impl TopicMessage for GetTopic {
    fn topic_id() -> u8 {
        1
    }

    fn topic() -> &'static str {
        "get topic"
    }
}

struct GetTopicHandler {
    topic: Arc<AtomicU64>,
}

impl MessageHandler for GetTopicHandler {
    type Message = GetTopic;
    type Response = u64;

    fn kind() -> MessageKind {
        MessageKind::RequestResponse
    }

    async fn handle(&self, _msg: Self::Message) -> MiraxResult<Self::Response> {
        Ok(self.topic.load(SeqCst))
    }
}

#[cfg(test)]
mod tests {
    use std::sync::atomic::Ordering;

    use crate::traits::{
        demo::{GetTopic, NewTopic, RandomPeerId, TestConnection, TestNode},
        Gossip, RpcCall,
    };

    #[tokio::test]
    async fn test_network_broadcast() {
        let (conn1, conn2) = TestConnection::make();
        let node1 = TestNode::new(conn1);
        let node2 = TestNode::new(conn2);
        assert_eq!(node1.topic.load(Ordering::SeqCst), 0);
        assert_eq!(node2.topic.load(Ordering::SeqCst), 0);

        node1.broadcast(NewTopic { topic: 2 }).await.unwrap();
        node2.recv_msg().await;

        assert_eq!(node2.topic.load(Ordering::SeqCst), 2);
    }

    #[tokio::test]
    async fn test_network_rpc_call() {
        let (conn1, conn2) = TestConnection::make();
        let node1 = TestNode::new(conn1);
        let node2 = TestNode::new(conn2);
        assert_eq!(node1.topic.load(Ordering::SeqCst), 0);
        assert_eq!(node2.topic.load(Ordering::SeqCst), 0);

        node1.broadcast(NewTopic { topic: 2 }).await.unwrap();
        node2.recv_msg().await;

        assert_eq!(node2.topic.load(Ordering::SeqCst), 2);

        let node1_clone = node1.clone();
        let node2_clone = node2.clone();
        tokio::spawn(async move { node1_clone.recv_msg().await });
        tokio::spawn(async move { node2_clone.recv_msg().await });

        let topic: u64 = node1.call(&RandomPeerId, GetTopic {}).await.unwrap();
        assert_eq!(topic, 2);
    }
}
