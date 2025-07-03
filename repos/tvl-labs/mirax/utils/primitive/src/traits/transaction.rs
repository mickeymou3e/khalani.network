use crate::traits::{
    AtomicTrait, BasicTrait, CellDepTrait, CellInputTrait, CellOutputTrait, ProofTrait,
};
use crate::{Bytes, H256, U16};

pub trait TransactionTrait: BasicTrait + AtomicTrait {
    type Input: CellInputTrait;

    type Output: CellOutputTrait;

    type Proof: ProofTrait;

    type CellDep: CellDepTrait;

    fn inputs(&self) -> &[Self::Input];

    fn inputs_iter(&self) -> impl Iterator<Item = &Self::Input>;

    fn outputs(&self) -> &[Self::Output];

    fn outputs_iter(&self) -> impl Iterator<Item = &Self::Output>;

    fn outputs_data(&self) -> &[Bytes];

    fn witnesses(&self) -> &[Bytes];

    fn witnesses_iter(&self) -> impl Iterator<Item = &Bytes>;

    fn proofs(&self) -> &[Self::Proof];

    fn proofs_iter(&self) -> impl Iterator<Item = &Self::Proof>;

    fn hash(&self) -> H256;

    fn version(&self) -> U16;

    fn header_deps(&self) -> &[H256];

    fn cell_deps(&self) -> &[Self::CellDep];
}
