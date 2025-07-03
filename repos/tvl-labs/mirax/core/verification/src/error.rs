use mirax_error::impl_into_mirax_error;
use mirax_types::{Cycle, H256};
use thiserror::Error;

#[derive(Error, Debug, PartialEq, Eq, Clone)]
pub enum VerificationError {
    /// The field code_hash in script can't be resolved
    #[error("ScriptNotFound: code_hash: {0}")]
    ScriptNotFound(H256),

    /// The script consumes too much cycles
    #[error("ExceededMaximumCycles: expect cycles <= {0}")]
    ExceededMaximumCycles(Cycle),

    /// Internal error cycles overflow
    #[error("CyclesOverflow: lhs {0} rhs {1}")]
    CyclesOverflow(Cycle, Cycle),

    /// `script.type_hash` hits multiple cells with different data
    #[error("MultipleMatches")]
    MultipleMatches,

    /// Non-zero exit code returns by script
    #[error("ValidationFailure")]
    ValidationFailure,

    /// Known bugs are detected in transaction script outputs
    #[error("Known bugs encountered in output {1}: {0}")]
    EncounteredKnownBugs(String, usize),

    /// InvalidScriptHashType
    #[error("InvalidScriptHashType: {0}")]
    InvalidScriptHashType(String),

    /// InvalidVmVersion
    #[error("Invalid VM Version: {0}")]
    InvalidVmVersion(u8),

    /// Errors thrown by ckb-vm
    #[error("VM Internal Error")]
    VMInternalError,

    #[error("Failed to resolved cell {0:?}")]
    UnknownCell(String),

    /// Other errors raised in script execution process
    #[error("Other Error: {0}")]
    Other(String),
}

impl_into_mirax_error!(VerificationError, Verification);
