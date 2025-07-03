use semver::Version;
use serde::{Deserialize, Serialize};

use mirax_primitive::U16;
use mirax_version::MiraxVersion;

/// The metadata of mirax binary.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MiraxMetadata {
    pub binary_version: MiraxVersion,
    pub latest_run_version: Version,
    pub chain_version: U16,
}

impl MiraxMetadata {
    /// Get the version of the mirax binary.
    pub fn binary_version(&self) -> MiraxVersion {
        self.binary_version.clone()
    }

    /// Get the latest compatible version of the mirax binary.
    pub fn latest_run_version(&self) -> Version {
        self.latest_run_version.clone()
    }

    /// Get the chain version.
    pub fn chain_version(&self) -> U16 {
        self.chain_version
    }
}
