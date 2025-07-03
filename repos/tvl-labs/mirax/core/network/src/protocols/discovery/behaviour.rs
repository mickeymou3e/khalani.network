use std::{
    collections::VecDeque,
    ops::Deref,
    sync::Arc,
    task::{Context, Poll},
};

use bloomfilter::Bloom;
use crossbeam::queue::ArrayQueue;
use libp2p::{
    core::{Endpoint, PeerRecord},
    identity::Keypair,
    swarm::{
        ConnectionDenied, ConnectionId, FromSwarm, NetworkBehaviour, NotifyHandler, THandler,
        THandlerInEvent, THandlerOutEvent, ToSwarm,
    },
    Multiaddr, PeerId,
};

use crate::config;

use super::{
    error::DiscoveryError,
    handler::Handler,
    protocol::ProtocolConfig,
    types::{
        Acknowledge, BloomPeerRecord, BytesDiscoveryMessage, DiscoverRequest, DiscoveryMessage,
        PeerDiscoveryMessage,
    },
};

#[derive(Debug)]
pub enum Event {
    Received(PeerDiscoveryMessage),
}

pub struct OutboundQueue(ArrayQueue<PeerDiscoveryMessage>);

impl Deref for OutboundQueue {
    type Target = ArrayQueue<PeerDiscoveryMessage>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Default for OutboundQueue {
    fn default() -> Self {
        OutboundQueue(ArrayQueue::new(
            config::DEFAULT_MAX_GLOBAL_OUTBOUND_QUEUE_SIZE,
        ))
    }
}

pub struct Behaviour {
    pub key_pair: Keypair,
    pub protocol_config: ProtocolConfig,
    pub outbound_queue: Arc<OutboundQueue>,
    pub events: VecDeque<ToSwarm<Event, BytesDiscoveryMessage>>,
}

impl Behaviour {
    pub fn new(key_pair: Keypair) -> Self {
        Self {
            key_pair,
            protocol_config: ProtocolConfig::default(),
            outbound_queue: Default::default(),
            events: Default::default(),
        }
    }

    pub fn register(&self, peer_id: PeerId, self_record: PeerRecord) -> Result<(), DiscoveryError> {
        let data = BytesDiscoveryMessage::encode(DiscoveryMessage::RegisterRequest(Box::new(
            self_record,
        )))?;

        let _ = self
            .outbound_queue
            .push(PeerDiscoveryMessage::new(peer_id, data));

        Ok(())
    }

    pub fn ack_register(&self, peer_id: PeerId) -> Result<(), DiscoveryError> {
        let data =
            BytesDiscoveryMessage::encode(DiscoveryMessage::RegisterResponse(Acknowledge {}))?;

        let _ = self
            .outbound_queue
            .push(PeerDiscoveryMessage::new(peer_id, data));

        Ok(())
    }

    pub fn discover(
        &self,
        peer_id: PeerId,
        limit: u16,
        filter: Bloom<BloomPeerRecord>,
    ) -> Result<(), DiscoveryError> {
        let req = DiscoverRequest { limit, filter };
        let data = BytesDiscoveryMessage::encode(DiscoveryMessage::DiscoverRequest(req))?;

        let _ = self
            .outbound_queue
            .push(PeerDiscoveryMessage::new(peer_id, data));

        Ok(())
    }

    pub fn response_discover(
        &self,
        peer_id: PeerId,
        records: Vec<PeerRecord>,
    ) -> Result<(), DiscoveryError> {
        let resp = DiscoveryMessage::DiscoverResponse(records);
        let data = BytesDiscoveryMessage::encode(resp)?;

        let _ = self
            .outbound_queue
            .push(PeerDiscoveryMessage::new(peer_id, data));

        Ok(())
    }
}

impl NetworkBehaviour for Behaviour {
    type ConnectionHandler = Handler;
    type ToSwarm = Event;

    fn handle_established_inbound_connection(
        &mut self,
        _connection_id: ConnectionId,
        _peer: PeerId,
        _local_addr: &Multiaddr,
        _remote_addr: &Multiaddr,
    ) -> Result<THandler<Self>, ConnectionDenied> {
        Ok(Handler::new(self.protocol_config.clone()))
    }

    fn handle_established_outbound_connection(
        &mut self,
        _connection_id: ConnectionId,
        _peer: PeerId,
        _addr: &Multiaddr,
        _role_override: Endpoint,
    ) -> Result<THandler<Self>, ConnectionDenied> {
        Ok(Handler::new(self.protocol_config.clone()))
    }

    fn on_connection_handler_event(
        &mut self,
        peer_id: PeerId,
        _connection_id: ConnectionId,
        msg: THandlerOutEvent<Self>,
    ) {
        self.events
            .push_back(ToSwarm::GenerateEvent(Event::Received(
                PeerDiscoveryMessage::new(peer_id, msg),
            )));
    }

    fn poll(
        &mut self,
        _cx: &mut Context<'_>,
    ) -> Poll<ToSwarm<Self::ToSwarm, THandlerInEvent<Self>>> {
        if let Some(msg) = self.outbound_queue.pop() {
            return Poll::Ready(ToSwarm::NotifyHandler {
                peer_id: msg.peer_id,
                handler: NotifyHandler::Any,
                event: msg.data,
            });
        }

        if let Some(msg) = self.events.pop_front() {
            return Poll::Ready(msg);
        }

        Poll::Pending
    }

    fn on_swarm_event(&mut self, _event: FromSwarm) {}
}
