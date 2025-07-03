use ethers::types::{Address, H256, U256};
use serde::{Deserialize, Serialize};

// #[derive(Debug, Deserialize)]
// pub struct HyperlaneMessageStatusResponse {
//     pub status: String,
//     pub result: Vec<HyperlaneMessage>,
// }

// #[derive(Debug, Deserialize)]
// pub struct HyperlaneMessage {
//     pub id: String,
//     pub status: String,
//     pub sender: String,
//     pub recipient: String,
//     #[serde(rename = "originDomainId")]
//     pub origin_domain_id: u32,
//     #[serde(rename = "destinationDomainId")]
//     pub destination_domain_id: u32,
//     pub nonce: u64,
//     pub body: String,
//     #[serde(rename = "originTransaction")]
//     pub origin_transaction: HyperlaneTransaction,
//     #[serde(rename = "destinationTransaction")]
//     pub destination_transaction: HyperlaneTransaction,
// }

// #[derive(Debug, Deserialize)]
// pub struct HyperlaneTransaction {
//     #[serde(rename = "transactionHash")]
//     pub transaction_hash: String,
//     #[serde(rename = "blockNumber")]
//     pub block_number: u64,
//     #[serde(rename = "gasUsed")]
//     pub gas_used: u64,
//     pub from: String,
//     pub timestamp: u64,
// }

// #[derive(Debug)]
// pub struct IntentCreatedEvent {
//     pub intent_id: H256,
//     pub creator: ethers::types::Address,
// }

#[derive(Debug, Deserialize)]
pub enum IntentState {
    Created,
    Solved,
    Redeemed,
    Withdrawn,
    Error,
}

// #[derive(Debug, Deserialize, PartialEq)]
// #[serde(rename_all = "camelCase")]
// pub enum IntentErrorType {
//     HyperlaneError,
//     OtherError,
// }
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum IntentErrorType {
    Publish,
    Cancel,
    Redeem,
    Withdraw,
    WithdrawToSpoke,
}
#[derive(Default, Clone, Debug, Serialize, Deserialize)]
pub struct IntentHistory {
    pub publish_timestamp: Option<u64>,
    pub publish_tx_hash: Option<H256>,
    pub solve_timestamp: Option<u64>,
    pub solve_tx_hash: Option<H256>,
    pub redeem_timestamp: Option<u64>,
    pub redeem_tx_hash: Option<H256>,
    pub withdraw_timestamp: Option<u64>,
    pub withdraw_tx_hash: Option<H256>,
    pub withdraw_to_spoke_timestamp: Option<u64>,
    pub cancel_timestamp: Option<u64>,
    pub cancel_tx_hash: Option<H256>,
    pub remaining_intent_id: Option<H256>,
    pub error_timestamp: Option<u64>,
    pub error_tx_hash: Option<H256>,
    pub error_type: Option<IntentErrorType>,
}
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
