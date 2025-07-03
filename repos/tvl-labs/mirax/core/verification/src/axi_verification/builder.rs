use std::sync::Arc;

use mirax_types::traits::{BlockEnvelopeTrait, TransactionTrait};
use mirax_types::{CellMeta, MiraxResult};

use crate::{
    AxiVerifier, BlockVerification, BlockVerifierBuilder, TransactionVerification,
    TransactionVerifierBuilder, VerificationContext,
};

pub struct AxiVerifierBuilder<Cx: VerificationContext<CellMeta>> {
    ctx: Arc<Cx>,
}

impl<Cx: VerificationContext<CellMeta> + Send + Sync + 'static, Tx: TransactionTrait>
    TransactionVerifierBuilder<Tx> for AxiVerifierBuilder<Cx>
{
    fn build(&self, tx: &Tx) -> MiraxResult<Box<dyn TransactionVerification<Tx> + Send + Sync>> {
        AxiVerifier::new(self.ctx.clone(), tx)
            .map(|v| Box::new(v) as Box<dyn TransactionVerification<Tx> + Send + Sync>)
    }
}

impl<Cx: VerificationContext<CellMeta> + Send + Sync + 'static, B: BlockEnvelopeTrait>
    BlockVerifierBuilder<B> for AxiVerifierBuilder<Cx>
where
    AxiVerifier<Cx>: BlockVerification<B>,
{
    fn build(&self, block: &B) -> MiraxResult<Box<dyn BlockVerification<B> + Send + Sync>> {
        AxiVerifier::new(self.ctx.clone(), block.cellbase())
            .map(|v| Box::new(v) as Box<dyn BlockVerification<B> + Send + Sync>)
    }
}

impl<Cx: VerificationContext<CellMeta> + Send + Sync + 'static> AxiVerifierBuilder<Cx> {
    pub fn new(ctx: Arc<Cx>) -> Self {
        Self { ctx }
    }
}
