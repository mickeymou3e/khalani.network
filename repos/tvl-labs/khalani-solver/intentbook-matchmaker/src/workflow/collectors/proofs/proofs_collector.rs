use std::sync::Arc;

use anyhow::Result;
use artemis_core::types::{Collector, CollectorStream};
use async_trait::async_trait;
use futures::lock::Mutex;
use futures::StreamExt;
use tracing::{info, warn};

use solver_common::config::addresses::VerifierConfig;
use solver_common::types::proof_id::ProofId;

use crate::workflow::event::Event;
use crate::workflow::state::state_manager::StateManager;

#[async_trait]
pub trait ProofSource {
    async fn get_proof_ids_stream(&self) -> Result<CollectorStream<'_, ProofId>>;

    fn get_verifier_config(&self) -> VerifierConfig;
}

pub struct ProofsCollector<PS: ProofSource, SM: StateManager> {
    proof_source: PS,
    state_manager: Arc<Mutex<SM>>,
}

impl<PS: ProofSource, SM: StateManager> ProofsCollector<PS, SM> {
    pub fn new(proof_source: PS, state_manager: Arc<Mutex<SM>>) -> Self {
        ProofsCollector {
            proof_source,
            state_manager,
        }
    }
}

#[async_trait]
impl<PS: ProofSource + Sync + Send, SM: StateManager + Sync + Send> Collector<Event>
    for ProofsCollector<PS, SM>
{
    async fn get_event_stream(&self) -> Result<CollectorStream<'_, Event>> {
        let proof_ids_stream = self.proof_source.get_proof_ids_stream().await?;
        let verifier_config = self.proof_source.get_verifier_config();
        let proof_ids_stream = proof_ids_stream
            .filter_map(move |proof_id| self.handle_proof(proof_id, verifier_config.clone()));
        Ok(Box::pin(proof_ids_stream))
    }
}

impl<PS: ProofSource, SM: StateManager> ProofsCollector<PS, SM> {
    async fn handle_proof(
        &self,
        proof_id: ProofId,
        verifier_config: VerifierConfig,
    ) -> Option<Event> {
        info!(?verifier_config, ?proof_id, "Received new proof");
        let all_intents = self.state_manager.lock().await.get_all_intents();
        for intent in &all_intents {
            if intent.expected_proofs.contains(&proof_id) {
                info!(
                    ?verifier_config,
                    ?proof_id,
                    ?intent,
                    "Proof has been mapped to event"
                );
                return Some(Event::NewProofReceived(intent.intent.id(), proof_id));
            }
        }

        warn!(
            ?verifier_config,
            ?proof_id,
            "No mapping found for the proof"
        );
        None
    }
}
