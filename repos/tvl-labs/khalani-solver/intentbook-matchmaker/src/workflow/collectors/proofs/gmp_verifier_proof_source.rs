use std::sync::Arc;

use anyhow::Result;
use artemis_core::types::CollectorStream;
use async_trait::async_trait;
use bindings_khalani::gmp_event_verifier::{GMPEventVerifier, NewEventRegisteredFilter};
use ethers::contract::Event as ContractEvent;
use ethers::types::ValueOrArray;

use solver_common::config::addresses::VerifierConfig;
use solver_common::connectors::{Connector, RpcClient};
use solver_common::ethereum::event_indexer::{EventFetcher, EventSource};
use solver_common::types::proof_id::ProofId;

use crate::workflow::collectors::proofs::proofs_collector::ProofSource;

#[derive(Debug, Clone)]
pub struct GmpEventVerifierProofSource {
    event_verifier: GMPEventVerifier<RpcClient>,
    rpc_client: Arc<RpcClient>,
    verifier_config: VerifierConfig,
}

impl GmpEventVerifierProofSource {
    pub fn new(connector: Arc<Connector>, verifier_config: VerifierConfig) -> Self {
        let rpc_client = connector
            .get_rpc_client(verifier_config.verifier_chain_id)
            .unwrap();
        let event_verifier =
            GMPEventVerifier::new(verifier_config.verifier_address, rpc_client.clone());
        Self {
            rpc_client: rpc_client.clone(),
            event_verifier,
            verifier_config,
        }
    }
}

#[async_trait]
impl EventSource for GmpEventVerifierProofSource {
    type EventFilter = NewEventRegisteredFilter;
    type EventResult = ProofId;

    fn create_event_filter(&self) -> ContractEvent<Arc<RpcClient>, RpcClient, Self::EventFilter> {
        self.event_verifier
            .new_event_registered_filter()
            .address(ValueOrArray::Value(self.verifier_config.verifier_address))
    }

    fn parse_event(&self, event: Self::EventFilter) -> Option<Result<Self::EventResult>> {
        Some(Ok(event.event_hash.into()))
    }
}

#[async_trait]
impl ProofSource for GmpEventVerifierProofSource {
    async fn get_proof_ids_stream(&self) -> Result<CollectorStream<'_, ProofId>> {
        let event_fetcher = EventFetcher::new(
            format!("VerifierConfig {:?}", self.verifier_config),
            self.rpc_client.clone(),
            self.clone(),
        );
        event_fetcher.fetch_events().await
    }

    fn get_verifier_config(&self) -> VerifierConfig {
        self.verifier_config.clone()
    }
}
