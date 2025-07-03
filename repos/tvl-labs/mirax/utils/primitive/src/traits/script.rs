use crate::traits::{AtomicTrait, BasicTrait};
use crate::{Bytes, H256};

/// The trait for the script.
pub trait ScriptTrait: BasicTrait + AtomicTrait {
    /// The hash of the script.
    fn hash(&self) -> H256;

    /// The arguments of the script.
    fn args(&self) -> Bytes;

    /// The code hash of the script.
    fn code_hash(&self) -> H256;

    /// The hash type of the script.
    fn hash_type(&self) -> u8;
}
