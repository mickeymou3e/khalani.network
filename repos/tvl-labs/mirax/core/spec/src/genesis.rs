use mirax_merkle::binary::BinaryMerkleTree;
use mirax_time::system_time_as_millis;
use mirax_types::{
    Address, BlockEnvelope, Bytes, CellOutput, Header, Transaction, TransactionBatch,
    TransactionChunk, WrappedTransaction, GENESIS_NUMBER, H256, U16,
};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Genesis {
    pub version: U16,
    pub deployed_scripts: Vec<CellWithData>,
    pub initial_cells: Vec<CellWithData>,
}

impl Genesis {
    pub fn build<S: Serialize + DeserializeOwned>(&self) -> BlockEnvelope<S> {
        let txs = vec![self.build_deploy_script_tx(), self.build_cell_tx()];
        let transactions_root =
            BinaryMerkleTree::build_merkle_root(&txs.iter().map(|tx| tx.hash).collect::<Vec<_>>());
        let tx_batch = TransactionBatch::new(GENESIS_NUMBER, txs, Address::default());
        let tx_chunk = TransactionChunk::new(tx_batch, Vec::new());
        let chunks_root = BinaryMerkleTree::build_merkle_root(&[tx_chunk.hash()]);

        let header = Header {
            version: self.version,
            block_number: GENESIS_NUMBER,
            parent_hash: H256::ZERO,
            live_cells_root: H256::ZERO,
            chunks_root,
            transactions_root,
            timestamp: system_time_as_millis(),
            extra_data: Bytes::default(),
        };

        BlockEnvelope {
            header,
            cellbase: Transaction::empty().into(),
            chunks: vec![tx_chunk],
        }
    }

    fn build_deploy_script_tx(&self) -> WrappedTransaction {
        let (outputs, outputs_data) = Self::unzip_cell_with_data(self.deployed_scripts.clone());

        Transaction {
            version: self.version,
            outputs,
            outputs_data,
            ..Default::default()
        }
        .into()
    }

    fn build_cell_tx(&self) -> WrappedTransaction {
        let (outputs, outputs_data) = Self::unzip_cell_with_data(self.initial_cells.clone());

        Transaction {
            version: self.version,
            outputs,
            outputs_data,
            ..Default::default()
        }
        .into()
    }

    fn unzip_cell_with_data(v: Vec<CellWithData>) -> (Vec<CellOutput>, Vec<Bytes>) {
        v.iter()
            .map(|s| (s.cell_output.clone(), s.cell_data.clone()))
            .unzip()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CellWithData {
    pub cell_output: CellOutput,
    pub cell_data: Bytes,
}
