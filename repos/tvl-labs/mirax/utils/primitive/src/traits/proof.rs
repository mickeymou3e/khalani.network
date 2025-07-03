use crate::traits::{AtomicTrait, BasicTrait};
use crate::H256;

pub trait ProofTrait: BasicTrait + AtomicTrait {
    fn script_hash(&self) -> H256;

    fn script_group_type(&self) -> u8;

    fn proof_program(&self) -> String;
}
