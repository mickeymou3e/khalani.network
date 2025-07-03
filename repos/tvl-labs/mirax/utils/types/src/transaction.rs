use mirax_primitive::traits::{ProofTrait, TransactionTrait};
use serde::{Deserialize, Serialize};

use crate::{mirax_hash_bcs, Bytes, CellDep, CellInput, CellOutput, H256, U16};

/// The transaction struct.
#[derive(Serialize, Deserialize, Default, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Transaction {
    /// The version of the transaction.
    pub version: U16,
    /// The cell dependencies of the transaction.
    pub cell_deps: Vec<CellDep>,
    /// The header dependencies of the transaction.
    pub header_deps: Vec<H256>,
    /// The inputs of the transaction.
    pub inputs: Vec<CellInput>,
    /// The outputs of the transaction.
    pub outputs: Vec<CellOutput>,
    /// The outputs data of the transaction.
    pub outputs_data: Vec<Bytes>,
    /// The witnesses of the transaction.
    pub witnesses: Vec<Bytes>,
    /// The proofs of the transaction.
    pub proofs: Vec<Proof>,
}

/// Implement the `TransactionTrait` for `Transaction`.
impl TransactionTrait for Transaction {
    type Input = CellInput;

    type Output = CellOutput;

    type CellDep = CellDep;

    type Proof = Proof;

    fn version(&self) -> U16 {
        self.version
    }

    fn hash(&self) -> H256 {
        self.calc_hash()
    }

    fn header_deps(&self) -> &[H256] {
        &self.header_deps
    }

    fn cell_deps(&self) -> &[CellDep] {
        &self.cell_deps
    }

    fn inputs(&self) -> &[CellInput] {
        &self.inputs
    }

    fn inputs_iter(&self) -> impl Iterator<Item = &CellInput> {
        self.inputs.iter()
    }

    fn outputs(&self) -> &[CellOutput] {
        &self.outputs
    }

    fn outputs_iter(&self) -> impl Iterator<Item = &CellOutput> {
        self.outputs.iter()
    }

    fn outputs_data(&self) -> &[Bytes] {
        &self.outputs_data
    }

    fn witnesses(&self) -> &[Bytes] {
        &self.witnesses
    }

    fn witnesses_iter(&self) -> impl Iterator<Item = &Bytes> {
        self.witnesses.iter()
    }

    fn proofs(&self) -> &[Proof] {
        &self.proofs
    }

    fn proofs_iter(&self) -> impl Iterator<Item = &Proof> {
        self.proofs.iter()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Proof {
    pub proof_program: String,
    pub script_hash: H256,
    pub script_group_type: ScriptGroupType,
}

impl ProofTrait for Proof {
    fn script_hash(&self) -> H256 {
        self.script_hash
    }

    fn script_group_type(&self) -> u8 {
        (&self.script_group_type).into()
    }

    fn proof_program(&self) -> String {
        self.proof_program.clone()
    }
}

#[repr(u8)]
#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub enum ScriptGroupType {
    Lock = 0,
    Type = 1,
}

impl From<&ScriptGroupType> for u8 {
    fn from(value: &ScriptGroupType) -> Self {
        match value {
            ScriptGroupType::Lock => 0,
            ScriptGroupType::Type => 1,
        }
    }
}

impl From<u8> for ScriptGroupType {
    fn from(value: u8) -> Self {
        match value {
            0 => ScriptGroupType::Lock,
            1 => ScriptGroupType::Type,
            _ => unreachable!(),
        }
    }
}

impl Transaction {
    pub fn calc_hash(&self) -> H256 {
        #[derive(Serialize)]
        struct RawTransaction<'a> {
            pub version: U16,
            pub cell_deps: &'a [CellDep],
            pub header_deps: &'a [H256],
            pub inputs: &'a [CellInput],
            pub outputs: &'a [CellOutput],
            pub outputs_data: &'a [Bytes],
        }

        mirax_hash_bcs(&RawTransaction {
            version: self.version,
            cell_deps: &self.cell_deps,
            header_deps: &self.header_deps,
            inputs: &self.inputs,
            outputs: &self.outputs,
            outputs_data: &self.outputs_data,
        })
        .unwrap()
    }

    pub fn empty() -> Self {
        Self::default()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct WrappedTransaction {
    pub transaction: Transaction,
    pub hash: H256,
}

impl From<Transaction> for WrappedTransaction {
    fn from(transaction: Transaction) -> Self {
        let hash = transaction.calc_hash();
        WrappedTransaction { transaction, hash }
    }
}

impl TransactionTrait for WrappedTransaction {
    type Input = CellInput;

    type Output = CellOutput;

    type CellDep = CellDep;

    type Proof = Proof;

    fn version(&self) -> U16 {
        self.transaction.version
    }

    fn hash(&self) -> H256 {
        self.hash
    }

    fn header_deps(&self) -> &[H256] {
        &self.transaction.header_deps
    }

    fn cell_deps(&self) -> &[CellDep] {
        &self.transaction.cell_deps
    }

    fn inputs(&self) -> &[CellInput] {
        &self.transaction.inputs
    }

    fn inputs_iter(&self) -> impl Iterator<Item = &CellInput> {
        self.transaction.inputs_iter()
    }

    fn outputs(&self) -> &[CellOutput] {
        &self.transaction.outputs
    }

    fn outputs_iter(&self) -> impl Iterator<Item = &CellOutput> {
        self.transaction.outputs_iter()
    }

    fn outputs_data(&self) -> &[Bytes] {
        &self.transaction.outputs_data
    }

    fn witnesses(&self) -> &[Bytes] {
        &self.transaction.witnesses
    }

    fn witnesses_iter(&self) -> impl Iterator<Item = &Bytes> {
        self.transaction.witnesses_iter()
    }

    fn proofs(&self) -> &[Proof] {
        &self.transaction.proofs
    }

    fn proofs_iter(&self) -> impl Iterator<Item = &Proof> {
        self.transaction.proofs_iter()
    }
}
