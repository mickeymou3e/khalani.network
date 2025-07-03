use mirax_types::traits::{BlockEnvelopeTrait, CellMetaTrait, OutPointTrait, TransactionTrait};
use mirax_types::{Byte36, Bytes, Header, MiraxResult, VerifyResult, H256};

use crate::resolver::ResolvedTransaction;

pub trait CellProvider<Meta: CellMetaTrait> {
    fn get_cell(&self, out_point: &impl OutPointTrait) -> Option<Meta>;
}

pub trait CellDataProvider<Meta: CellMetaTrait> {
    fn get_cell_data(&self, key: Byte36) -> Option<Bytes>;

    fn get_cell_data_hash(&self, key: Byte36) -> Option<H256>;

    fn load_cell_data(&self, cell: &Meta) -> Option<Bytes> {
        cell.mem_cell_data()
            .as_ref()
            .cloned()
            .or_else(|| self.get_cell_data(cell.out_point().cell_key()))
    }

    fn load_cell_data_hash(&self, cell: &Meta) -> Option<H256> {
        cell.mem_cell_data_hash()
            .as_ref()
            .cloned()
            .or_else(|| self.get_cell_data_hash(cell.out_point().cell_key()))
    }
}

pub trait HeaderProvider {
    fn get_header(&self, hash: &H256) -> Option<Header>;
}

pub trait ExtensionProvider {
    fn get_block_extension(&self, hash: &H256) -> Option<Bytes>;
}

pub trait VerificationContext<M: CellMetaTrait>:
    CellProvider<M> + CellDataProvider<M> + HeaderProvider + ExtensionProvider
{
}

pub trait TransactionResolver {
    fn resolve_transaction(&self, tx: &impl TransactionTrait) -> MiraxResult<ResolvedTransaction>;
}

pub trait TransactionVerification<Tx: TransactionTrait> {
    fn verify_transaction(&self, tx: &Tx) -> MiraxResult<VerifyResult>;

    fn verify_transactions(&mut self, txs: Vec<Tx>) -> MiraxResult<Vec<VerifyResult>>;
}

pub trait BlockVerification<B: BlockEnvelopeTrait>:
    TransactionVerification<B::Transaction>
{
    fn verify_block(&mut self, block: &B) -> MiraxResult<Vec<VerifyResult>>;
}

pub trait TransactionVerifierBuilder<Tx: TransactionTrait> {
    fn build(&self, tx: &Tx) -> MiraxResult<Box<dyn TransactionVerification<Tx> + Send + Sync>>;
}

pub trait BlockVerifierBuilder<B: BlockEnvelopeTrait>:
    TransactionVerifierBuilder<B::Transaction>
{
    fn build(&self, block: &B) -> MiraxResult<Box<dyn BlockVerification<B> + Send + Sync>>;
}
