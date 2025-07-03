use flume::SendError;
use smol_str::{format_smolstr, SmolStr};
use thiserror::Error;

use mirax_error::impl_into_mirax_error;
use mirax_types::H256;

#[derive(Clone, Debug, Error)]
pub enum MempoolError {
    #[error("Channel sending message: {0}")]
    ChannelSend(SmolStr),

    #[error("Channel receiving message: {0}")]
    ChannelRecv(#[from] flume::RecvError),

    #[error("Duplicate transaction: {0}")]
    DuplicateTransaction(H256),
}

impl_into_mirax_error!(MempoolError, Mempool);

impl<T> From<SendError<T>> for MempoolError {
    fn from(err: SendError<T>) -> Self {
        MempoolError::ChannelSend(format_smolstr!("{}", err))
    }
}
