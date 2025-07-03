use crate::{mirax_hash_bcs, Bytes, H256};
use mirax_primitive::traits::ScriptTrait;
use serde::{Deserialize, Serialize};

pub type Cycle = u64;

#[repr(u8)]
#[derive(Serialize, Deserialize, Copy, Clone, Debug, PartialEq, Eq, Hash)]
pub enum ScriptHashType {
    Data = 0,
    Type = 1,
}

impl From<u8> for ScriptHashType {
    fn from(value: u8) -> Self {
        match value {
            0 => ScriptHashType::Data,
            1 => ScriptHashType::Type,
            _ => panic!("Invalid script hash type: {}", value),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct Script {
    pub code_hash: H256,
    pub hash_type: ScriptHashType,
    pub args: Bytes,
}

impl ScriptTrait for Script {
    fn hash(&self) -> H256 {
        self.calc_hash()
    }

    fn args(&self) -> Bytes {
        self.args.clone()
    }

    fn code_hash(&self) -> H256 {
        self.code_hash
    }

    fn hash_type(&self) -> u8 {
        self.hash_type as u8
    }
}
impl Script {
    pub fn calc_hash(&self) -> H256 {
        mirax_hash_bcs(self).unwrap()
    }

    pub fn as_bytes(&self) -> Bytes {
        let mut buf = self.code_hash.to_vec();
        buf.push(self.hash_type as u8);
        buf.extend_from_slice(&self.args);
        buf.into()
    }
}
