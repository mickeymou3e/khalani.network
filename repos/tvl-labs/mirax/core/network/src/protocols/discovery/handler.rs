use std::{
    collections::VecDeque,
    pin::Pin,
    task::{Context, Poll},
};

use asynchronous_codec::Framed;
use libp2p::{
    futures::{Sink, StreamExt},
    swarm::{
        handler::{
            ConnectionEvent, DialUpgradeError, FullyNegotiatedInbound, FullyNegotiatedOutbound,
            ListenUpgradeError,
        },
        ConnectionHandler, ConnectionHandlerEvent, SubstreamProtocol,
    },
    Stream,
};

use super::{
    protocol::{DiscoveryCodec, ProtocolConfig},
    types::BytesDiscoveryMessage,
};

enum InboundSubstreamState {
    /// Waiting for a message from the remote. The idle state for an inbound substream.
    WaitingInput(Framed<Stream, DiscoveryCodec>),
    /// The substream is being closed.
    Closing(Framed<Stream, DiscoveryCodec>),
    /// An error occurred during processing.
    Poisoned,
}

enum OutboundSubstreamState {
    /// Waiting for the user to send a message. The idle state for an outbound substream.
    WaitingOutput(Framed<Stream, DiscoveryCodec>),
    /// Waiting to send a message to the remote.
    PendingSend(Framed<Stream, DiscoveryCodec>, BytesDiscoveryMessage),
    /// Waiting to flush the substream so that the data arrives to the remote.
    PendingFlush(Framed<Stream, DiscoveryCodec>),
    /// An error occurred during processing.
    Poisoned,
}

pub struct Handler {
    listen_protocol: ProtocolConfig,
    pending_send: VecDeque<BytesDiscoveryMessage>,
    inbound_substream: Option<InboundSubstreamState>,
    outbound_substream: Option<OutboundSubstreamState>,
    outbound_substream_establishing: bool,
}

impl Handler {
    pub fn new(listen_protocol: ProtocolConfig) -> Self {
        Handler {
            listen_protocol,
            pending_send: Default::default(),
            inbound_substream: None,
            outbound_substream: None,
            outbound_substream_establishing: false,
        }
    }
}

impl ConnectionHandler for Handler {
    type FromBehaviour = BytesDiscoveryMessage;
    type ToBehaviour = BytesDiscoveryMessage;
    type InboundProtocol = ProtocolConfig;
    type OutboundProtocol = ProtocolConfig;
    type InboundOpenInfo = ();
    type OutboundOpenInfo = ();

    fn listen_protocol(&self) -> SubstreamProtocol<Self::InboundProtocol, Self::InboundOpenInfo> {
        SubstreamProtocol::new(self.listen_protocol.clone(), ())
    }

    fn on_behaviour_event(&mut self, event: Self::FromBehaviour) {
        self.pending_send.push_back(event);
    }

