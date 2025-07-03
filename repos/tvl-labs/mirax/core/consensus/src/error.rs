use mirax_error::impl_into_mirax_error;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConsensusError {}

impl_into_mirax_error!(ConsensusError, Consensus);
