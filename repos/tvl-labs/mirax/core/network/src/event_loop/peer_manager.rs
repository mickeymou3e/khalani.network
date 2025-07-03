use std::{
    collections::{HashMap, HashSet},
    future::Future,
    pin::Pin,
    task::{Context, Poll},
    time::Duration,
};

use bloomfilter::Bloom;
use libp2p::{
    core::PeerRecord,
    identity,
    swarm::{DialError, NetworkBehaviour},
    Multiaddr, PeerId, Swarm,
};
use tokio::time::{Interval, Sleep};

use crate::{
    config::{
        DEFAULT_DISCOVERY_INTERVAL, DEFAULT_DISCOVERY_RESPONSE_LIMIT, DEFAULT_MAX_CONNECTED_PEERS,
        DEFAULT_MAX_PEER_STORE_SIZE, DEFAULT_TIMEOUT,
    },
    protocols::discovery::types::BloomPeerRecord,
};

pub mod peer_store;
use peer_store::PeerStore;

#[derive(Debug)]
pub enum PeerManagerEvent {
    RegisterSelfListenAddrsTo {
        peer_ids: Vec<PeerId>,
        self_record: Box<PeerRecord>,
    },
    DiscoverNewPeersFrom {
        peer_ids: Vec<PeerId>,
        limit: u16,
        filter: Bloom<BloomPeerRecord>,
    },
    DialPeers {
        addrs: Vec<(PeerId, Multiaddr)>,
    },
}

pub struct PeerManager {
    store: PeerStore,
    register: ListenAddrsRegister,
    discover: DiscoverNewPeers,
    dialer: DialPeers,
}

impl PeerManager {
    pub fn new(keypair: identity::Keypair) -> Self {
        let local_peer_id = keypair.public().into();

        Self {
            store: PeerStore::default(),
            register: ListenAddrsRegister::new(keypair),
            discover: DiscoverNewPeers::new(),
            dialer: DialPeers::new(local_peer_id, DEFAULT_MAX_CONNECTED_PEERS),
        }
    }

    pub fn update_or_insert_record(&mut self, record: PeerRecord) {
        self.store.update_or_insert_record(record);
        self.discover.reset_boom_filter();
    }

    pub fn filter_records(&self, limit: u16, filter: Bloom<BloomPeerRecord>) -> Vec<PeerRecord> {
        let limit = if limit > DEFAULT_DISCOVERY_RESPONSE_LIMIT {
            DEFAULT_DISCOVERY_RESPONSE_LIMIT
        } else {
            limit
        };

        { self.store.filter_records(filter) }
            .take(limit as usize)
            .cloned()
            .collect()
    }

    pub fn batch_update_or_insert_records(&mut self, records: Vec<PeerRecord>) {
        if records.is_empty() {
            return;
        }

        self.store.batch_update_or_insert_records(records);
        self.discover.reset_boom_filter();
        self.discover.discovered = true;
    }

    pub fn report_dial_success(&mut self, peer_id: PeerId, address: Multiaddr) {
        self.dialer.ongoing.remove(&peer_id);
        self.store.report_dial_success(peer_id, address);
    }

    pub fn report_dial_failure(&mut self, peer_id: PeerId, err: DialError) {
        let Some((addr, _deadline)) = self.dialer.ongoing.remove(&peer_id) else {
            tracing::warn!("dialer ongoing peer {peer_id:} not found");
            return;
        };

        self.store.report_dial_failure(peer_id, addr, err);
    }

    pub fn refresh_self_record(&mut self) {
        self.register.self_record = None;
    }

    pub fn ack_listen_register(&mut self, peer_id: PeerId) {
        self.register.ack_listen_register(peer_id);
    }

    pub fn poll<TBehaviour: NetworkBehaviour>(
        &mut self,
        swarm: &Swarm<TBehaviour>,
        cx: &mut Context<'_>,
    ) -> Poll<PeerManagerEvent> {
        if let Poll::Ready(event) = self.register.poll(swarm, cx) {
            return Poll::Ready(event);
        }

        if let Poll::Ready(event) = self.discover.poll(&self.store, &self.register, cx) {
            return Poll::Ready(event);
        }

        if let Poll::Ready(event) = self.dialer.poll(&mut self.store, swarm, cx) {
            return Poll::Ready(event);
        }

        Poll::Pending
    }
}

// TODO: backoff
struct DialPeers {
    self_id: PeerId,
    max_connected: usize,
    ongoing: HashMap<PeerId, (Multiaddr, Deadline)>,
}

impl DialPeers {
    fn new(self_id: PeerId, max_connected: usize) -> Self {
        Self {
            self_id,
            max_connected,
            ongoing: Default::default(),
        }
    }

    fn poll<TBehaviour: NetworkBehaviour>(
        &mut self,
        store: &mut PeerStore,
        swarm: &Swarm<TBehaviour>,
        cx: &mut Context<'_>,
    ) -> Poll<PeerManagerEvent> {
        if swarm.connected_peers().count() >= self.max_connected {
            return Poll::Pending;
        }

        // TODO: report timeout
        self.ongoing
            .retain(|_peer_id, (_addr, deadline)| deadline.0.as_mut().poll(cx).is_pending());

        let dialed: HashSet<_> = swarm.connected_peers().chain(self.ongoing.keys()).collect();

        let candidates: HashMap<_, _> = store
            .get_dialable_peer_addresses(&self.self_id, dialed)
            .take(DEFAULT_MAX_CONNECTED_PEERS)
            .map(|(k, v)| (*k, v.clone()))
            .collect();
        if candidates.is_empty() {
            return Poll::Pending;
        }

        self.ongoing
            .extend({ candidates.iter() }.map(|(peer, addr)| {
                let deadline = Deadline::from_now(DEFAULT_TIMEOUT);
                (*peer, (addr.clone(), deadline))
            }));

        let mut addrs = vec![];
        for (peer_id, addr) in candidates.into_iter() {
            match addr.clone().with_p2p(peer_id) {
                Ok(addr) => addrs.push((peer_id, addr)),
                Err(err) => {
                    tracing::error!("dialer addr with p2p err {err:}");
                    store.report_addr_with_p2p_err(&peer_id, &addr);
                }
            }
        }

        Poll::Ready(PeerManagerEvent::DialPeers { addrs })
    }
}

