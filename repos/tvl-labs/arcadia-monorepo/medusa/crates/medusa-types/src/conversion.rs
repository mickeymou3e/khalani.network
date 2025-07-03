use alloy::primitives::Signature;

use crate::common::*;
use crate::events::{AssetReserveDeposit as RpcAssetReserveDeposit, XChainEvent as RpcXChainEvent};
use crate::intents::{
    FillStructure as RpcFillStructure, Intent as RpcIntent, IntentState as RpcIntentState,
    Outcome as RpcOutcome, OutcomeAssetStructure as RpcOutcomeAssetStructure,
    SignedIntent as RpcSignedIntent,
};
use crate::receipt::Receipt as RpcReceipt;
use crate::sol_types::*;
use crate::solution::{
    FillRecord as RpcFillRecord, MoveRecord as RpcMoveRecord, OutType as RpcOutType,
    OutputIdx as RpcOutputIdx, SignedSolution as RpcSignedSolution, Solution as RpcSolution,
};

pub trait RpcType {}

pub trait SolidityType {}

pub trait RpcToSol {
    type SolType: SolidityType; // choose associated type here over trait generic or function generic since each rpc type
    // has a single soltype.
    fn convert_to_sol_type(&self) -> Self::SolType;
}

pub trait SolToRpc {
    type RpcType: RpcType; // choose associated type here over trait generic or function generic since each rpc type
    // has a single soltype.
    fn convert_to_rpc_type(&self) -> Self::RpcType;
}

pub trait ToIntent {
    fn to_intent(&self) -> RpcIntent;
}

pub trait ToSolution {
    fn to_solution(&self) -> RpcSolution;
}

pub mod rpc_to_sol {
    use super::*;
    impl RpcToSol for RpcXChainEvent {
        type SolType = XChainEvent;

        fn convert_to_sol_type(&self) -> Self::SolType {
            XChainEvent {
                publisher: self.publisher,
                eventHash: self.event_hash,
                chainId: U256::from_le_bytes(self.chain_id.to_le_bytes()), // TODO: Check this works when, for example, the rpc type is
                                                                           // abi encoded, since this will be big endian
            }
        }
    }

    impl RpcToSol for RpcAssetReserveDeposit {
        type SolType = AssetReserveDeposit;

        fn convert_to_sol_type(&self) -> Self::SolType {
            AssetReserveDeposit {
                token: self.token,
                amount: self.amount,
                depositor: self.depositor,
            }
        }
    }
    impl RpcToSol for RpcOutcomeAssetStructure {
        type SolType = OutcomeAssetStructure;

        fn convert_to_sol_type(&self) -> Self::SolType {
            match self {
                RpcOutcomeAssetStructure::AnySingle => OutcomeAssetStructure::AnySingle,
                RpcOutcomeAssetStructure::Any => OutcomeAssetStructure::Any,
                RpcOutcomeAssetStructure::All => OutcomeAssetStructure::All,
            }
        }
    }

    impl RpcToSol for RpcFillStructure {
        type SolType = FillStructure;

        fn convert_to_sol_type(&self) -> Self::SolType {
            match self {
                RpcFillStructure::Exact => FillStructure::Exactly,
                RpcFillStructure::Minimum => FillStructure::Minimum,
                RpcFillStructure::PercentageFilled => FillStructure::PctFilled,
                RpcFillStructure::ConcreteRange => FillStructure::ConcreteRange,
            }
        }
    }

    impl RpcToSol for RpcOutcome {
        type SolType = Outcome;

        fn convert_to_sol_type(&self) -> Self::SolType {
            Outcome {
                mTokens: self.m_tokens.clone(),
                mAmounts: self.m_amounts.clone(),
                outcomeAssetStructure: self.outcome_asset_structure.convert_to_sol_type(),
                fillStructure: self.fill_structure.convert_to_sol_type(),
            }
        }
    }

    impl RpcToSol for RpcIntent {
        type SolType = Intent;

        fn convert_to_sol_type(&self) -> Self::SolType {
            Intent {
                author: self.author,
                ttl: self.ttl, // TODO: Check this works when, for example, the rpc type is
                // abi encoded, since this will be big endian
                nonce: self.nonce, // TODO: Check this works when, for example, the rpc type is
                // abi encoded, since this will be big endian
                srcMToken: self.src_m_token,
                srcAmount: self.src_amount,
                outcome: self.outcome.convert_to_sol_type(),
            }
        }
    }

    impl RpcToSol for RpcSignedIntent {
        type SolType = SignedIntent;

        fn convert_to_sol_type(&self) -> Self::SolType {
            SignedIntent {
                intent: self.intent.convert_to_sol_type(),
                signature: self.signature.as_bytes().to_vec().into(),
            }
        }
    }

    impl RpcToSol for RpcIntentState {
        type SolType = IntentState;

        fn convert_to_sol_type(&self) -> Self::SolType {
            match self {
                RpcIntentState::Open => IntentState::Open,
                RpcIntentState::Solved => IntentState::Solved,
                RpcIntentState::Expired => IntentState::Expired,
                RpcIntentState::Cancelled => IntentState::Cancelled,
                RpcIntentState::Error => IntentState::Error,
            }
        }
    }

    impl RpcToSol for RpcReceipt {
        type SolType = Receipt;

