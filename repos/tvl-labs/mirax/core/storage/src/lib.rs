mod error;
mod key;
pub mod modify;
mod schema;
#[cfg(test)]
mod tests;

pub use crate::schema::{db_cols, COLUMNS_NUMBER};

use std::error::Error;
use std::sync::Arc;

use futures::{future, TryFutureExt};
use mirax_hasher::{Blake3Hasher, Digest};
use serde::{de::DeserializeOwned, Serialize};

use mirax_consensus_traits::ConsensusStorage;
use mirax_db::traits::{DBRead, DBStartTransaction, DBTransaction, DBWrite};
use mirax_storage_traits::{ReadOnlyStorage, Storage};
use mirax_types::traits::OutPointTrait;
use mirax_types::{
    generate_cell_key, Address, BlockEnvelope, BlockNumber, Byte32, Byte36, Bytes, CellEntry,
    CellMeta, Header, MiraxMetadata, MiraxResult, OutPoint, TransactionBatch, TransactionChunk,
    WrappedTransaction, H256,
};
use mirax_verification::{
    CellDataProvider, CellProvider, ExtensionProvider, HeaderProvider, VerificationContext,
};

use crate::error::{DataType, StorageError};
use crate::key::{CONSENSUS_STATUS_KEY, LATEST_BLOCK_KEY, METADATA_KEY};
use crate::modify::{generate_number_author_key, generate_tx_batch_kv, ModifyBlockHeader};
use crate::schema::{
    BlockHashNumberSchema, BlockHeaderSchema, CellDataHashSchema, CellDataSchema, CellSchema,
    CertificateSchema, ConsensusCommitSchema, ConsensusStateSchema, LatestBlockSchema,
    MetadataSchema, TransactionBatchSchema, TransactionChunkSchema, TransactionSchema,
};

/// The storage implementation.
#[derive(Clone)]
pub struct StorageImpl<DB: DBStartTransaction> {
    inner: DB,
}

impl<DB> StorageImpl<DB>
where
    DB: Clone + DBRead + DBWrite + DBStartTransaction,
{
    /// Create a new storage implementation.
    pub fn new(inner: DB) -> Self {
        Self { inner }
    }

    /// Start a new transaction.
    pub fn transaction(&self) -> MiraxResult<Tx<DB>> {
        Ok(Tx::new(self.inner.begin_transaction()?))
    }
}

macro_rules! put {
    ($handle: expr, $schema: ty, $key: expr, $val: expr) => {
        $handle.put::<$schema>($key, $val)?;
    };
}

macro_rules! delete {
    ($handle: expr, $schema: ty, $key: expr) => {
        $handle.delete::<$schema>($key)?;
    };
}

macro_rules! get {
    ($handle: expr, $schema: ident, $key: expr) => {{
        let ret = $handle.get::<$schema>($key)?;
        ret
    }};

    ($handle: expr, $schema: ident, $key: expr, $data_ty: expr) => {{
        let ret = $handle
            .get::<$schema>($key)?
            .ok_or(StorageError::CannotFind($data_ty))?;
        ret
    }};
}

