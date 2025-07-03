use serde::{Deserialize, Serialize};

use crate::*;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum RefinementStatus {
    RefinementNotFound,
    Refinement(Intent),
}

impl RefinementStatus {
    pub fn is_refinement(&self) -> bool {
        matches!(self, Self::Refinement(_))
    }

    pub fn get_intent(&self) -> Option<&Intent> {
        match self {
            Self::Refinement(intent) => Some(intent),
            Self::RefinementNotFound => None,
        }
    }
}
