use std::{collections::HashMap, sync::Arc};

use mirax_hasher::{Blake3Hasher, Digest};
use mirax_types::{
    Byte36, Bytes, CellMeta, CellOutput, H256, Header, OutPoint, traits::OutPointTrait,
};
use mirax_verification::{
    CellDataProvider, CellProvider, ExtensionProvider, HeaderProvider, VerificationContext,
};
use serde::{Deserialize, Serialize};
use serde_with::{Seq, serde_as};

#[serde_as]
#[derive(Deserialize, Serialize, Clone)]
pub struct JsonContext {
    #[serde_as(as = "Arc<Seq<(_, _)>>")]
    pub cells: Arc<HashMap<OutPoint, JsonCell>>,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct JsonCell {
    pub cell_output: CellOutput,
    pub data: Bytes,
}

// Is this already implemented in mirax?
fn key_to_out_point(key: &Byte36) -> OutPoint {
    let tx_hash = key[..32].try_into().unwrap();
    let index = u32::from_le_bytes(key[32..].try_into().unwrap());
    OutPoint::new(tx_hash, index)
}

impl CellProvider<CellMeta> for JsonContext {
    fn get_cell(&self, out_point: &impl OutPointTrait) -> Option<CellMeta> {
        let out_point = OutPoint::new(out_point.tx_hash(), out_point.index());
        self.cells.get(&out_point).map(|c| CellMeta {
            capacity: c.cell_output.capacity,
            lock: c.cell_output.lock.clone(),
            type_: c.cell_output.type_.clone(),
            out_point,
            data_bytes: c.data.len() as u64,
            mem_cell_data: Some(c.data.clone()),
            mem_cell_data_hash: Some(Blake3Hasher::digest(&c.data)),
        })
    }
}

impl CellDataProvider<CellMeta> for JsonContext {
    fn get_cell_data(&self, key: Byte36) -> Option<Bytes> {
        self.cells
            .get(&key_to_out_point(&key))
            .map(|c| c.data.clone())
    }

    fn get_cell_data_hash(&self, key: Byte36) -> Option<H256> {
        self.cells
            .get(&key_to_out_point(&key))
            .map(|c| Blake3Hasher::digest(&c.data))
    }
}

impl HeaderProvider for JsonContext {
    fn get_header(&self, _: &H256) -> Option<Header> {
        None
    }
}

impl ExtensionProvider for JsonContext {
    fn get_block_extension(&self, _: &H256) -> Option<Bytes> {
        None
    }
}

impl VerificationContext<CellMeta> for JsonContext {}
