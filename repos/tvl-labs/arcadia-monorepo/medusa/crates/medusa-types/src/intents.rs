use std::time::{SystemTime, UNIX_EPOCH};

use alloy::primitives::{Address, Signature, U256, keccak256};
use alloy::signers::local::PrivateKeySigner;
use alloy::sol_types::SolValue;
use anyhow::Result;
use serde::{Deserialize, Serialize};

use super::sol_types::eip712_intent_hash;
use crate::common::*;
use crate::conversion::*;
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Clone)]
#[serde(rename = "OutcomeAssetStructure")]
pub enum OutcomeAssetStructure {
    AnySingle,
    Any,
    All,
}

impl From<OutcomeAssetStructure> for u8 {
    fn from(outcome_asset_structure: OutcomeAssetStructure) -> u8 {
        match outcome_asset_structure {
            OutcomeAssetStructure::AnySingle => 0,
            OutcomeAssetStructure::Any => 1,
            OutcomeAssetStructure::All => 2,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Clone)]
#[serde(rename = "FillStructure")]
pub enum FillStructure {
    Exact,
    Minimum,
    PercentageFilled,
    ConcreteRange,
}

impl From<FillStructure> for u8 {
    fn from(fill_structure: FillStructure) -> u8 {
        match fill_structure {
            FillStructure::Exact => 0,
            FillStructure::Minimum => 1,
            FillStructure::PercentageFilled => 2,
            FillStructure::ConcreteRange => 3,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Outcome {
    pub m_tokens: Vec<Address>,
    pub m_amounts: Vec<U256>,
    pub outcome_asset_structure: OutcomeAssetStructure,
    pub fill_structure: FillStructure,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Intent {
    pub author: Address,
    pub ttl: U256,
    pub nonce: U256,
    pub src_m_token: Address,
    pub src_amount: U256,
    pub outcome: Outcome,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SignedIntent {
    pub intent: Intent,
    pub signature: Signature,
}

impl SignedIntent {
    pub fn intent_id(&self) -> B256 {
        self.intent.intent_id()
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[repr(u8)]
pub enum IntentState {
    Open,
    Solved,
    Expired,
    Cancelled,
    Error,
}

impl From<IntentState> for i16 {
    fn from(state: IntentState) -> Self {
        match state {
            IntentState::Open => 0,
            IntentState::Solved => 1,
            IntentState::Expired => 2,
            IntentState::Cancelled => 3,
            IntentState::Error => 4,
        }
    }
}

impl From<u8> for IntentState {
    fn from(state: u8) -> Self {
        match state {
            0 => IntentState::Open,
            1 => IntentState::Solved,
            2 => IntentState::Expired,
            3 => IntentState::Cancelled,
            4 => IntentState::Error,
            _ => panic!("Invalid intent state"),
        }
    }
}

impl RpcType for Intent {}
impl RpcType for SignedIntent {}
impl RpcType for IntentState {}
impl RpcType for OutcomeAssetStructure {}
impl RpcType for FillStructure {}
impl RpcType for Outcome {}

impl Intent {
    pub fn simple_swap(
        author: Address,
        ttl: U256,
        nonce: Option<U256>,
        src_m_token: Address,
        src_amount: impl Into<U256> + Copy,
        output_m_token: Address,
        output_amount: U256,
    ) -> Self {
        let nonce = nonce.unwrap_or(U256::from(1_u64));
        let outcome = Outcome {
            m_tokens: vec![output_m_token],
            m_amounts: vec![output_amount],
            outcome_asset_structure: OutcomeAssetStructure::AnySingle,
            fill_structure: FillStructure::Exact,
        };
        Intent {
            author,
            ttl,
            nonce,
            src_m_token,
            src_amount: src_amount.into(),
            outcome,
        }
    }

    pub async fn sign(&self, signer: PrivateKeySigner, intent_book: Address) -> SignedIntent {
        let hash = eip712_intent_hash(self, intent_book);
        let sig = signer.sign_hash(&hash).await.unwrap();
        SignedIntent {
            intent: self.clone(),
            signature: sig,
        }
    }

    pub fn intent_hash(&self) -> B256 {
        let sol_intent = self.convert_to_sol_type(); //
        keccak256(sol_intent.abi_encode())
    }

    pub fn intent_id(&self) -> B256 {
        self.intent_hash()
    }
}

pub type IntentId = B256;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SignedIntentId {
    pub intent_id: IntentId,
    pub signature: Signature,
}

pub type IntentUpdate = (IntentId, IntentState);

#[derive(Default, Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct IntentHistory {
    pub publish_timestamp: Option<u64>,
    pub publish_tx_hash: Option<B256>,
    pub solve_timestamp: Option<u64>,
    pub solve_tx_hash: Option<B256>,
    pub redeem_timestamp: Option<u64>,
    pub redeem_tx_hash: Option<B256>,
    pub withdraw_timestamp: Option<u64>,
    pub withdraw_tx_hash: Option<B256>,
    pub withdraw_to_spoke_timestamp: Option<u64>,
    pub cancel_timestamp: Option<u64>,
    pub cancel_tx_hash: Option<B256>,
    pub remaining_intent_id: Option<IntentId>,
    pub error_timestamp: Option<u64>,
    pub error_tx_hash: Option<B256>,
    pub error_type: Option<IntentErrorType>,
}

impl IntentHistory {
    pub fn update_field(&mut self, event: IntentEvent) -> Result<()> {
        match event {
            IntentEvent::Publish(tx_hash) => {
                self.publish_timestamp = Some(current_timestamp());
                self.publish_tx_hash = Some(tx_hash);
            }
            IntentEvent::Solve(tx_hash, remaining_intent_id) => {
                self.solve_timestamp = Some(current_timestamp());
                self.solve_tx_hash = Some(tx_hash);
                self.remaining_intent_id = remaining_intent_id;
            }
            IntentEvent::Redeem(tx_hash) => {
                self.redeem_timestamp = Some(current_timestamp());
                self.redeem_tx_hash = Some(tx_hash);
            }
            IntentEvent::Withdraw(tx_hash) => {
                self.withdraw_timestamp = Some(current_timestamp());
                self.withdraw_tx_hash = Some(tx_hash);
            }
            IntentEvent::WithdrawReachSpoke() => {
                self.withdraw_to_spoke_timestamp = Some(current_timestamp());
            }
            IntentEvent::Cancel(tx_hash) => {
                self.cancel_timestamp = Some(current_timestamp());
                self.cancel_tx_hash = Some(tx_hash);
            }
            IntentEvent::Error(error_type, tx_hash) => {
                self.error_timestamp = Some(current_timestamp());
                self.error_tx_hash = Some(tx_hash);
                self.error_type = Some(error_type);
            }
        };
        Ok(())
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum IntentEvent {
    Publish(B256),
    Solve(B256, Option<IntentId>),
    Redeem(B256),
    Withdraw(B256),
    Cancel(B256),
    WithdrawReachSpoke(),
    Error(IntentErrorType, B256),
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[repr(u8)]
pub enum IntentErrorType {
    Publish,
    Cancel,
    Solve,
    Withdraw,
    WithdrawToSpoke,
}

impl From<u8> for IntentErrorType {
    fn from(error_type: u8) -> Self {
        match error_type {
            0 => IntentErrorType::Publish,
            1 => IntentErrorType::Cancel,
            2 => IntentErrorType::Solve,
            3 => IntentErrorType::Withdraw,
            4 => IntentErrorType::WithdrawToSpoke,
            _ => panic!("Invalid intent error type"),
        }
    }
}

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
