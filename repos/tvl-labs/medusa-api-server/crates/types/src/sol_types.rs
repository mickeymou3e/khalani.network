use crate::{
    conversion::{RpcToSol, SolidityType},
    intents,
    intents::Intent as RpcIntent,
    receipt, solution,
};
use alloy::{
    dyn_abi::{DynSolValue, Eip712Domain},
    primitives::{Address, B256},
    sol,
    sol_types::{eip712_domain, SolStruct},
};

sol! {
    struct XChainEvent {
        address publisher;
        bytes32 eventHash;
        uint256 chainId;
    }

    struct AssetReserveDeposit {
        address token;
        uint256 amount;
        address depositor;
    }


    enum OutcomeAssetStructure {
        AnySingle,
        Any,
        All
    }

    enum FillStructure {
        Exactly,
        Minimum,
        PctFilled,
        ConcreteRange
    }

    struct Outcome {
        address[] mTokens;
        uint256[] mAmounts;
        OutcomeAssetStructure outcomeAssetStructure;
        FillStructure fillStructure;
    }

    struct Intent {
        address author;
        uint256 ttl;
        uint256 nonce;
        address srcMToken;
        uint256 srcAmount;
        Outcome outcome;
    }

    struct SignedIntent {
        Intent intent;
        bytes signature;
    }

    enum IntentState {
        NonExistent,
        Locked,
        Settled,
        Open,
        Solved,
        Expired,
        Cancelled,
        Error,
    }

    struct Receipt {
        address mToken;
        uint256 mTokenAmount;
        address owner;
        bytes32 intentHash;
    }


    enum OutType {
        Intent,
        Receipt
    }

    struct OutputIdx {
        OutType outType;
        uint64 outIdx;
    }

    struct MoveRecord {
        uint64 srcIdx;
        OutputIdx outputIdx;
        uint256 qty;
    }

    struct FillRecord {
        uint64 inIdx;
        uint64 outIdx;
        OutType outType;
    }

    struct Solution {
        bytes32[] intentIds;
        Intent[] intentOutputs;
        Receipt[] receiptOutputs;
        MoveRecord[] spendGraph;
        FillRecord[] fillGraph;
    }

    struct SignedSolution {
        Solution solution;
        bytes signature;
    }
}

impl From<solution::OutType> for OutType {
    fn from(ot: solution::OutType) -> Self {
        match ot {
            solution::OutType::Intent => OutType::Intent,
            solution::OutType::Receipt => OutType::Receipt,
        }
    }
}

impl From<solution::OutputIdx> for OutputIdx {
    fn from(oi: solution::OutputIdx) -> Self {
        OutputIdx {
            outType: oi.out_type.into(),
            outIdx: oi.out_idx,
        }
    }
}

impl From<solution::MoveRecord> for MoveRecord {
    fn from(mr: solution::MoveRecord) -> Self {
        MoveRecord {
            srcIdx: mr.src_idx,
            outputIdx: mr.output_idx.into(),
            qty: mr.qty,
        }
    }
}

impl From<solution::FillRecord> for FillRecord {
    fn from(fr: solution::FillRecord) -> Self {
        FillRecord {
            inIdx: fr.in_idx,
            outIdx: fr.out_idx,
            outType: fr.out_type.into(),
        }
    }
}

impl From<receipt::Receipt> for Receipt {
    fn from(r: receipt::Receipt) -> Self {
        Receipt {
            mToken: r.m_token,
            mTokenAmount: r.m_token_amount,
            owner: r.owner,
            intentHash: r.intent_hash,
        }
    }
}

impl From<intents::OutcomeAssetStructure> for OutcomeAssetStructure {
    fn from(oas: intents::OutcomeAssetStructure) -> Self {
        match oas {
            intents::OutcomeAssetStructure::AnySingle => OutcomeAssetStructure::AnySingle,
            intents::OutcomeAssetStructure::Any => OutcomeAssetStructure::Any,
            intents::OutcomeAssetStructure::All => OutcomeAssetStructure::All,
        }
    }
}

impl From<intents::FillStructure> for FillStructure {
    fn from(fs: intents::FillStructure) -> Self {
        match fs {
            intents::FillStructure::Exact => FillStructure::Exactly,
            intents::FillStructure::Minimum => FillStructure::Minimum,
            intents::FillStructure::PercentageFilled => FillStructure::PctFilled,
            intents::FillStructure::ConcreteRange => FillStructure::ConcreteRange,
        }
    }
}

impl From<intents::Outcome> for Outcome {
    fn from(o: intents::Outcome) -> Self {
        Outcome {
            mTokens: o.m_tokens,
            mAmounts: o.m_amounts,
            outcomeAssetStructure: o.outcome_asset_structure.into(),
            fillStructure: o.fill_structure.into(),
        }
    }
}

impl From<intents::Intent> for Intent {
    fn from(i: intents::Intent) -> Self {
        Intent {
            author: i.author,
            ttl: i.ttl,
            nonce: i.nonce,
            srcMToken: i.src_m_token,
            srcAmount: i.src_amount,
            outcome: i.outcome.into(),
        }
    }
}

pub fn eip712_domain(verifying_contract: Address) -> Eip712Domain {
    eip712_domain! {
        name: "KhalaniIntent".to_string(),
        version: "1.0.0".to_string(),
        verifying_contract: verifying_contract,
    }
}

pub fn eip712_intent_hash(intent: &RpcIntent, intent_book: Address) -> B256 {
    let domain = eip712_domain(intent_book);
    intent.convert_to_sol_type().eip712_signing_hash(&domain)
}

