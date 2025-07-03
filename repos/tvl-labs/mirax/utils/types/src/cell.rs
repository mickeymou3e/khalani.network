use crate::{BlockNumber, Byte36, Bytes, Script, H256};
use mirax_primitive::traits::{
    CellDepTrait, CellInputTrait, CellMetaTrait, CellOutputTrait, OutPointTrait,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub enum DepType {
    Code,
    DepGroup,
}

impl From<u8> for DepType {
    fn from(v: u8) -> Self {
        match v {
            0 => DepType::Code,
            1 => DepType::DepGroup,
            _ => unreachable!(),
        }
    }
}

impl From<DepType> for u8 {
    fn from(v: DepType) -> Self {
        match v {
            DepType::Code => 0,
            DepType::DepGroup => 1,
        }
    }
}
#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct CellDep {
    pub out_point: OutPoint,
    pub dep_type: DepType,
}

impl CellDepTrait for CellDep {
    type OutPoint = OutPoint;

    fn out_point(&self) -> &Self::OutPoint {
        &self.out_point
    }

    fn dep_type(&self) -> u8 {
        self.dep_type.into()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct OutPoint {
    pub tx_hash: H256,
    pub index: u32,
}

impl OutPointTrait for OutPoint {
    fn tx_hash(&self) -> H256 {
        self.tx_hash
    }

    fn index(&self) -> u32 {
        self.index
    }

    fn cell_key(&self) -> Byte36 {
        generate_cell_key(&self.tx_hash, &self.index)
    }
}

impl OutPoint {
    pub fn new(tx_hash: H256, index: u32) -> Self {
        Self { tx_hash, index }
    }

    pub fn cell_key(&self) -> Byte36 {
        generate_cell_key(&self.tx_hash, &self.index)
    }

    pub fn as_bytes(&self) -> Bytes {
        let mut buf = self.tx_hash.to_vec();
        buf.extend_from_slice(&self.index.to_le_bytes());
        buf.into()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct CellInput {
    pub previous_output: OutPoint,
    pub since: u64,
}

impl CellInputTrait for CellInput {
    type OutPoint = OutPoint;

    fn previous_output(&self) -> &Self::OutPoint {
        &self.previous_output
    }

    fn since(&self) -> u64 {
        self.since
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct CellOutput {
    pub capacity: u64,
    pub lock: Script,
    pub type_: Option<Script>,
}

impl CellOutputTrait for CellOutput {
    type Script = Script;

    fn capacity(&self) -> u64 {
        self.capacity
    }

    fn lock(&self) -> &Self::Script {
        &self.lock
    }

    fn type_(&self) -> &Option<Self::Script> {
        &self.type_
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct CellEntry {
    pub output: CellOutput,
    pub block_hash: H256,
    pub block_number: BlockNumber,
    pub index: u32,
    pub data_size: u64,
}

pub fn generate_cell_key(tx_hash: &H256, index: &u32) -> Byte36 {
    let mut inner = [0u8; 36];
    inner[0..32].copy_from_slice(&tx_hash[..]);
    inner[32..36].copy_from_slice(&index.to_le_bytes());
    Byte36::new(inner)
}

#[derive(Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Eq)]
pub struct CellMeta {
    pub capacity: u64,
    pub lock: Script,
    pub type_: Option<Script>,
    pub out_point: OutPoint,
    pub data_bytes: u64,
    pub mem_cell_data: Option<Bytes>,
    pub mem_cell_data_hash: Option<H256>,
}

impl CellMetaTrait for CellMeta {
    type Script = Script;
    type OutPoint = OutPoint;

    fn capacity(&self) -> u64 {
        self.capacity
    }

    fn lock(&self) -> &Self::Script {
        &self.lock
    }

    fn type_(&self) -> &Option<Self::Script> {
        &self.type_
    }

    fn out_point(&self) -> &Self::OutPoint {
        &self.out_point
    }

    fn data_bytes(&self) -> u64 {
        self.data_bytes
    }

    fn mem_cell_data(&self) -> Option<Bytes> {
        self.mem_cell_data.clone()
    }

    fn mem_cell_data_hash(&self) -> Option<H256> {
        self.mem_cell_data_hash
    }
}