impl<DB> ReadOnlyStorage for StorageImpl<DB>
where
    DB: Clone + Send + Sync + DBRead + DBStartTransaction,
{
    async fn get_metadata(&self) -> MiraxResult<MiraxMetadata> {
        Ok(get!(
            self.inner,
            MetadataSchema,
            &*METADATA_KEY,
            DataType::Metadata
        ))
    }

    async fn get_latest_block_header(&self) -> MiraxResult<Header> {
        Ok(get!(
            self.inner,
            LatestBlockSchema,
            &*LATEST_BLOCK_KEY,
            DataType::LatestBlock
        )
        .header)
    }

    async fn get_block_header_by_number(
        &self,
        block_number: &BlockNumber,
    ) -> MiraxResult<Option<Header>> {
        Ok(get!(self.inner, BlockHeaderSchema, &block_number).map(|h| h.header))
    }

    async fn get_block_header_by_hash(&self, block_hash: &H256) -> MiraxResult<Option<Header>> {
        let block_number = get!(
            self.inner,
            BlockHashNumberSchema,
            block_hash,
            DataType::BlockHash(*block_hash)
        );
        let wrapped_header = get!(self.inner, BlockHeaderSchema, &block_number);
        Ok(wrapped_header.map(|h| h.header))
    }

    async fn get_block_by_number<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_number: &u64,
    ) -> MiraxResult<Option<BlockEnvelope<S>>> {
        let wrapped_header = get!(self.inner, BlockHeaderSchema, &block_number);

        if let Some(header) = wrapped_header {
            let mut chunks = Vec::with_capacity(header.tx_chunk_keys.len());
            for chunk_key in header.tx_chunk_keys.iter() {
                let tx_batch = get!(self.inner, TransactionBatchSchema, chunk_key)
                    .ok_or(StorageError::CannotFind(DataType::TxBatchKey(*chunk_key)))?;
                let tx_batch = tx_batch.recover(
                    tx_batch
                        .tx_hashes
                        .iter()
                        .map(|h| self.inner.get::<TransactionSchema>(h).unwrap().unwrap())
                        .collect::<Vec<_>>(),
                );
                let chunk = get!(self.inner, TransactionChunkSchema, chunk_key)
                    .ok_or(StorageError::CannotFind(DataType::TxChunkKey(*chunk_key)))?;
                let certificates = chunk
                    .certificate_hashes
                    .iter()
                    .map(|h| self.inner.get::<CertificateSchema<S>>(h).unwrap().unwrap())
                    .collect::<Vec<_>>();
                let chunk = TransactionChunk::new(tx_batch, certificates);
                chunks.push(chunk);
            }

            let cellbase = get!(self.inner, TransactionSchema, &header.cellbase_hash).unwrap();

            return Ok(Some(BlockEnvelope {
                header: header.header,
                cellbase,
                chunks,
            }));
        }

        Ok(None)
    }

    async fn get_block_by_hash<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_hash: &H256,
    ) -> MiraxResult<Option<BlockEnvelope<S>>> {
        let number = get!(
            self.inner,
            BlockHashNumberSchema,
            block_hash,
            DataType::BlockHash(*block_hash)
        );
        self.get_block_by_number(&number).await
    }

    async fn get_transaction_by_hash(
        &self,
        tx_hash: &H256,
    ) -> MiraxResult<Option<WrappedTransaction>> {
        inner_get_tx_by_hash(&self.inner, tx_hash).await
    }

    async fn get_transactions(&self, tx_hashes: &[H256]) -> MiraxResult<Vec<WrappedTransaction>> {
        let snapshot = self.inner.snap()?;
        inner_get_txs_by_hashes(snapshot, tx_hashes).await
    }
}

impl<DB> CellProvider<CellMeta> for StorageImpl<DB>
where
    DB: Clone + DBRead + DBStartTransaction,
{
    fn get_cell(&self, out_point: &impl OutPointTrait) -> Option<CellMeta> {
        let key = out_point.cell_key();
        let c = self.inner.get::<CellSchema>(&key).ok().flatten()?;
        Some(CellMeta {
            capacity: c.output.capacity,
            lock: c.output.lock,
            type_: c.output.type_,
            out_point: OutPoint {
                tx_hash: out_point.tx_hash(),
                index: out_point.index(),
            },
            data_bytes: c.data_size,
            mem_cell_data: None,
            mem_cell_data_hash: None,
        })
    }
}

impl<DB> CellDataProvider<CellMeta> for StorageImpl<DB>
where
    DB: Clone + DBRead + DBStartTransaction,
{
    fn get_cell_data(&self, key: Byte36) -> Option<Bytes> {
        self.inner.get::<CellDataSchema>(&key).ok().flatten()
    }

    fn get_cell_data_hash(&self, key: Byte36) -> Option<H256> {
        self.inner.get::<CellDataHashSchema>(&key).ok().flatten()
    }
}

impl<DB> HeaderProvider for StorageImpl<DB>
where
    DB: Clone + DBRead + DBStartTransaction,
{
    fn get_header(&self, hash: &H256) -> Option<Header> {
        let block_number = self
            .inner
            .get::<BlockHashNumberSchema>(hash)
            .ok()
            .flatten()?;
        self.inner
            .get::<BlockHeaderSchema>(&block_number)
            .ok()
            .flatten()
            .map(|h| h.header)
    }
}

impl<DB> ExtensionProvider for StorageImpl<DB>
where
    DB: Clone + DBRead + DBStartTransaction,
{
    fn get_block_extension(&self, hash: &H256) -> Option<Bytes> {
        self.get_header(hash).map(|h| h.extra_data)
    }
}

