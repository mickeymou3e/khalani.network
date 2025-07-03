use serde::{Deserialize, Serialize};
use smol_str::SmolStr;

pub type Cycle = u64;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum VerifyResult {
    Success(Cycle),
    Failure(SmolStr),
}

impl VerifyResult {
    pub fn is_success(&self) -> bool {
        matches!(self, VerifyResult::Success(_))
    }

    pub fn cycle(&self) -> Option<Cycle> {
        match self {
            VerifyResult::Success(cycle) => Some(*cycle),
            VerifyResult::Failure(_) => None,
        }
    }

    pub fn message(&self) -> Option<&str> {
        match self {
            VerifyResult::Success(_) => None,
            VerifyResult::Failure(message) => Some(message),
        }
    }
}
