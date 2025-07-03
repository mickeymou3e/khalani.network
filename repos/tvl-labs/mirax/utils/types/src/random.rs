use std::vec;

use mirax_primitive::H512;

use crate::{
    BitVec, BlockEnvelope, CellDep, CellInput, CellOutput, Certificate, Header, OutPoint, Script,
    ScriptHashType, Transaction, TransactionBatch, TransactionChunk, WrappedTransaction, H256, U16,
};

impl Header {
    pub fn random() -> Self {
        Header {
            version: U16::from(0),
            block_number: rand::random(),
            parent_hash: H256::random(),
            live_cells_root: H256::random(),
            chunks_root: H256::random(),
            transactions_root: H256::random(),
            timestamp: rand::random(),
            extra_data: H256::random().to_vec().into(),
        }
    }
}

impl BlockEnvelope<H512> {
    pub fn random() -> Self {
        Self {
            header: Header::random(),
            cellbase: WrappedTransaction::random(0),
            chunks: vec![TransactionChunk::random()],
        }
    }
}

impl CellDep {
    pub fn random(dep: u8) -> Self {
        Self {
            out_point: OutPoint::random(),
            dep_type: dep.into(),
        }
    }
}

impl OutPoint {
    pub fn random() -> Self {
        Self {
            tx_hash: H256::random(),
            index: rand::random(),
        }
    }
}

impl CellInput {
    pub fn random() -> Self {
        Self {
            previous_output: OutPoint::random(),
            since: rand::random(),
        }
    }
}

impl CellOutput {
    pub fn random(lock_is_data: bool, type_is_data: Option<bool>) -> Self {
        Self {
            capacity: rand::random(),
            lock: Script::random(lock_is_data),
            type_: type_is_data.map(Script::random),
        }
    }
}

impl Certificate<H512> {
    pub fn random() -> Self {
        Self {
            number: rand::random(),
            previous_tx_batch_hash: H256::random(),
            signatures: vec![H512::random().as_slice().try_into().unwrap()],
            signer_bitmap: BitVec::from_elem(1, true),
        }
    }
}

impl WrappedTransaction {
    pub fn random(version: u16) -> Self {
        Transaction::random(version).into()
    }
}

impl TransactionBatch {
    pub fn random() -> Self {
        Self::new(
            rand::random(),
            vec![WrappedTransaction::random(0)],
            H256::random().into(),
        )
    }
}

impl TransactionChunk<H512> {
    pub fn random() -> Self {
        Self::new(TransactionBatch::random(), vec![Certificate::random()])
    }
}

impl Script {
    pub fn random(is_data: bool) -> Self {
        Self {
            code_hash: H256::random(),
            hash_type: if is_data {
                ScriptHashType::Data
            } else {
                ScriptHashType::Type
            },
            args: (0..32)
                .map(|_| rand::random::<u8>())
                .collect::<Vec<_>>()
                .into(),
        }
    }
}

impl Transaction {
    pub fn random(version: u16) -> Self {
        Self {
            version: U16::from(version),
            cell_deps: vec![CellDep::random(1)],
            header_deps: vec![H256::random()],
            inputs: vec![CellInput::random()],
            outputs: vec![CellOutput::random(true, Some(false))],
            outputs_data: vec![H256::random().to_vec().into()],
            witnesses: vec![H256::random().to_vec().into()],
            proofs: vec![],
        }
    }
}
