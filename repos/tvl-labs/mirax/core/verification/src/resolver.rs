use mirax_types::{BlockNumber, Bytes, CellMeta, Proof, H256, U16};

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct TransactionInfo {
    pub block_hash: H256,
    pub block_number: BlockNumber,
    pub chunk_index: usize,
    pub tx_index: usize,
}

#[derive(Default, Clone, Debug, Hash, PartialEq, Eq)]
pub struct ResolvedTransaction {
    pub version: U16,
    pub hash: H256,
    pub resolved_cell_deps: Vec<CellMeta>,
    pub resolved_inputs: Vec<CellMeta>,
    pub resolved_outputs: Vec<CellMeta>,
    pub resolved_dep_groups: Vec<CellMeta>,
    pub header_deps: Vec<H256>,
    pub witnesses: Vec<Bytes>,
    pub proofs: Vec<Proof>,
}
