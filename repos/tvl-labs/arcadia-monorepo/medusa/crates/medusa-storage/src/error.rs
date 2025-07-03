use alloy::primitives::Address;
use medusa_types::{B256, IntentId, U256};
use thiserror::Error;

#[derive(Clone, Debug, Error)]
pub enum StorageError {
    #[error("Can not find intent {0}")]
    CanNotFindIntent(IntentId),
    #[error("Can not find solver {0}")]
    CanNotFindSolver(Address),
    #[error("Can not find solution {0}")]
    CanNotFindSolution(B256),
    #[error("Can not find raw solution {0}")]
    CanNotFindRawSolution(B256),
    #[error("Can not find intent history {0}")]
    CanNotFindIntentHistory(IntentId),
    #[error("Can not find refinement {0}")]
    CanNotFindRefinement(IntentId),
    #[error("Nonce {0} is not unique")]
    NonceUniqueCheckFailed(U256),
}
