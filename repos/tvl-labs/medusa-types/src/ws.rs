use crate::*;
use alloy::primitives::Address;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum WsPayload {
    IntentRefinement(IntentId, RefinementStatus),
    GetSolutionsForIntent(IntentId),
    GetSolutionsForSolver(Address),
    AddSolver(Address),
    ProposeSolution(SignedSolution),
    RequestOpenIntents,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum WsBroadcastMessage {
    IntentStatusUpdated(IntentId, IntentState),
    RefinementNeededForIntent(Intent),
    NewIntent(Intent),
    IntentsSolved(Vec<IntentId>, Address),
    Solutions(u128, Vec<Solution>),
    ExistingOpenIntents(Vec<Intent>),
    SolutionRejected(SignedSolution),
}
