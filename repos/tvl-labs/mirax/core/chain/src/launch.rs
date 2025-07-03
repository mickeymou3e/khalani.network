use std::fs;

use mirax_compat::LATEST_COMPAT_VERSION;
use mirax_config::MiraxConfig;
use mirax_consensus_traits::ConsensusStorage;
use mirax_crypto::ed25519::Ed25519Signature;
use mirax_db::rocks::RocksDatabase;
use mirax_spec::MiraxSpec;
use mirax_storage::{db_cols, StorageImpl};
use mirax_storage_traits::{ReadOnlyStorage, Storage};

use mirax_types::{BlockEnvelope, MiraxMetadata, MiraxResult, GENESIS_NUMBER};
use mirax_version::{MiraxVersion, Version};
use smol_str::format_smolstr;

use crate::{error::ChainError, ChainLauncher, RocksStorage};

pub struct MiraxLauncher {
    spec: MiraxSpec,
    storage: RocksStorage,
}

impl ChainLauncher for MiraxLauncher {
    async fn init(&mut self, binary_version: MiraxVersion) -> MiraxResult<()> {
        let genesis_exist = self
            .storage
            .get_block_header_by_number(&GENESIS_NUMBER)
            .await?
            .is_some();

        if genesis_exist {
            self.check_version().await?;
        } else {
            let genesis: BlockEnvelope<Ed25519Signature> = self.spec.genesis.build();
            self.storage
                .insert_transaction_chunk(&genesis.chunks[0])
                .await
                .map_err(|e| ChainError::Storage(format_smolstr!("{}", e)))?;
            self.storage
                .insert_block(&genesis)
                .await
                .map_err(|e| ChainError::Storage(format_smolstr!("{}", e)))?;
        }

        let new_metadata = MiraxMetadata {
            chain_version: self.spec.genesis.version,
            latest_run_version: binary_version.crate_version(),
            binary_version,
        };
        self.storage.update_metadata(&new_metadata).await?;

        Ok(())
    }
}

impl MiraxLauncher {
    pub fn new(spec: MiraxSpec, config: MiraxConfig) -> MiraxResult<Self> {
        let db_path = config.rocks_db_path();

        // Create the directory if it does not exist.
        let _ = fs::create_dir_all(db_path);

        let storage = StorageImpl::new(RocksDatabase::open(config.rocks_db_path(), db_cols())?);

        Ok(Self { spec, storage })
    }

    async fn check_version(&self) -> MiraxResult<()> {
        let metadata = self.storage.get_metadata().await?;

        if metadata.chain_version() != self.spec.genesis.version {
            return Err(ChainError::VersionMismatch(
                self.spec.genesis.version,
                metadata.chain_version(),
            )
            .into());
        }

        if metadata.latest_run_version() < Version::parse(LATEST_COMPAT_VERSION).unwrap() {
            return Err(ChainError::BinaryIncompatible(metadata.latest_run_version()).into());
        }

        Ok(())
    }
}
