use crate::{
    common::*,
    conversion::{RpcToSol, RpcType},
    intents::Intent,
    receipt::Receipt,
};
use alloy::primitives::keccak256;
use alloy::signers::local::PrivateKeySigner;
use alloy::signers::Signer;
use alloy::sol_types::SolValue;
use serde::{Deserialize, Serialize};

#[derive(PartialEq, Debug, Serialize, Deserialize, Clone)]
pub enum OutType {
    Intent,
    Receipt,
}

impl From<OutType> for u8 {
    fn from(out_type: OutType) -> u8 {
        match out_type {
            OutType::Intent => 0,
            OutType::Receipt => 1,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OutputIdx {
    pub out_type: OutType,
    pub out_idx: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MoveRecord {
    pub src_idx: u64,
    pub output_idx: OutputIdx,
    pub qty: U256,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FillRecord {
    pub in_idx: u64,
    pub out_idx: u64,
    pub out_type: OutType,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Solution {
    pub intent_ids: Vec<B256>,
    pub intent_outputs: Vec<Intent>,
    pub receipt_outputs: Vec<Receipt>,
    pub spend_graph: Vec<MoveRecord>,
    pub fill_graph: Vec<FillRecord>,
}

impl Solution {
    pub async fn sign(&self, signer: &PrivateKeySigner) -> SignedSolution {
        let signature = signer
            .sign_hash(&keccak256(self.convert_to_sol_type().abi_encode()))
            .await
            .unwrap();
        SignedSolution {
            solution: self.clone(),
            signature,
        }
    }
}

// impl Solution {
//     pub fn hash(&self) -> B256 {
//         eip712_solution_hash(&sol_types::Solution {
//             intentIds: self.intent_ids.clone(),
//             intentOutputs: self
//                 .intent_outputs
//                 .clone()
//                 .into_iter()
//                 .map(Into::into)
//                 .collect(),
//             receiptOutputs: self
//                 .receipt_outputs
//                 .clone()
//                 .into_iter()
//                 .map(Into::into)
//                 .collect(),
//             spendGraph: self
//                 .spend_graph
//                 .clone()
//                 .into_iter()
//                 .map(Into::into)
//                 .collect(),
//             fillGraph: self
//                 .fill_graph
//                 .clone()
//                 .into_iter()
//                 .map(Into::into)
//                 .collect(),
//         })
//     }
// }

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SignedSolution {
    pub solution: Solution,
    pub signature: Signature,
}

impl SignedSolution {
    pub fn hash(&self) -> B256 {
        keccak256(self.solution.convert_to_sol_type().abi_encode())
    }

    pub fn recover_address(&self) -> Address {
        let hash = self.hash();
        self.signature.recover_address_from_prehash(&hash).unwrap()
    }
}

impl RpcType for Solution {}
impl RpcType for SignedSolution {}
impl RpcType for OutType {}
impl RpcType for OutputIdx {}
impl RpcType for MoveRecord {}
impl RpcType for FillRecord {}