        fn convert_to_sol_type(&self) -> Self::SolType {
            Receipt {
                mToken: self.m_token,
                mTokenAmount: self.m_token_amount,
                owner: self.owner,
                intentHash: self.intent_hash,
            }
        }
    }

    impl RpcToSol for RpcOutType {
        type SolType = OutType;
        fn convert_to_sol_type(&self) -> Self::SolType {
            match self {
                RpcOutType::Intent => OutType::Intent,
                RpcOutType::Receipt => OutType::Receipt,
            }
        }
    }

    impl RpcToSol for RpcOutputIdx {
        type SolType = OutputIdx;

        fn convert_to_sol_type(&self) -> Self::SolType {
            OutputIdx {
                outType: self.out_type.convert_to_sol_type(),
                outIdx: self.out_idx,
            }
        }
    }

    impl RpcToSol for RpcMoveRecord {
        type SolType = MoveRecord;

        fn convert_to_sol_type(&self) -> Self::SolType {
            MoveRecord {
                srcIdx: self.src_idx,
                outputIdx: self.output_idx.convert_to_sol_type(),
                qty: self.qty,
            }
        }
    }

    impl RpcToSol for RpcFillRecord {
        type SolType = FillRecord;

        fn convert_to_sol_type(&self) -> Self::SolType {
            FillRecord {
                inIdx: self.in_idx,
                outIdx: self.out_idx,
                outType: self.out_type.convert_to_sol_type(),
            }
        }
    }

    impl RpcToSol for RpcSolution {
        type SolType = Solution;

        fn convert_to_sol_type(&self) -> Self::SolType {
            Solution {
                intentIds: self.intent_ids.clone(),
                intentOutputs: self
                    .intent_outputs
                    .clone()
                    .into_iter()
                    .map(|i| i.convert_to_sol_type())
                    .collect(),
                receiptOutputs: self
                    .receipt_outputs
                    .clone()
                    .into_iter()
                    .map(|r| r.convert_to_sol_type())
                    .collect(),
                spendGraph: self
                    .spend_graph
                    .clone()
                    .into_iter()
                    .map(|m| m.convert_to_sol_type())
                    .collect(),
                fillGraph: self
                    .fill_graph
                    .clone()
                    .into_iter()
                    .map(|f| f.convert_to_sol_type())
                    .collect(),
            }
        }
    }

    impl RpcToSol for RpcSignedSolution {
        type SolType = SignedSolution;

        fn convert_to_sol_type(&self) -> Self::SolType {
            SignedSolution {
                solution: self.solution.convert_to_sol_type(),
                signature: self.signature.as_bytes().to_vec().into(),
            }
        }
    }
}

pub mod sol_to_rpc {
    use super::*;

    impl SolToRpc for XChainEvent {
        type RpcType = RpcXChainEvent;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            RpcXChainEvent {
                publisher: self.publisher,
                event_hash: self.eventHash,
                chain_id: u64::from_be_bytes(self.chainId.to_be_bytes()),
            }
        }
    }

    impl SolToRpc for AssetReserveDeposit {
        type RpcType = RpcAssetReserveDeposit;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            RpcAssetReserveDeposit {
                token: self.token,
                amount: self.amount,
                depositor: self.depositor,
            }
        }
    }

    impl SolToRpc for OutcomeAssetStructure {
        type RpcType = RpcOutcomeAssetStructure;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            match self {
                OutcomeAssetStructure::AnySingle => RpcOutcomeAssetStructure::AnySingle,
                OutcomeAssetStructure::Any => RpcOutcomeAssetStructure::Any,
                OutcomeAssetStructure::All => RpcOutcomeAssetStructure::All,
                OutcomeAssetStructure::__Invalid => todo!(),
            }
        }
    }

    impl SolToRpc for FillStructure {
        type RpcType = RpcFillStructure;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            match self {
                FillStructure::Exactly => RpcFillStructure::Exact,
                FillStructure::Minimum => RpcFillStructure::Minimum,
                FillStructure::PctFilled => RpcFillStructure::PercentageFilled,
                FillStructure::ConcreteRange => RpcFillStructure::ConcreteRange,
                FillStructure::__Invalid => todo!(),
            }
        }
    }

    impl SolToRpc for Outcome {
        type RpcType = RpcOutcome;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            RpcOutcome {
                m_tokens: self.mTokens.clone(),
                m_amounts: self.mAmounts.clone(),
                outcome_asset_structure: self.outcomeAssetStructure.convert_to_rpc_type(),
                fill_structure: self.fillStructure.convert_to_rpc_type(),
            }
        }
    }

    impl SolToRpc for Intent {
        type RpcType = RpcIntent;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            RpcIntent {
                author: self.author,
                ttl: self.ttl, // TODO: Check this works when, for example, the rpc type is
                // abi encoded, since this will be big endian
                nonce: self.nonce, // TODO: Check this works when, for example, the rpc type is
                // abi encoded, since this will be big endian
                src_m_token: self.srcMToken,
                src_amount: self.srcAmount,
                outcome: self.outcome.convert_to_rpc_type(),
            }
        }
    }

    impl SolToRpc for SignedIntent {
        type RpcType = RpcSignedIntent;

        fn convert_to_rpc_type(&self) -> Self::RpcType {
            RpcSignedIntent {
                intent: self.intent.convert_to_rpc_type(),
                signature: Signature::from_raw(&self.signature).unwrap(),
            }
        }
    }
}