// pub fn separate_intent_and_sig(intent: RpcIntent) -> (RpcIntent, Signature) {
//     let sig = intent.sig;
//     let intent = intent
//     (intent, sig)
// }

impl SolidityType for XChainEvent {}
impl SolidityType for AssetReserveDeposit {}
impl SolidityType for OutcomeAssetStructure {}
impl SolidityType for FillStructure {}
impl SolidityType for Outcome {}
impl SolidityType for Intent {}
impl SolidityType for SignedIntent {}
impl SolidityType for IntentState {}
impl SolidityType for Receipt {}
impl SolidityType for OutType {}
impl SolidityType for OutputIdx {}
impl SolidityType for MoveRecord {}
impl SolidityType for FillRecord {}
impl SolidityType for Solution {}
impl SolidityType for SignedSolution {}

impl From<XChainEvent> for DynSolValue {
    fn from(xce: XChainEvent) -> Self {
        DynSolValue::Tuple(vec![
            xce.publisher.into(),
            DynSolValue::FixedBytes(xce.eventHash, 32),
            xce.chainId.into(),
        ])
    }
}

impl From<AssetReserveDeposit> for DynSolValue {
    fn from(ard: AssetReserveDeposit) -> Self {
        DynSolValue::Tuple(vec![
            ard.token.into(),
            ard.amount.into(),
            ard.depositor.into(),
        ])
    }
}

impl From<OutcomeAssetStructure> for DynSolValue {
    fn from(oas: OutcomeAssetStructure) -> Self {
        match oas {
            OutcomeAssetStructure::AnySingle => 0u8,
            OutcomeAssetStructure::Any => 1,
            OutcomeAssetStructure::All => 2,
            _ => unreachable!(),
        }
        .into()
    }
}

impl From<FillStructure> for DynSolValue {
    fn from(fs: FillStructure) -> Self {
        match fs {
            FillStructure::Exactly => 0u8,
            FillStructure::Minimum => 1,
            FillStructure::PctFilled => 2,
            FillStructure::ConcreteRange => 3,
            _ => unreachable!(),
        }
        .into()
    }
}

impl From<Outcome> for DynSolValue {
    fn from(o: Outcome) -> Self {
        DynSolValue::Tuple(vec![
            DynSolValue::Array(o.mTokens.into_iter().map(Into::into).collect()),
            DynSolValue::Array(o.mAmounts.into_iter().map(Into::into).collect()),
            o.outcomeAssetStructure.into(),
            o.fillStructure.into(),
        ])
    }
}

impl From<Intent> for DynSolValue {
    fn from(i: Intent) -> Self {
        DynSolValue::Tuple(vec![
            i.author.into(),
            i.ttl.into(),
            i.nonce.into(),
            i.srcMToken.into(),
            i.srcAmount.into(),
            i.outcome.into(),
        ])
    }
}

impl From<SignedIntent> for DynSolValue {
    fn from(si: SignedIntent) -> Self {
        DynSolValue::Tuple(vec![si.intent.into(), si.signature.to_vec().into()])
    }
}

impl From<IntentState> for DynSolValue {
    fn from(is: IntentState) -> Self {
        match is {
            IntentState::NonExistent => 0u8,
            IntentState::Open => 1,
            IntentState::Locked => 2,
            IntentState::Solved => 3,
            IntentState::Settled => 4,
            IntentState::Expired => 5,
            IntentState::Cancelled => 6,
            IntentState::Error => 7,
            _ => unreachable!(),
        }
        .into()
    }
}

impl From<Receipt> for DynSolValue {
    fn from(r: Receipt) -> Self {
        DynSolValue::Tuple(vec![
            r.mToken.into(),
            r.mTokenAmount.into(),
            r.owner.into(),
            DynSolValue::FixedBytes(r.intentHash, 32),
        ])
    }
}

impl From<OutType> for DynSolValue {
    fn from(ot: OutType) -> Self {
        match ot {
            OutType::Intent => 0u8,
            OutType::Receipt => 1,
            _ => unreachable!(),
        }
        .into()
    }
}

impl From<OutputIdx> for DynSolValue {
    fn from(oi: OutputIdx) -> Self {
        DynSolValue::Tuple(vec![oi.outType.into(), oi.outIdx.into()])
    }
}

impl From<MoveRecord> for DynSolValue {
    fn from(mr: MoveRecord) -> Self {
        DynSolValue::Tuple(vec![mr.srcIdx.into(), mr.outputIdx.into(), mr.qty.into()])
    }
}

impl From<FillRecord> for DynSolValue {
    fn from(fr: FillRecord) -> Self {
        DynSolValue::Tuple(vec![fr.inIdx.into(), fr.outIdx.into()])
    }
}

impl From<Solution> for DynSolValue {
    fn from(s: Solution) -> Self {
        DynSolValue::Tuple(vec![
            DynSolValue::Array(
                s.intentIds
                    .into_iter()
                    .map(|id| DynSolValue::FixedBytes(id, 32))
                    .collect(),
            ),
            DynSolValue::Array(s.intentOutputs.into_iter().map(Into::into).collect()),
            DynSolValue::Array(s.receiptOutputs.into_iter().map(Into::into).collect()),
            DynSolValue::Array(s.spendGraph.into_iter().map(Into::into).collect()),
            DynSolValue::Array(s.fillGraph.into_iter().map(Into::into).collect()),
        ])
    }
}

impl From<SignedSolution> for DynSolValue {
    fn from(ss: SignedSolution) -> Self {
        DynSolValue::Tuple(vec![ss.solution.into(), ss.signature.to_vec().into()])
    }
}
