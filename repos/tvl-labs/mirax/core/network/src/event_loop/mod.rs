use std::{
    future::Future,
    ops::Deref,
    pin::Pin,
    sync::Arc,
    task::{Context, Poll},
};

use async_trait::async_trait;
use crossbeam::queue::ArrayQueue;
use libp2p::{
    core::ConnectedPoint,
    futures::{FutureExt, StreamExt},
    identify, ping,
    swarm::{NetworkBehaviour, SwarmEvent},
    PeerId, Swarm,
};
use mirax_primitive::MiraxResult;
use tracing::{error, info};

use crate::{
    config::{self, Config},
    protocols::{
        discovery::{self, protocol::DISCOVERY_PROTOCOL_MESSAGE_VERSION, types::DiscoveryMessage},
        transmit::{
            self,
            types::{OutboundMessage, PeerTransmitMessage, TransmitMessage},
        },
        MIRAX_PROTOCOL_VERSION,
    },
    Network,
};

use self::{
    peer_manager::PeerManager,
    router::{RouterContext, RpcCallResponse},
};

pub mod peer_manager;
pub mod router;

#[derive(NetworkBehaviour)]
pub struct Behaviour {
    ping: ping::Behaviour,
    transmit: transmit::Behaviour,
    identify: identify::Behaviour,
    discovery: discovery::Behaviour,
}

impl Behaviour {
    pub fn new(key_pair: &libp2p::identity::Keypair) -> Self {
        let identify_config = {
            let protocol_version = MIRAX_PROTOCOL_VERSION.to_string();
            identify::Config::new(protocol_version, key_pair.public())
        };

        Behaviour {
            ping: Default::default(),
            transmit: Default::default(),
            identify: identify::Behaviour::new(identify_config),
            discovery: discovery::Behaviour::new(key_pair.clone()),
        }
    }
}

pub struct EventLoop {
    #[allow(dead_code)]
    config: Config,
    pub swarm: Swarm<Behaviour>,
    pub outbound_queue: Arc<OutboundQueue>,
    pub router: router::MessageRouter,
    pub peer_manager: peer_manager::PeerManager,
}

impl EventLoop {
    pub fn new(network: Network) -> Self {
        Self {
            config: network.config,
            swarm: network.swarm,
            outbound_queue: network.outbound_queue,
            router: network.router,
            peer_manager: PeerManager::new(network.keypair),
        }
    }

    fn send_outbound_msg(&self) {
        if self.swarm.connected_peers().count().eq(&0) {
            return;
        }

        loop {
            if self.swarm.behaviour().transmit.outbound_queue.is_full() {
                return;
            }

            let msg = match self.outbound_queue.pop() {
                Some(msg) => msg,
                None => return,
            };
            tracing::debug!("outbound msg {:?}", msg);

            match msg {
                OutboundMessage::Broadcast(msg) => {
                    let msgs: Vec<_> = self
                        .swarm
                        .connected_peers()
                        .map(|peer_id| PeerTransmitMessage::new(*peer_id, msg.clone()))
                        .collect();

                    // FIXME: partial boradcast
                    let transmit_outbount_queue =
                        Arc::clone(&self.swarm.behaviour().transmit.outbound_queue);
                    for msg in msgs.into_iter() {
                        if !(transmit_outbount_queue.is_full()) {
                            let _ = transmit_outbount_queue.push(msg);
                        }
                    }
                }
                OutboundMessage::Multicast { peer_ids, msg } => {
                    let msgs: Vec<_> = peer_ids
                        .into_iter()
                        .map(|peer_id| PeerTransmitMessage::new(peer_id, msg.clone()))
                        .collect();

                    // FIXME: partial boradcast
                    let transmit_outbount_queue =
                        Arc::clone(&self.swarm.behaviour().transmit.outbound_queue);
                    for msg in msgs.into_iter() {
                        if !(transmit_outbount_queue.is_full()) {
                            let _ = transmit_outbount_queue.push(msg);
                        }
                    }
                }
                OutboundMessage::Unicast { peer_id, msg } => {
                    let transmit_outbount_queue =
                        Arc::clone(&self.swarm.behaviour().transmit.outbound_queue);
                    let _ = transmit_outbount_queue.push(PeerTransmitMessage::new(peer_id, msg));
                }
                OutboundMessage::RpcCall { peer_id, msg } => {
                    let transmit_outbount_queue =
                        Arc::clone(&self.swarm.behaviour().transmit.outbound_queue);
                    let _ = transmit_outbount_queue.push(PeerTransmitMessage::new(peer_id, msg));
                }
                OutboundMessage::RpcResponse { peer_id, msg } => {
                    let transmit_outbount_queue =
                        Arc::clone(&self.swarm.behaviour().transmit.outbound_queue);
                    let _ = transmit_outbount_queue.push(PeerTransmitMessage::new(peer_id, msg));
                }
            }
        }
    }
}

impl Future for EventLoop {
    type Output = MiraxResult<()>;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        tracing::debug!(
            "{} connected peers {}",
            self.swarm.local_peer_id(),
            self.swarm.connected_peers().count()
        );

