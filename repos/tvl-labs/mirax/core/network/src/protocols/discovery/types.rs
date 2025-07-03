use bloomfilter::Bloom;
use libp2p::{
    core::{PeerRecord, SignedEnvelope},
    PeerId,
};
use mirax_codec::{Bcs, BinaryCodec};
use serde::{Deserialize, Serialize};
use smol_str::format_smolstr;

use super::{error::DiscoveryError, protocol::DISCOVERY_PROTOCOL_MESSAGE_VERSION};

#[derive(Debug)]
pub struct PeerDiscoveryMessage {
    pub peer_id: PeerId,
    pub data: BytesDiscoveryMessage,
}

impl PeerDiscoveryMessage {
    pub fn new(peer_id: PeerId, data: BytesDiscoveryMessage) -> Self {
        PeerDiscoveryMessage { peer_id, data }
    }
}

#[derive(Debug)]
pub struct BytesDiscoveryMessage(Vec<u8>);

impl BytesDiscoveryMessage {
    pub fn from_vec(vec: Vec<u8>) -> Self {
        BytesDiscoveryMessage(vec)
    }

    pub fn version(&self) -> u8 {
        self.0[0]
    }

    pub fn encode(msg: DiscoveryMessage) -> Result<Self, DiscoveryError> {
        let msg: SerializableDiscoveryMessage = msg.into();

        let mut buf: Vec<u8> = Bcs::<_>::encode(&msg)
            .map_err(|e| DiscoveryError::CodecError(format_smolstr!("{:?}", e)))?
            .into();

        buf.insert(0, DISCOVERY_PROTOCOL_MESSAGE_VERSION);

        Ok(BytesDiscoveryMessage(buf))
    }

    pub fn decode(&self) -> Result<DiscoveryMessage, DiscoveryError> {
        let msg: SerializableDiscoveryMessage = Bcs::<_>::decode(&self.0[1..])
            .map_err(|e| DiscoveryError::CodecError(format_smolstr!("{:?}", e)))?;

        msg.try_into()
    }

    pub fn into_vec(self) -> Vec<u8> {
        self.0
    }
}

#[derive(Debug, Hash, Clone)]
pub struct BloomPeerRecord {
    pub peer_id: PeerId,
    pub seq: u64,
}

impl<'a> From<&'a PeerRecord> for BloomPeerRecord {
    fn from(record: &'a PeerRecord) -> Self {
        Self {
            peer_id: record.peer_id(),
            seq: record.seq(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscoverRequest {
    pub limit: u16,
    pub filter: Bloom<BloomPeerRecord>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Acknowledge {}

#[derive(Debug)]
pub enum DiscoveryMessage {
    RegisterRequest(Box<PeerRecord>),
    RegisterResponse(Acknowledge),
    DiscoverRequest(DiscoverRequest),
    DiscoverResponse(Vec<PeerRecord>),
}

impl TryFrom<SerializableDiscoveryMessage> for DiscoveryMessage {
    type Error = DiscoveryError;

    fn try_from(msg: SerializableDiscoveryMessage) -> Result<Self, Self::Error> {
        match msg {
            SerializableDiscoveryMessage::RegisterRequest(bytes_envelop) => {
                let envelop = SignedEnvelope::from_protobuf_encoding(&bytes_envelop.0)?;
                let record = PeerRecord::from_signed_envelope(envelop)?;
                Ok(DiscoveryMessage::RegisterRequest(Box::new(record)))
            }
            SerializableDiscoveryMessage::RegisterResponse(ack) => {
                Ok(DiscoveryMessage::RegisterResponse(ack))
            }
            SerializableDiscoveryMessage::DiscoverRequest(req) => {
                Ok(DiscoveryMessage::DiscoverRequest(req))
            }
            SerializableDiscoveryMessage::DiscoverResponse(vec_bytes_envelop) => {
                let into_records = vec_bytes_envelop.into_iter().map(|bytes| {
                    let envelop = SignedEnvelope::from_protobuf_encoding(&bytes.0)?;
                    let record = PeerRecord::from_signed_envelope(envelop)?;
                    Ok::<PeerRecord, DiscoveryError>(record)
                });
                Ok(DiscoveryMessage::DiscoverResponse(
                    into_records.collect::<Result<Vec<_>, _>>()?,
                ))
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
enum SerializableDiscoveryMessage {
    RegisterRequest(ProtoBytesSignedEnvelop),
    RegisterResponse(Acknowledge),
    DiscoverRequest(DiscoverRequest),
    DiscoverResponse(Vec<ProtoBytesSignedEnvelop>),
}

impl From<DiscoveryMessage> for SerializableDiscoveryMessage {
    fn from(msg: DiscoveryMessage) -> Self {
        match msg {
            DiscoveryMessage::RegisterRequest(record) => {
                let envelop = record.to_signed_envelope();
                let bytes = envelop.into_protobuf_encoding();
                SerializableDiscoveryMessage::RegisterRequest(ProtoBytesSignedEnvelop(bytes))
            }
            DiscoveryMessage::RegisterResponse(ack) => {
                SerializableDiscoveryMessage::RegisterResponse(ack)
            }
            DiscoveryMessage::DiscoverRequest(req) => {
                SerializableDiscoveryMessage::DiscoverRequest(req)
            }
            DiscoveryMessage::DiscoverResponse(records) => {
                let into_vec_bytes = records.into_iter().map(|record| {
                    let envelop = record.into_signed_envelope();
                    ProtoBytesSignedEnvelop(envelop.into_protobuf_encoding())
                });
                SerializableDiscoveryMessage::DiscoverResponse(into_vec_bytes.collect())
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct ProtoBytesSignedEnvelop(Vec<u8>);
