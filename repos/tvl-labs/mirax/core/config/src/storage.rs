use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StorageConfig {
    pub option_path: PathBuf,
    #[serde(default = "default_db_cache_size")]
    pub cache_size: usize,
}

fn default_db_cache_size() -> usize {
    100
}
