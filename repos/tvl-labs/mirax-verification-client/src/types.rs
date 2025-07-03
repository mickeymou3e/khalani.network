use std::{borrow::Cow, collections::HashMap};

use alloy_primitives::{FixedBytes, U16};
use bytes::Bytes;
use serde::{Deserialize, Serialize};
use serde_with::{DeserializeAs, Seq, SerializeAs, serde_as};

use crate::hash::{mirax_hash, mirax_hash_bcs};

#[serde_as]
#[derive(Deserialize, Serialize, Default)]
pub struct Context {
    #[serde_as(as = "Seq<(_, _)>")]
    pub cells: HashMap<OutPoint, Cell>,
}

impl Context {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn deploy_cell(&mut self, data: impl Into<Bytes>) -> OutPoint {
        self.deploy_cell_with_lock(
            data,
            Script {
                args: Bytes::new(),
                code_hash: [0u8; 32].into(),
                hash_type: ScriptHashType::Data,
            },
        )
    }

    pub fn deploy_cell_with_lock(&mut self, data: impl Into<Bytes>, lock: Script) -> OutPoint {
        let data = data.into();
        let out_point = OutPoint {
            tx_hash: rand::random::<[u8; 32]>().into(),
            index: rand::random(),
        };
        let cell_output = CellOutput {
            capacity: (data.len() + 200) as u64,
            lock,
            type_: None,
        };
        self.cells
            .insert(out_point.clone(), Cell { cell_output, data });
        out_point
    }

    pub fn deploy_cell_with_type_and_lock(
        &mut self,
        data: impl Into<Bytes>,
        _type: Script,
        lock: Script,
    ) -> OutPoint {
        let data = data.into();
        let out_point = OutPoint {
            tx_hash: rand::random::<[u8; 32]>().into(),
            index: rand::random(),
        };
        let cell_output = CellOutput {
            capacity: (data.len() + 200) as u64,
            lock,
            type_: Some(_type),
        };
        self.cells
            .insert(out_point.clone(), Cell { cell_output, data });
        out_point
    }

    pub fn build_script(&self, out_point: &OutPoint, args: impl Into<Bytes>) -> Script {
        let code_hash = mirax_hash(&self.cells[out_point].data);
        Script {
            code_hash,
            hash_type: ScriptHashType::Data,
            args: args.into(),
        }
    }
}

#[serde_as]
#[derive(Deserialize, Serialize)]
pub struct Cell {
    pub cell_output: CellOutput,
    #[serde_as(as = "HexOrBytes")]
    pub data: Bytes,
}

#[derive(Deserialize, Serialize)]
pub struct CellOutput {
    pub capacity: u64,
    pub lock: Script,
    pub type_: Option<Script>,
}

#[serde_as]
#[derive(Deserialize, Serialize, Clone)]
pub struct Script {
    pub code_hash: H256,
    pub hash_type: ScriptHashType,
    #[serde_as(as = "HexOrBytes")]
    pub args: Bytes,
}

impl Script {
    pub fn calc_hash(&self) -> H256 {
        mirax_hash_bcs(&self).unwrap()
    }
}

#[serde_as]
#[derive(Deserialize, Serialize, Default)]
pub struct Transaction {
    pub version: U16,

    pub cell_deps: Vec<CellDep>,

    pub header_deps: Vec<H256>,

    pub inputs: Vec<CellInput>,

    pub outputs: Vec<CellOutput>,

    #[serde_as(as = "Vec<HexOrBytes>")]
    pub outputs_data: Vec<Bytes>,

    #[serde_as(as = "Vec<HexOrBytes>")]
    pub witnesses: Vec<Bytes>,

    pub proofs: Vec<Proof>,
}

impl Transaction {
    /// Calculate the hash of the transaction.
    ///
    /// The hash doesn't cover the witnesses and the proofs.
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
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Hash, Clone)]
pub struct OutPoint {
    pub tx_hash: H256,
    pub index: u32,
}

#[derive(Serialize, Deserialize)]
pub struct CellInput {
    pub previous_output: OutPoint,
    pub since: u64,
}

#[derive(Serialize, Deserialize)]
pub struct Proof {
    pub proof_program: String,
    pub script_hash: H256,
    pub script_group_type: ScriptGroupType,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum ScriptHashType {
    Data,
    Type,
}

#[derive(Serialize, Deserialize)]
pub enum ScriptGroupType {
    Lock,
    Type,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum DepType {
    Code,
    DepGroup,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CellDep {
    pub out_point: OutPoint,
    pub dep_type: DepType,
}

pub type H256 = FixedBytes<32>;

/// In human readable formats, serialize as hex with the prefix "0x".
///
/// In non-human readable formats, serialize as bytes.
struct HexOrBytes;

impl<T> SerializeAs<T> for HexOrBytes
where
    T: AsRef<[u8]>,
{
    fn serialize_as<S>(value: &T, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        if serializer.is_human_readable() {
            let s = format!("0x{}", hex::encode(value.as_ref()));
            serializer.serialize_str(&s)
        } else {
            serializer.serialize_bytes(value.as_ref())
        }
    }
}

impl<'de, T> DeserializeAs<'de, T> for HexOrBytes
where
    T: From<Vec<u8>>,
{
    fn deserialize_as<D>(deserializer: D) -> Result<T, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        if deserializer.is_human_readable() {
            let s = <Cow<str>>::deserialize(deserializer)?;
            Ok(T::from(
                hex::decode(s.trim_start_matches("0x")).map_err(serde::de::Error::custom)?,
            ))
        } else {
            let bytes = <Vec<u8>>::deserialize(deserializer)?;
            Ok(T::from(bytes))
        }
    }
}

#[derive(Default)]
pub struct TransactionBuilder {
    tx: Transaction,
}

impl TransactionBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn cell_dep(mut self, out_point: OutPoint) -> Self {
        self.tx.cell_deps.push(CellDep {
            out_point,
            dep_type: DepType::Code,
        });
        self
    }

    pub fn input(mut self, previous_output: OutPoint) -> Self {
        self.tx.inputs.push(CellInput {
            previous_output,
            since: 0,
        });
        self
    }

    pub fn output(mut self, output: CellOutput, data: impl Into<Bytes>) -> Self {
        self.tx.outputs.push(output);
        self.tx.outputs_data.push(data.into());
        self
    }

    pub fn witness(mut self, witness: impl Into<Bytes>) -> Self {
        self.tx.witnesses.push(witness.into());
        self
    }

    /// Prove the condition of a lock script group.
    pub fn prove_lock(mut self, script_hash: H256, proof: impl Into<String>) -> Self {
        self.tx.proofs.push(Proof {
            script_group_type: ScriptGroupType::Lock,
            script_hash,
            proof_program: proof.into(),
        });
        self
    }

    /// Prove the condition of a type script group.
    pub fn prove_type(mut self, script_hash: H256, proof: impl Into<String>) -> Self {
        self.tx.proofs.push(Proof {
            script_group_type: ScriptGroupType::Type,
            script_hash,
            proof_program: proof.into(),
        });
        self
    }

    pub fn build(self) -> Transaction {
        self.tx
    }
}