impl<DB> VerificationContext<CellMeta> for StorageImpl<DB> where
    DB: Clone + DBRead + DBStartTransaction
{
}

impl<DB> Storage for StorageImpl<DB>
where
    DB: Clone + Send + Sync + DBRead + DBWrite + DBStartTransaction,
{
    async fn update_metadata(&self, metadata: &MiraxMetadata) -> MiraxResult<()> {
        self.inner.put::<MetadataSchema>(&*METADATA_KEY, metadata)?;
        Ok(())
    }

    async fn insert_new_block<S: Send + Sync>(&self, block: BlockEnvelope<S>) -> MiraxResult<()> {
        self.transaction()?.insert_new_block(block).await
    }

    async fn insert_transaction_batch(&self, tx_batch: TransactionBatch) -> MiraxResult<()> {
        let (key, modify_tx_batch) = generate_tx_batch_kv(&tx_batch);
        put!(self.inner, TransactionBatchSchema, &key, &modify_tx_batch);
        self.insert_transactions(tx_batch.transactions).await
    }

    async fn insert_transactions(&self, txs: Vec<WrappedTransaction>) -> MiraxResult<()> {
        for tx in txs.iter() {
            put!(self.inner, TransactionSchema, &tx.hash, tx);
        }
        Ok(())
    }
}

impl<DB> ConsensusStorage for StorageImpl<DB>
where
    DB: Clone + Sync + Send + DBRead + DBWrite + DBStartTransaction,
{
    async fn insert_committed_data(
        &self,
        key: &Byte32,
        val: &Bytes,
    ) -> Result<(), Box<dyn Error + Send>> {
        put!(self.inner, ConsensusCommitSchema, key, val);
        Ok(())
    }

    async fn insert_block<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block: &BlockEnvelope<S>,
    ) -> Result<(), Box<dyn Error + Send>> {
        let tx = self.transaction()?;
        let modified_header = ModifyBlockHeader::from(block);

        put!(
            tx.inner,
            BlockHeaderSchema,
            &block.header.block_number,
            &modified_header
        );

        tx.inner.commit()?;
        Ok(())
    }

    async fn insert_state_data(&self, val: &Bytes) -> Result<(), Box<dyn Error + Send>> {
        put!(self.inner, ConsensusStateSchema, &CONSENSUS_STATUS_KEY, val);
        Ok(())
    }

    async fn insert_transaction_chunk<S: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        chunk: &TransactionChunk<S>,
    ) -> Result<(), Box<dyn Error + Send>> {
        let (chunk_key, modified_tx_chunk) = modify::generate_tx_chunk_kv(chunk);
        let cert_hashes = modified_tx_chunk.certificate_hashes.clone();
        let (batch_key, modified_tx_batch) = modify::generate_tx_batch_kv(&chunk.transaction_batch);
        let certs = chunk.certificates.clone();
        let txs = chunk.transaction_batch.transactions.clone();

        let tx = self.transaction()?;
        put!(
            tx.inner,
            TransactionChunkSchema,
            &chunk_key,
            &modified_tx_chunk
        );
        put!(
            tx.inner,
            TransactionBatchSchema,
            &batch_key,
            &modified_tx_batch
        );

        for i in txs.iter() {
            put!(tx.inner, TransactionSchema, &i.hash, i);
        }

        for (hash, cert) in cert_hashes.iter().zip(certs.iter()) {
            put!(tx.inner, CertificateSchema<S>, hash, cert);
        }

        tx.inner.commit()?;
        Ok(())
    }

    async fn get_state_data(&self) -> Result<Option<Bytes>, Box<dyn Error + Send>> {
        Ok(get!(
            self.inner,
            ConsensusStateSchema,
            &CONSENSUS_STATUS_KEY
        ))
    }

    async fn get_header_by_number(
        &self,
        block_number: &BlockNumber,
    ) -> Result<Option<Header>, Box<dyn Error + Send>> {
        let header_opt = self.get_block_header_by_number(block_number).await?;
        Ok(header_opt)
    }

    async fn check_transactions_exist(
        &self,
        tx_hashes: &[H256],
    ) -> Result<Vec<H256>, Box<dyn Error + Send>> {
        let snapshot = self.inner.snap()?;
        let futs = tx_hashes
            .iter()
            .map(|h| async { snapshot.get::<TransactionSchema>(h) })
            .collect::<Vec<_>>();

        let res = future::try_join_all(futs).await?;
        let duplicates = res
            .iter()
            .filter_map(|r| r.as_ref().map(|tx| tx.hash))
            .collect::<Vec<_>>();

        Ok(duplicates)
    }

    async fn check_chunk_exist(
        &self,
        block_number: &BlockNumber,
        address: &Address,
    ) -> Result<bool, Box<dyn Error + Send>> {
        let key = generate_number_author_key(block_number, address);
        let res = get!(self.inner, TransactionChunkSchema, &key);
        Ok(res.is_some())
    }
}

