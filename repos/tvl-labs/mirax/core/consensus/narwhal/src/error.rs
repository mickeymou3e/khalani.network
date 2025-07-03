use std::error::Error as StdError;

use flume::SendError;
use mirax_types::BlockNumber;
use smol_str::{format_smolstr, SmolStr};
use thiserror::Error;

use mirax_error::impl_into_mirax_error;

#[derive(Debug, Error)]
pub enum NarwhalError {
    #[error("Channel sending message: {0}")]
    ChannelSend(SmolStr),

    #[error("Channel receiving message: {0}")]
    ChannelRecv(#[from] flume::RecvError),

    #[error(transparent)]
    Dag(#[from] crate::dag::DagError),

    #[error(transparent)]
    Bullshark(#[from] crate::bullshark::BullsharkError),

    #[error(transparent)]
    Collection(#[from] crate::collections::CollectionError),

    #[error("The transaction chunk is outdated: latest gc number {0}, actual {1}")]
    OutdatedTransactionChunk(BlockNumber, BlockNumber),

    #[error("Certificate below threshold: expect {expect}, actual {actual}")]
    CertificateBelowThreshold { expect: usize, actual: usize },

    #[error("Consensus trait error: {0}")]
    Traits(SmolStr),
}

impl_into_mirax_error!(NarwhalError, Narwhal);

impl<T> From<SendError<T>> for NarwhalError {
    fn from(err: SendError<T>) -> Self {
        NarwhalError::ChannelSend(format_smolstr!("{}", err))
    }
}

impl From<Box<dyn StdError + Send>> for NarwhalError {
    fn from(err: Box<dyn StdError + Send>) -> Self {
        NarwhalError::Traits(format_smolstr!("{}", err))
    }
}