        loop {
            let swarm_event = match self.swarm.select_next_some().poll_unpin(cx) {
                Poll::Ready(event) => event,
                Poll::Pending => break,
            };
            tracing::debug!("{} swarm event {swarm_event:?}", self.swarm.local_peer_id());

            match swarm_event {
                SwarmEvent::Behaviour(BehaviourEvent::Discovery(discovery::Event::Received(
                    msg,
                ))) => {
                    if msg.data.version() != DISCOVERY_PROTOCOL_MESSAGE_VERSION {
                        tracing::warn!("drop unsupport disc message from peer {}", msg.peer_id);
                        continue;
                    }
                    let disc_msg = match msg.data.decode() {
                        Ok(msg) => msg,
                        Err(err) => {
                            tracing::error!("disc message from peer {} err {err:}", msg.peer_id,);
                            continue;
                        }
                    };

                    match disc_msg {
                        DiscoveryMessage::RegisterRequest(record) => {
                            let peer_id = record.peer_id();
                            self.peer_manager.update_or_insert_record(*record);

                            let discovery = &self.swarm.behaviour().discovery;
                            if let Err(err) = discovery.ack_register(peer_id) {
                                error!("ack discover register err {err:?} to peer {peer_id:}");
                            }
                        }
                        DiscoveryMessage::RegisterResponse(_ack) => {
                            self.peer_manager.ack_listen_register(msg.peer_id);
                        }
                        DiscoveryMessage::DiscoverRequest(req) => {
                            let records = self.peer_manager.filter_records(req.limit, req.filter);
                            let discovery = &self.swarm.behaviour().discovery;
                            if let Err(err) = discovery.response_discover(msg.peer_id, records) {
                                error!("response discover err {err:?} to peer {}", msg.peer_id);
                            }
                        }
                        DiscoveryMessage::DiscoverResponse(records) => {
                            tracing::debug!("discovered {} peers", records.len());
                            self.peer_manager.batch_update_or_insert_records(records)
                        }
                    }
                }
                SwarmEvent::Behaviour(BehaviourEvent::Transmit(transmit::Event::Received(msg))) => {
                    let handler = match self.router.get_topic_handler(&msg.data) {
                        Some(handler) => handler,
                        None => {
                            error!("unknown topic {} from {}", msg.data.topic_id(), msg.peer_id);
                            continue;
                        }
                    };

                    let ctx = RouterContext {
                        peer_id: msg.peer_id,
                        rpc_call_map: self.router.rpc_call_map(),
                        rpc_call_resp: Arc::new(Arc::clone(&self.outbound_queue)),
                    };

                    // TODO: limit
                    tokio::spawn(async move {
                        if let Err(err) = handler.handle(&ctx, &msg.data).await {
                            tracing::error!("router msg err {:?}", err);
                        }
                    });
                }
                SwarmEvent::Behaviour(event) => {
                    info!("unhandled behaviour {event:?}");
                }
                SwarmEvent::NewListenAddr { address, .. } => {
                    info!("Listening on {address:?}");
                }
                SwarmEvent::ConnectionEstablished {
                    peer_id,
                    endpoint,
                    num_established,
                    ..
                } => {
                    tracing::info!("peer {peer_id:} connections {num_established:}");
                    if let ConnectedPoint::Dialer { address, .. } = endpoint {
                        self.peer_manager.report_dial_success(peer_id, address);
                    }
                }
                SwarmEvent::OutgoingConnectionError { peer_id, error, .. } => {
                    let Some(peer_id) = peer_id else {
                        tracing::warn!("no peer id outgoing connection error {error:}");
                        continue;
                    };

                    self.peer_manager.report_dial_failure(peer_id, error);
                }
                SwarmEvent::ExpiredListenAddr { .. } => {
                    self.peer_manager.refresh_self_record();
                }
                SwarmEvent::ListenerClosed { .. } => {
                    self.peer_manager.refresh_self_record();
                }
                _ => {
                    tracing::debug!("unhandled swarm event {swarm_event:?}");
                }
            }
        }

        self.send_outbound_msg();

        loop {
            let EventLoop {
                ref mut peer_manager,
                ref mut swarm,
                ..
            } = *self.as_mut();

            let manager_event = match peer_manager.poll(swarm, cx) {
                Poll::Ready(event) => event,
                Poll::Pending => break,
            };
            tracing::debug!("{} manager event {manager_event:?}", swarm.local_peer_id());

            match manager_event {
                peer_manager::PeerManagerEvent::RegisterSelfListenAddrsTo {
                    peer_ids,
                    self_record,
                } => {
                    let discovery = &swarm.behaviour().discovery;
                    for remote_peer_id in peer_ids {
                        if let Err(err) = discovery.register(remote_peer_id, *self_record.clone()) {
                            tracing::error!("disc register failed {err:}");
                        }
                    }
                }
                peer_manager::PeerManagerEvent::DiscoverNewPeersFrom {
                    peer_ids,
                    limit,
                    filter,
                } => {
                    let discovery = &swarm.behaviour().discovery;
                    for remote_peer_id in peer_ids {
                        if let Err(err) = discovery.discover(remote_peer_id, limit, filter.clone())
                        {
                            tracing::error!("disc discover failed {err:}");
                        }
                    }
                }
                peer_manager::PeerManagerEvent::DialPeers { addrs } => {
                    for (peer_id, addr) in addrs {
                        tracing::info!("dial peer {peer_id:} {addr:}");

                        if let Err(err) = swarm.dial(addr) {
                            tracing::error!("dial peer {peer_id:} err {err:}");

                            peer_manager.report_dial_failure(peer_id, err);
                        }
                    }
                }
            }
        }

        Poll::Pending
    }
}

pub struct OutboundQueue(ArrayQueue<OutboundMessage>);

impl Default for OutboundQueue {
    fn default() -> Self {
        OutboundQueue(ArrayQueue::new(
            config::DEFAULT_MAX_GLOBAL_OUTBOUND_QUEUE_SIZE,
        ))
    }
}

impl Deref for OutboundQueue {
    type Target = ArrayQueue<OutboundMessage>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl RpcCallResponse for Arc<OutboundQueue> {
    async fn response(&self, peer_id: &PeerId, msg: TransmitMessage) -> MiraxResult<()> {
        let _ = self.push(OutboundMessage::RpcResponse {
            peer_id: *peer_id,
            msg,
        });

        Ok(())
    }
}
