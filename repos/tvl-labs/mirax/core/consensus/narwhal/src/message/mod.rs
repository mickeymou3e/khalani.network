mod certificate;
mod chunk;

pub use certificate::CertificateHandler;
pub use chunk::{HandleTxChunkError, TransactionChunkHandler};

use mirax_network::traits::{MessageCompression, TopicMessage};
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};

use crate::constants::{CHUNK_VOTE_TOPIC, CHUNK_VOTE_TOPIC_ID};
use crate::types::Vote;

macro_rules! def_msg {
    ($name: ident, $trait_: ident, $inner_ty: ty, $topic_id: path, $topic: path, $compression: ident) => {
        #[derive(Serialize, Deserialize, Clone, Debug)]
        pub struct $name<$trait_>(pub(crate) $inner_ty);

        impl<$trait_: Serialize + DeserializeOwned + Sync + Send> TopicMessage for $name<$trait_> {
            fn topic_id() -> u8 {
                $topic_id
            }
            fn topic() -> &'static str {
                $topic
            }
            fn compression() -> MessageCompression {
                MessageCompression::$compression
            }
        }

        impl<$trait_> $name<$trait_> {
            pub fn inner(&self) -> &$inner_ty {
                &self.0
            }
        }
    };
    ($name: ident, $inner_ty: ty, $topic_id: path, $topic: path, $compression: ident) => {
        #[derive(Serialize, Deserialize, Clone, Debug)]
        pub struct $name(pub(crate) $inner_ty);

        impl TopicMessage for $name {
            fn topic_id() -> u8 {
                $topic_id
            }
            fn topic() -> &'static str {
                $topic
            }
            fn compression() -> MessageCompression {
                MessageCompression::$compression
            }
        }

        impl $name {
            pub fn inner(&self) -> &$inner_ty {
                &self.0
            }
        }
    };
}

def_msg!(
    CertificateMessage,
    S,
    mirax_types::Certificate<S>,
    crate::constants::CERTIFICATE_TOPIC_ID,
    crate::constants::CERTIFICATE_TOPIC,
    None
);

def_msg!(
    TransactionChunkMessage,
    S,
    mirax_types::TransactionChunk<S>,
    crate::constants::TRANSACTION_CHUNK_TOPIC_ID,
    crate::constants::TRANSACTION_CHUNK_TOPIC,
    Zstd
);

impl<S: Serialize + DeserializeOwned + Sync + Send> TopicMessage for Vote<S> {
    fn topic_id() -> u8 {
        CHUNK_VOTE_TOPIC_ID
    }

    fn topic() -> &'static str {
        CHUNK_VOTE_TOPIC
    }

    fn compression() -> MessageCompression {
        MessageCompression::None
    }
}

#[macro_export]
macro_rules! try_trait_err {
    ($func: expr) => {
        $func
            .map_err(|e| $crate::error::NarwhalError::Traits(smol_str::format_smolstr!("{}", e)))?
    };
}
