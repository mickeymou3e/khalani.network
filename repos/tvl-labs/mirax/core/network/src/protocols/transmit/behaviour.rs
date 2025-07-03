// Defined behaviour events

use std::{
    collections::VecDeque,
    ops::Deref,
    sync::Arc,
    task::{Context, Poll},
};

use crossbeam::queue::ArrayQueue;
use libp2p::{
    core::Endpoint,
    swarm::{
        ConnectionDenied, ConnectionId, FromSwarm, NetworkBehaviour, NotifyHandler, THandler,
        THandlerInEvent, THandlerOutEvent, ToSwarm,
    },
    Multiaddr, PeerId,
};

use crate::config;

use super::{
    handler::Handler,
    protocol::ProtocolConfig,
    types::{PeerTransmitMessage, TransmitMessage},
};

#[derive(Debug)]
pub enum Event {
    Received(PeerTransmitMessage),
}

pub struct OutboundQueue(ArrayQueue<PeerTransmitMessage>);

impl Deref for OutboundQueue {
    type Target = ArrayQueue<PeerTransmitMessage>;

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

#[derive(Default)]
pub struct Behaviour {
    pub protocol_config: ProtocolConfig,
    pub outbound_queue: Arc<OutboundQueue>,
    pub events: VecDeque<ToSwarm<Event, TransmitMessage>>,
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
                PeerTransmitMessage::new(peer_id, msg),
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