    fn poll(
        &mut self,
        cx: &mut Context<'_>,
    ) -> Poll<
        ConnectionHandlerEvent<Self::OutboundProtocol, Self::OutboundOpenInfo, Self::ToBehaviour>,
    > {
        if !self.pending_send.is_empty()
            && self.outbound_substream.is_none()
            && !self.outbound_substream_establishing
        {
            self.outbound_substream_establishing = true;
            return Poll::Ready(ConnectionHandlerEvent::OutboundSubstreamRequest {
                protocol: SubstreamProtocol::new(self.listen_protocol.clone(), ()),
            });
        }

        loop {
            match std::mem::replace(
                &mut self.outbound_substream,
                Some(OutboundSubstreamState::Poisoned),
            ) {
                Some(OutboundSubstreamState::WaitingOutput(substream)) => {
                    if let Some(msg) = self.pending_send.pop_front() {
                        self.pending_send.shrink_to_fit();
                        self.outbound_substream =
                            Some(OutboundSubstreamState::PendingSend(substream, msg));
                        continue;
                    }

                    self.outbound_substream =
                        Some(OutboundSubstreamState::WaitingOutput(substream));
                    break;
                }
                Some(OutboundSubstreamState::PendingSend(mut substream, msg)) => {
                    match Sink::poll_ready(Pin::new(&mut substream), cx) {
                        Poll::Ready(Ok(())) => {
                            match Sink::start_send(Pin::new(&mut substream), msg.into_vec().into())
                            {
                                Ok(()) => {
                                    self.outbound_substream =
                                        Some(OutboundSubstreamState::PendingFlush(substream))
                                }
                                Err(_e) => {
                                    self.outbound_substream = None;
                                    break;
                                }
                            }
                        }
                        Poll::Ready(Err(_e)) => {
                            self.outbound_substream = None;
                            break;
                        }
                        Poll::Pending => {
                            self.outbound_substream =
                                Some(OutboundSubstreamState::PendingSend(substream, msg));
                            break;
                        }
                    }
                }
                Some(OutboundSubstreamState::PendingFlush(mut substream)) => {
                    match Sink::poll_flush(Pin::new(&mut substream), cx) {
                        Poll::Ready(Ok(())) => {
                            self.outbound_substream =
                                Some(OutboundSubstreamState::WaitingOutput(substream));
                        }
                        Poll::Ready(Err(_e)) => {
                            self.outbound_substream = None;
                            break;
                        }
                        Poll::Pending => {
                            self.outbound_substream =
                                Some(OutboundSubstreamState::PendingFlush(substream));
                            break;
                        }
                    }
                }
                Some(OutboundSubstreamState::Poisoned) => {
                    unreachable!("Unexpected error occurred during outbound stream processing")
                }
                None => {
                    self.outbound_substream = None;
                    break;
                }
            }
        }

        loop {
            match std::mem::replace(
                &mut self.inbound_substream,
                Some(InboundSubstreamState::Poisoned),
            ) {
                // inbound idle state
                Some(InboundSubstreamState::WaitingInput(mut substream)) => {
                    match substream.poll_next_unpin(cx) {
                        Poll::Ready(Some(Ok(message))) => {
                            self.inbound_substream =
                                Some(InboundSubstreamState::WaitingInput(substream));
                            return Poll::Ready(ConnectionHandlerEvent::NotifyBehaviour(
                                BytesDiscoveryMessage::from_vec(message.into()),
                            ));
                        }
                        Poll::Ready(Some(Err(_error))) => {
                            self.inbound_substream =
                                Some(InboundSubstreamState::Closing(substream));
                        }
                        Poll::Ready(None) => {
                            self.inbound_substream =
                                Some(InboundSubstreamState::Closing(substream));
                        }
                        Poll::Pending => {
                            self.inbound_substream =
                                Some(InboundSubstreamState::WaitingInput(substream));
                            break;
                        }
                    }
                }
                Some(InboundSubstreamState::Closing(mut substream)) => {
                    match Sink::poll_close(Pin::new(&mut substream), cx) {
                        Poll::Ready(_closed) => {
                            self.inbound_substream = None;
                            break;
                        }
                        Poll::Pending => {
                            self.inbound_substream =
                                Some(InboundSubstreamState::Closing(substream));
                            break;
                        }
                    }
                }
                None => {
                    self.inbound_substream = None;
                    break;
                }
                Some(InboundSubstreamState::Poisoned) => {
                    unreachable!("Unexpected error occurred during inbound stream processing")
                }
            }
        }

        Poll::Pending
    }

    fn on_connection_event(
        &mut self,
        event: ConnectionEvent<
            Self::InboundProtocol,
            Self::OutboundProtocol,
            Self::InboundOpenInfo,
            Self::OutboundOpenInfo,
        >,
    ) {
        match event {
            ConnectionEvent::FullyNegotiatedInbound(fully_negotiated_inbound) => {
                self.on_fully_negotiated_inbound(fully_negotiated_inbound)
            }
            ConnectionEvent::FullyNegotiatedOutbound(fully_negotiated_outbound) => {
                self.on_fully_negotiated_outbound(fully_negotiated_outbound)
            }
            ConnectionEvent::DialUpgradeError(dial_upgrade_error) => {
                self.on_dial_upgrade_error(dial_upgrade_error)
            }
            ConnectionEvent::ListenUpgradeError(listen_upgrade_error) => {
                self.on_listen_upgrade_error(listen_upgrade_error)
            }
            _ => {}
        }
    }
}

impl Handler {
    fn on_fully_negotiated_inbound(
        &mut self,
        FullyNegotiatedInbound {
            protocol: substream,
            ..
        }: FullyNegotiatedInbound<
            <Self as ConnectionHandler>::InboundProtocol,
            <Self as ConnectionHandler>::InboundOpenInfo,
        >,
    ) {
        self.inbound_substream = Some(InboundSubstreamState::WaitingInput(substream));
    }

    fn on_fully_negotiated_outbound(
        &mut self,
        FullyNegotiatedOutbound {
            protocol: substream,
            ..
        }: FullyNegotiatedOutbound<
            <Self as ConnectionHandler>::OutboundProtocol,
            <Self as ConnectionHandler>::OutboundOpenInfo,
        >,
    ) {
        assert!(
            self.outbound_substream.is_none(),
            "established outbound substream exists"
        );

        self.outbound_substream = Some(OutboundSubstreamState::WaitingOutput(substream));
    }

    fn on_dial_upgrade_error(
        &mut self,
        DialUpgradeError { error: _, info: () }: DialUpgradeError<
            <Self as ConnectionHandler>::OutboundOpenInfo,
            <Self as ConnectionHandler>::OutboundProtocol,
        >,
    ) {
        // TODO: handle dial upgrade error, not necessary for localnet nodes
    }

    fn on_listen_upgrade_error(
        &mut self,
        ListenUpgradeError { error: _, .. }: ListenUpgradeError<
            <Self as ConnectionHandler>::InboundOpenInfo,
            <Self as ConnectionHandler>::InboundProtocol,
        >,
    ) {
        // TODO: handle dial upgrade error, not necessary for localnet nodes
    }
}
