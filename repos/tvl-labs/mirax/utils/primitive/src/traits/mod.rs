mod block;
mod cell;
mod proof;
mod script;
mod transaction;

pub use block::{BlockEnvelopeTrait, BlockHeaderTrait};
pub use cell::{
    CellDepTrait, CellInputTrait, CellMetaTrait, CellOutputTrait, CellVerifyTrait, OutPointTrait,
};
pub use proof::ProofTrait;
pub use script::ScriptTrait;
pub use transaction::TransactionTrait;

use serde::{de::DeserializeOwned, Serialize};
use std::fmt::Debug;
use std::hash::Hash;

pub trait BasicTrait: Clone + Debug + PartialEq + Eq + Hash + Serialize + DeserializeOwned {}

impl<T> BasicTrait for T where
    T: Clone + Debug + PartialEq + Eq + Hash + Serialize + DeserializeOwned
{
}

pub trait AtomicTrait: Send + Sync {}

impl<T> AtomicTrait for T where T: Send + Sync {}
