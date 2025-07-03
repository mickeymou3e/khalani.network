use mirax_types::BlockNumber;
use thiserror::Error;

#[derive(Clone, Debug, Error)]
pub enum BullsharkError {
    #[error("Leader lack support: own {0}")]
    LeaderLackSupport(usize),

    #[error("Discontinuity commit, missing {0:?}")]
    DiscontinuityCommit(Vec<BlockNumber>),

    #[error("Lack {0} certificates: own {1}, threshold {2}")]
    LackPreviousCertificates(BlockNumber, usize, usize),

    #[error("Traits error: {0}")]
    Traits(String),
}
