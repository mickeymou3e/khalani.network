use std::marker::PhantomData;

use async_graphql::{Context, Error, Object, Result};
use mirax_graphql_types::{MiraxTransaction, TxHash};

use crate::backend::traits::APIBackend;

pub struct QueryRoot<Backend: APIBackend + 'static> {
    _backend: PhantomData<Backend>,
}

impl<Backend: APIBackend + 'static> QueryRoot<Backend> {
    pub fn new() -> Self {
        Self {
            _backend: PhantomData,
        }
    }
}

#[Object]
impl<Backend: APIBackend + 'static> QueryRoot<Backend> {
    async fn get_transaction(
        &self,
        ctx: &Context<'_>,
        tx_hash: TxHash,
    ) -> Result<Option<MiraxTransaction>> {
        let backend = ctx.data::<Backend>()?;

        let opt_tx = backend
            .get_transaction(&tx_hash.0)
            .await
            .map_err(Error::new_with_source)?;

        Ok(opt_tx.map(MiraxTransaction))
    }

    async fn insert_transaction(&self, ctx: &Context<'_>, tx: MiraxTransaction) -> Result<TxHash> {
        let backend = ctx.data::<Backend>()?;

        let tx_hash = backend
            .insert_transaction(tx.0)
            .await
            .map_err(Error::new_with_source)?;

        Ok(TxHash(tx_hash))
    }
}
