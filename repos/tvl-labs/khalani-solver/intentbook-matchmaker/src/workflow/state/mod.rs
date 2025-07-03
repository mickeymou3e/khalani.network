use crate::types::intent::Intent;
use crate::types::intent_bid::IntentBid;
use crate::types::spoke_chain_call_bid::SpokeChainCallBid;
use solver_common::types::proof_id::ProofId;
use std::collections::HashSet;

pub mod in_memory_state_manager;
pub mod state_manager;

#[derive(Debug, Clone)]
pub struct IntentState {
    pub intent: Intent,
    pub matched_bid: Option<IntentBid>,

    pub expected_proofs: HashSet<ProofId>,
    pub received_proofs: HashSet<ProofId>,
}

impl IntentState {
    pub fn new(intent: Intent) -> Self {
        IntentState {
            intent,
            matched_bid: None,
            expected_proofs: HashSet::default(),
            received_proofs: HashSet::default(),
        }
    }

    pub fn is_ready_to_settle(&self) -> bool {
        self.expected_proofs == self.received_proofs
    }

    pub fn handle_match(&mut self, intent_bid: IntentBid) {
        match &self.intent {
            Intent::SwapIntent(swap_intent) => {
                if let IntentBid::SwapIntentBid(swap_intent_bid) = &intent_bid {
                    let proof_ids = swap_intent_bid.get_expected_proofs(swap_intent);
                    if let Ok(proof_ids) = proof_ids {
                        self.expected_proofs.extend(proof_ids);
                    }
                }
            }
            Intent::SpokeChainCall(spoke_chain_call) => {
                if let IntentBid::SpokeChainCallBid(spoke_chain_call_bid) = &intent_bid {
                    let proof_ids = SpokeChainCallBid::get_expected_proofs(
                        spoke_chain_call.intent_id,
                        spoke_chain_call,
                        spoke_chain_call_bid,
                    );
                    if let Ok(proof_ids) = proof_ids {
                        self.expected_proofs.extend(proof_ids);
                    }
                }
            }
            Intent::LimitOrder(..) => {
                // No op for limit orders because their match and settlement is atomic.
            }
        }
    }
}