struct DiscoverNewPeers {
    filter: Bloom<BloomPeerRecord>,
    limit: u16,
    ongoing: Option<(PeerId, Deadline)>,
    tick: Interval,
    discovered: bool,
}

impl DiscoverNewPeers {
    fn new() -> Self {
        Self {
            filter: Bloom::new_for_fp_rate(DEFAULT_MAX_PEER_STORE_SIZE, 0.01),
            limit: DEFAULT_DISCOVERY_RESPONSE_LIMIT,
            ongoing: None,
            tick: tokio::time::interval(DEFAULT_DISCOVERY_INTERVAL),
            discovered: false,
        }
    }

    fn reset_boom_filter(&mut self) {
        self.filter.clear();
    }

    fn poll(
        &mut self,
        store: &PeerStore,
        register: &ListenAddrsRegister,
        cx: &mut Context<'_>,
    ) -> Poll<PeerManagerEvent> {
        if let Some((_id, deadline)) = self.ongoing.as_mut() {
            if deadline.0.as_mut().poll(cx).is_ready() {
                self.ongoing = None;
                self.discovered = false;
            }
        }

        if self.ongoing.is_some() {
            return Poll::Pending;
        }

        if register.registered.is_empty() {
            return Poll::Pending;
        }

        // Wait interval after successed discovered
        if self.discovered && self.tick.poll_tick(cx).is_pending() {
            return Poll::Pending;
        }

        if self.filter.is_empty() {
            for record in store.records() {
                self.filter.set(&BloomPeerRecord::from(record));
            }
        }

        // Get random peer
        let idx = rand::random::<usize>() % register.registered.len();
        let Some(peer) = register.registered.iter().nth(idx).cloned() else {
            return Poll::Pending;
        };

        self.ongoing = Some((peer, Deadline::from_now(DEFAULT_TIMEOUT)));

        Poll::Ready(PeerManagerEvent::DiscoverNewPeersFrom {
            peer_ids: vec![peer],
            limit: self.limit,
            filter: self.filter.clone(),
        })
    }
}

struct ListenAddrsRegister {
    keypair: identity::Keypair,
    registered: HashSet<PeerId>,
    ongoing: HashMap<PeerId, Deadline>,
    self_record: Option<PeerRecord>,
}

impl ListenAddrsRegister {
    fn new(keypair: identity::Keypair) -> Self {
        Self {
            keypair,
            registered: Default::default(),
            ongoing: Default::default(),
            self_record: None,
        }
    }

    fn ack_listen_register(&mut self, peer_id: PeerId) {
        self.ongoing.remove(&peer_id);
        self.registered.insert(peer_id);
    }

    // TODO: filter localnet addresses
    // TODO: count peer failure
    pub fn poll<TBehaviour: NetworkBehaviour>(
        &mut self,
        swarm: &Swarm<TBehaviour>,
        cx: &mut Context<'_>,
    ) -> Poll<PeerManagerEvent> {
        let connected_peers: HashSet<_> = swarm.connected_peers().copied().collect();
        if connected_peers.is_empty() {
            return Poll::Pending;
        }

        // TODO: handle timeout
        self.ongoing
            .retain(|_peer_id, deadline| deadline.0.as_mut().poll(cx).is_pending());

        let candidates: Vec<_> = { self.registered.symmetric_difference(&connected_peers) }
            .filter(|pid| !self.registered.contains(pid) && !self.ongoing.contains_key(pid))
            .copied()
            .collect();
        if candidates.is_empty() {
            return Poll::Pending;
        }

        let record = match self.self_record.as_ref() {
            None => {
                let listened_addrs: Vec<_> = swarm.listeners().cloned().collect();
                if listened_addrs.is_empty() {
                    return Poll::Pending;
                }
                match PeerRecord::new(&self.keypair, listened_addrs) {
                    Ok(record) => record,
                    Err(err) => {
                        tracing::error!("sign self record err {err:}");
                        return Poll::Pending;
                    }
                }
            }
            Some(record) => record.clone(),
        };

        tracing::trace!(
            "{} ongoing {:?} {:?}",
            record.peer_id(),
            self.ongoing.keys().collect::<Vec<_>>(),
            candidates
        );

        self.ongoing
            .extend({ candidates.iter() }.map(|peer| (*peer, Deadline::from_now(DEFAULT_TIMEOUT))));

        Poll::Ready(PeerManagerEvent::RegisterSelfListenAddrsTo {
            peer_ids: candidates,
            self_record: Box::new(record),
        })
    }
}

struct Deadline(Pin<Box<Sleep>>);

impl Deadline {
    fn from_now(duration: Duration) -> Self {
        Deadline(Box::pin(tokio::time::sleep(duration)))
    }
}
