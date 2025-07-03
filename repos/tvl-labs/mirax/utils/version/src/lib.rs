pub use semver::Version;

use derive_more::Display;
use semver::BuildMetadata;
use serde::{Deserialize, Serialize};

pub const UNKNOWN_COMMIT_ID: &str = "unknown";

/// The mirax version.
#[derive(Serialize, Deserialize, Clone, Display, Debug, PartialEq, Eq, PartialOrd, Ord)]
#[display("{:?}-with-mirax-kernel-{:?}", crate_version, kernel_version)]
pub struct MiraxVersion {
    /// The application version binding with the package version in Cargo.toml.
    pub crate_version: Version,
    /// The kernel version to check the compatibility.
    pub kernel_version: Version,
}

impl MiraxVersion {
    pub fn new(crate_version: Version, commit_id: Option<&str>) -> Self {
        let mut kernel_version = crate_version.clone();
        kernel_version.build =
            BuildMetadata::new(commit_id.unwrap_or(UNKNOWN_COMMIT_ID)).expect("Parse Commit ID");

        Self {
            crate_version,
            kernel_version,
        }
    }

    /// Get the crate version of the mirax binary.
    pub fn crate_version(&self) -> Version {
        self.crate_version.clone()
    }

    /// Get the kernel version of the mirax binary.
    pub fn kernel_version(&self) -> Version {
        self.kernel_version.clone()
    }
}
