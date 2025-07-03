mod components;
pub mod control;
pub mod error;
pub mod launch;

use mirax_db::rocks::RocksDatabase;
use mirax_storage::StorageImpl;
use mirax_types::{MiraxResult, MiraxVersion};

type RocksStorage = StorageImpl<RocksDatabase>;

#[trait_variant::make]
pub trait ChainLauncher {
    async fn init(&mut self, version: MiraxVersion) -> MiraxResult<()>;
}

#[trait_variant::make]
pub trait ChainController {
    async fn run(self) -> MiraxResult<()>;
}