pub struct Tx<S: DBStartTransaction> {
    inner: Arc<S::Transaction>,
}

impl<S: DBStartTransaction> Tx<S> {
    fn new(inner: S::Transaction) -> Self {
        Self {
            inner: Arc::new(inner),
        }
    }
}

impl<S: DBStartTransaction + Send + Sync> ReadOnlyStorage for Tx<S> {
    async fn get_metadata(&self) -> MiraxResult<MiraxMetadata> {
        Ok(get!(
            self.inner,
            MetadataSchema,
            &*METADATA_KEY,
            DataType::Metadata
        ))
    }

    async fn get_latest_block_header(&self) -> MiraxResult<Header> {
        Ok(get!(
            self.inner,
            LatestBlockSchema,
            &*LATEST_BLOCK_KEY,
            DataType::LatestBlock
        )
        .header)
    }

    async fn get_block_header_by_number(&self, block_number: &u64) -> MiraxResult<Option<Header>> {
        Ok(get!(self.inner, BlockHeaderSchema, &block_number).map(|h| h.header))
    }

    async fn get_block_header_by_hash(&self, block_hash: &H256) -> MiraxResult<Option<Header>> {
        let block_number = get!(
            self.inner,
            BlockHashNumberSchema,
            block_hash,
            DataType::BlockHash(*block_hash)
        );
        self.get_block_header_by_number(&block_number).await
    }

    async fn get_block_by_number<T: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_number: &u64,
    ) -> MiraxResult<Option<BlockEnvelope<T>>> {
        let wrapped_header = get!(self.inner, BlockHeaderSchema, &block_number);

        if let Some(header) = wrapped_header {
            let mut chunks = Vec::with_capacity(header.tx_chunk_keys.len());
            for chunk_key in header.tx_chunk_keys.iter() {
                let tx_batch = get!(self.inner, TransactionBatchSchema, chunk_key)
                    .ok_or(StorageError::CannotFind(DataType::TxBatchKey(*chunk_key)))?;
                let tx_batch = tx_batch.recover(
                    tx_batch
                        .tx_hashes
                        .iter()
                        .map(|h| self.inner.get::<TransactionSchema>(h).unwrap().unwrap())
                        .collect::<Vec<_>>(),
                );
                let chunk = get!(self.inner, TransactionChunkSchema, chunk_key)
                    .ok_or(StorageError::CannotFind(DataType::TxChunkKey(*chunk_key)))?;
                let certificates = chunk
                    .certificate_hashes
                    .iter()
                    .map(|h| self.inner.get::<CertificateSchema<T>>(h).unwrap().unwrap())
                    .collect::<Vec<_>>();
                let chunk = TransactionChunk::new(tx_batch, certificates);
                chunks.push(chunk);
            }

            let cellbase = get!(self.inner, TransactionSchema, &header.cellbase_hash).unwrap();

            return Ok(Some(BlockEnvelope {
                header: header.header,
                cellbase,
                chunks,
            }));
        }

        Ok(None)
    }

    async fn get_block_by_hash<T: Serialize + DeserializeOwned + Clone + Send + Sync>(
        &self,
        block_hash: &H256,
    ) -> MiraxResult<Option<BlockEnvelope<T>>> {
        let number = get!(
            self.inner,
            BlockHashNumberSchema,
            block_hash,
            DataType::BlockHash(*block_hash)
        );
        self.get_block_by_number(&number).await
    }

    async fn get_transaction_by_hash(
        &self,
        tx_hash: &H256,
    ) -> MiraxResult<Option<WrappedTransaction>> {
        Ok(get!(self.inner, TransactionSchema, tx_hash))
    }

    async fn get_transactions(&self, tx_hashes: &[H256]) -> MiraxResult<Vec<WrappedTransaction>> {
        let futs = tx_hashes.iter().map(|h| {
            self.get_transaction_by_hash(h)
                .map_ok(|res| res.ok_or(StorageError::CannotFind(DataType::TxHash(*h))))
        });

        let res = future::try_join_all(futs).await?;
        let mut ret = Vec::with_capacity(res.len());
        for r in res.into_iter() {
            ret.push(r?);
        }

        Ok(ret)
    }
}

