use crate::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum RefinementStatus {
    RefinementNotFound,
    Refinement(Intent),
}
