use crate::traits::{AtomicTrait, BasicTrait, ScriptTrait};
use crate::{Byte36, Bytes, H256};

/// The trait for cell output.
pub trait CellOutputTrait: BasicTrait + AtomicTrait {
    /// The script type.
    type Script: ScriptTrait;

    /// The capacity of the cell. This is reserved for future use.
    fn capacity(&self) -> u64;

    /// The lock script of the cell.
    fn lock(&self) -> &Self::Script;

    /// The type script of the cell.
    fn type_(&self) -> &Option<Self::Script>;
}

/// The trait for out point.
pub trait OutPointTrait: BasicTrait + AtomicTrait {
    /// The transaction hash of the out point.
    fn tx_hash(&self) -> H256;

    /// The index of the output cell in the transaction.
    fn index(&self) -> u32;

    fn cell_key(&self) -> Byte36;
}

/// The trait for cell input.
pub trait CellInputTrait: BasicTrait + AtomicTrait {
    /// The out point of the cell input.
    type OutPoint: OutPointTrait;

    /// The previous output of the cell input.
    fn previous_output(&self) -> &Self::OutPoint;

    /// The since of the cell input. This is reserved for future use.
    fn since(&self) -> u64;
}

/// The trait for cell dependency.
pub trait CellDepTrait: BasicTrait + AtomicTrait {
    /// The out point of the cell dependency.
    type OutPoint: OutPointTrait;

    /// The out point of the cell dependency.
    fn out_point(&self) -> &Self::OutPoint;

    /// The type of the cell dependency.
    fn dep_type(&self) -> u8;
}

/// The trait for cell verify.
pub trait CellVerifyTrait: BasicTrait + AtomicTrait {
    /// The script type.
    type Script: ScriptTrait;

    /// Verify the cell.
    fn verify(&self, script: &Self::Script) -> u8;
}

pub trait CellMetaTrait: BasicTrait + AtomicTrait {
    type Script: ScriptTrait;

    type OutPoint: OutPointTrait;

    fn capacity(&self) -> u64;

    fn lock(&self) -> &Self::Script;

    fn type_(&self) -> &Option<Self::Script>;

    fn out_point(&self) -> &Self::OutPoint;

    fn data_bytes(&self) -> u64;

    fn mem_cell_data(&self) -> Option<Bytes>;

    fn mem_cell_data_hash(&self) -> Option<H256>;
}