impl<S: DBStartTransaction + Send + Sync> Storage for Tx<S> {
    async fn update_metadata(&self, metadata: &MiraxMetadata) -> MiraxResult<()> {
        put!(self.inner, MetadataSchema, &*METADATA_KEY, metadata);
        self.inner.commit()?;
        Ok(())
    }

    async fn insert_new_block<T: Send + Sync>(&self, block: BlockEnvelope<T>) -> MiraxResult<()> {
        let block_hash = block.hash();
        let block_number = block.number();
        let modify_header = ModifyBlockHeader::from(&block);

        put!(
            self.inner,
            BlockHeaderSchema,
            &block.header.block_number,
            &modify_header
        );
        put!(
            self.inner,
            LatestBlockSchema,
            &*LATEST_BLOCK_KEY,
            &modify_header
        );
        put!(
            self.inner,
            BlockHashNumberSchema,
            &block_hash,
            &block_number
        );
        put!(
            self.inner,
            TransactionSchema,
            &block.cellbase.hash,
            &block.cellbase
        );

        for (index, tx) in block.transaction_iter().enumerate() {
            let index = index as u32;

            // Delete input cells
            for input in tx.transaction.inputs.iter() {
                let key = input.previous_output.cell_key();
                delete!(self.inner, CellSchema, &key);
                delete!(self.inner, CellDataSchema, &key);
                delete!(self.inner, CellDataHashSchema, &key);
            }

            // Insert output cells
            for (cell, data) in tx
                .transaction
                .outputs
                .iter()
                .zip(tx.transaction.outputs_data.iter())
            {
                let key = generate_cell_key(&tx.hash, &index);
                let cell_entry = CellEntry {
                    output: cell.clone(),
                    block_hash,
                    block_number,
                    index,
                    data_size: data.len() as u64,
                };

                put!(self.inner, CellSchema, &key, &cell_entry);
                put!(self.inner, CellDataSchema, &key, data);
                put!(
                    self.inner,
                    CellDataHashSchema,
                    &key,
                    &Blake3Hasher::digest(data)
                );
            }
        }

        self.inner.commit()?;
        Ok(())
    }

    async fn insert_transaction_batch(&self, tx_batch: TransactionBatch) -> MiraxResult<()> {
        let (key, modify_tx_batch) = generate_tx_batch_kv(&tx_batch);
        put!(self.inner, TransactionBatchSchema, &key, &modify_tx_batch);

        for tx in tx_batch.transactions.iter() {
            put!(self.inner, TransactionSchema, &tx.hash, tx);
        }

        self.inner.commit()?;
        Ok(())
    }

    async fn insert_transactions(&self, txs: Vec<WrappedTransaction>) -> MiraxResult<()> {
        for tx in txs.iter() {
            put!(self.inner, TransactionSchema, &tx.hash, tx);
        }
        self.inner.commit()?;
        Ok(())
    }
}

async fn inner_get_tx_by_hash<R: DBRead>(
    reader: &R,
    tx_hash: &H256,
) -> MiraxResult<Option<WrappedTransaction>> {
    Ok(get!(reader, TransactionSchema, tx_hash))
}

async fn inner_get_txs_by_hashes<R: DBRead>(
    reader: R,
    hashes: &[H256],
) -> MiraxResult<Vec<WrappedTransaction>> {
    let futs = hashes.iter().map(|hash| {
        inner_get_tx_by_hash(&reader, hash)
            .map_ok(|res| res.ok_or(StorageError::CannotFind(DataType::TxHash(*hash))))
    });

    let res = future::try_join_all(futs).await?;
    let mut ret = Vec::with_capacity(res.len());
    for r in res.into_iter() {
        ret.push(r?);
    }

    Ok(ret)
}
