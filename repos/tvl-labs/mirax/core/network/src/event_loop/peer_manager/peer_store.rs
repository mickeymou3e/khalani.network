use std::collections::{HashMap, HashSet};

use bloomfilter::Bloom;
use libp2p::{core::PeerRecord, multiaddr::Protocol, swarm::DialError, Multiaddr, PeerId};

use crate::protocols::discovery::types::BloomPeerRecord;

// TODO: maintain store size
// TODO: failure backoff
#[derive(Default)]
pub struct PeerStore {
    peers: HashMap<PeerId, HashSet<DialableAddress>>,
    records: HashMap<PeerId, PeerRecord>,
}

impl PeerStore {
    #[inline]
    pub fn update_or_insert_record(&mut self, record: PeerRecord) {
        let Some(exists_record) = self.records.get(&record.peer_id()) else {
            self.update_dialable_peer_addresses(&record);
            self.records.insert(record.peer_id(), record);
            return;
        };

        if exists_record.seq() < record.seq() {
            self.update_dialable_peer_addresses(&record);
            self.records.insert(record.peer_id(), record);
        }
    }

    pub fn filter_records(
        &self,
        filter: Bloom<BloomPeerRecord>,
    ) -> impl Iterator<Item = &PeerRecord> {
        { self.records.values() }
            .filter(move |record| !filter.check(&BloomPeerRecord::from(*record)))
    }

    pub fn batch_update_or_insert_records(&mut self, records: Vec<PeerRecord>) {
        for record in records {
            self.update_or_insert_record(record);
        }
    }

    pub fn records(&self) -> impl Iterator<Item = &PeerRecord> {
        self.records.values()
    }

    pub fn get_dialable_peer_addresses<'a>(
        &'a self,
        self_id: &'a PeerId,
        dialed: HashSet<&'a PeerId>,
    ) -> impl Iterator<Item = (&'a PeerId, &'a Multiaddr)> {
        { self.peers.iter() }.filter_map(move |(peer_id, dialables)| {
            if peer_id == self_id || dialed.contains(peer_id) {
                return None;
            }

            if dialables.is_empty() {
                return None;
            }

            { dialables.iter() }
                .min_by_key(|dialable| dialable.failure)
                .map(|dialable| (peer_id, &dialable.addr))
        })
    }

    // This means peer id mismtach
    pub fn report_addr_with_p2p_err(&mut self, peer_id: &PeerId, addr: &Multiaddr) {
        tracing::error!("report peer {peer_id:} dialable {addr:} with p2p error, remove it");

        if self.take_peer_dialable_addr(peer_id, addr).is_none() {
            tracing::warn!("peer {peer_id:} dialable {addr:} not found");
        };
    }

    pub fn report_dial_success(&mut self, peer_id: PeerId, addr: Multiaddr) {
        let addr: Multiaddr = { addr.into_iter() }
            .filter(|protocol| !matches!(protocol, Protocol::P2p(_)))
            .collect();

        let Some(mut dialable) = self.take_peer_dialable_addr(&peer_id, &addr) else {
            tracing::warn!("peer {peer_id:} dialable {addr:} not found");
            return;
        };

        dialable.reset_failure();

        { self.peers.get_mut(&peer_id) }.map(|addrs| addrs.insert(dialable));
    }

    pub fn report_dial_failure(&mut self, peer_id: PeerId, addr: Multiaddr, err: DialError) {
        if !matches!(
            err,
            DialError::Transport(_) | DialError::Denied { .. } | DialError::WrongPeerId { .. }
        ) {
            return;
        }

        let Some(mut dialable) = self.take_peer_dialable_addr(&peer_id, &addr) else {
            tracing::warn!("peer {peer_id:} dialable {addr:} not found");
            return;
        };
        if matches!(err, DialError::WrongPeerId { .. }) {
            // Drop this address
            tracing::debug!("drop wrong peer {peer_id:} addr {addr:}");
            return;
        }

        dialable.inc_failure();

        { self.peers.get_mut(&peer_id) }.map(|addrs| addrs.insert(dialable));
    }

    fn take_peer_dialable_addr(
        &mut self,
        peer_id: &PeerId,
        addr: &Multiaddr,
    ) -> Option<DialableAddress> {
        self.peers.get_mut(peer_id)?.take(addr)
    }

    // Ensure that all dialable addresses don't contain peer id
    fn update_dialable_peer_addresses(&mut self, record: &PeerRecord) {
        let dialable_addrs = self.peers.entry(record.peer_id()).or_default();

        let recorded_addrs: HashSet<_> = { record.addresses().iter() }
            .filter_map(|addr| {
                let wrong_peer_id = addr.iter().any(|protocol| {
                    matches!(protocol, Protocol::P2p(peer_id) if peer_id != record.peer_id())
                });
                if wrong_peer_id {
                    return None;
                }

                // Remove peer id
                let valid_addr: Multiaddr = { addr.into_iter() }
                    .filter(|protocol| !matches!(protocol, Protocol::P2p(_)))
                    .collect();

                Some(valid_addr)
            })
            .collect();

        dialable_addrs.retain(|dialable| recorded_addrs.contains(&dialable.addr));
        if dialable_addrs.len() == recorded_addrs.len() {
            return;
        }

        let diff: Vec<_> = { recorded_addrs.iter() }
            .filter_map(|addr| {
                if dialable_addrs.contains(addr) {
                    return None;
                }

                Some(DialableAddress::new((*addr).to_owned()))
            })
            .collect();

        dialable_addrs.extend(diff)
    }
}

#[derive(Debug, PartialEq, Eq)]
struct DialableAddress {
    addr: Multiaddr,
    failure: u8,
}

impl std::hash::Hash for DialableAddress {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.addr.hash(state);
    }
}

impl std::borrow::Borrow<Multiaddr> for DialableAddress {
    fn borrow(&self) -> &Multiaddr {
        &self.addr
    }
}

impl DialableAddress {
    fn new(addr: Multiaddr) -> Self {
        Self { addr, failure: 0 }
    }

    fn reset_failure(&mut self) {
        self.failure = 0;
    }

    fn inc_failure(&mut self) {
        self.failure += 1;
    }
}
