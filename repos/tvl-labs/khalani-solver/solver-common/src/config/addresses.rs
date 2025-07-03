use crate::config::chain::ChainId;
use ethers::types::Address;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AddressesConfigRaw {
    pub intents_mempool_address: String,
    pub settlement_reactor_address: String,
    pub escrows: HashMap<String, String>,
    pub verifiers: HashMap<String, HashMap<String, String>>,
    pub swap_intent_fillers: HashMap<String, String>,
    pub intentbook_addresses: IntentbookAddressesRaw,
    pub spoke_chain_executors: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IntentbookAddressesRaw {
    pub limit_order_intentbook: String,
    pub spoke_chain_call_intentbook: String,
    pub swap_intent_intentbook: String,
}

#[derive(Debug, Clone)]
pub struct VerifierConfig {
    pub verifier_chain_id: ChainId,
    pub prover_chain_id: ChainId,
    pub verifier_address: Address,
}

#[derive(Debug, Clone)]
pub struct IntentbookAddresses {
    pub limit_order_intentbook: Address,
    pub spoke_chain_call_intentbook: Address,
    pub swap_intent_intentbook: Address,
}

#[derive(Debug, Clone)]
pub enum IntentbookType {
    LimitOrderIntentBook,
    SpokeChainCallIntentBook,
    SwapIntentIntentBook,
}

#[derive(Debug, Clone)]
pub struct AddressesConfig {
    pub intents_mempool_address: Address,
    pub settlement_reactor_address: Address,
    pub escrows: HashMap<ChainId, Address>,
    pub verifiers: Vec<VerifierConfig>,
    pub swap_intent_fillers: HashMap<ChainId, Address>,
    pub intentbook_addresses: IntentbookAddresses,
    pub spoke_chain_executor_addresses: HashMap<ChainId, Address>,
}
