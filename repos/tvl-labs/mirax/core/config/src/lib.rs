mod api;
mod consensus;
mod devops;
pub mod error;
mod logger;
mod network;
mod storage;

pub use crate::{
    api::ApiConfig,
    consensus::ConsensusConfig,
    devops::DevOpsConfig,
    logger::LoggerConfig,
    network::{NetworkConfig, PeerAddress},
    storage::StorageConfig,
};

use std::path::{Path, PathBuf};
use std::{ffi::OsStr, fs::File, io::Read};

use clap::builder::{StringValueParser, TypedValueParser, ValueParserFactory};
use clap::{Arg, Command, Error as ClapError};
use serde::{Deserialize, Serialize};
use smol_str::ToSmolStr;

use mirax_crypto::{ed25519::Ed25519PrivateKey, PrivateKey};
use mirax_parser::parse_toml;
use mirax_types::{Address, K256Bits};

use crate::error::ConfigError;

const CONFIG_FILE_EXTENSION: &str = "toml";
const ROCKS_DB_FOLDER_NAME: &str = "rocks";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MiraxConfig {
    pub data_path: PathBuf,

    #[serde(skip)]
    pub private_key: K256Bits,
    pub private_path: PathBuf,

    #[serde(skip)]
    pub address: Address,

    pub api: ApiConfig,
    pub consensus: ConsensusConfig,
    pub storage: StorageConfig,
    pub network: NetworkConfig,
    pub devops: DevOpsConfig,
    pub logger: LoggerConfig,
}

impl ValueParserFactory for MiraxConfig {
    type Parser = ConfigParser;

    fn value_parser() -> Self::Parser {
        ConfigParser
    }
}

impl MiraxConfig {
    pub fn rocks_db_path(&self) -> PathBuf {
        let buf = self.data_path.clone();
        buf.join(ROCKS_DB_FOLDER_NAME)
    }

    fn fill_private_key(&mut self, dir_path: &Path) -> Result<(), ConfigError> {
        const KEY_SIZE: usize = 32;

        let path = dir_path.join(&self.private_path);
        let bytes = File::open(path).and_then(|mut f| {
            let mut buf = [0u8; KEY_SIZE];
            f.read_exact(&mut buf).map(|_| buf)
        })?;

        if bytes.len() != KEY_SIZE {
            return Err(ConfigError::InvalidKeySize(bytes.len()));
        }

        let mut v = [0u8; KEY_SIZE];
        v.copy_from_slice(&bytes);

        let private_key = Ed25519PrivateKey::try_from(v.as_slice())?;
        self.address = private_key.public_key().into();
        self.private_key = K256Bits::from(v);

        Ok(())
    }
}

#[derive(Clone)]
pub struct ConfigParser;

impl TypedValueParser for ConfigParser {
    type Value = MiraxConfig;

    fn parse_ref(
        &self,
        cmd: &Command,
        arg: Option<&Arg>,
        value: &OsStr,
    ) -> Result<Self::Value, ClapError> {
        let config_path = self.parse_config_path(cmd, arg, value)?;
        let mut config = self.parse_config_toml(&config_path)?;
        config.fill_private_key(config_path.parent().unwrap())?;

        Ok(config)
    }
}

impl ConfigParser {
    pub fn parse_config_path(
        &self,
        cmd: &Command,
        arg: Option<&Arg>,
        value: &OsStr,
    ) -> Result<PathBuf, ClapError> {
        let file_path = StringValueParser::new()
            .parse_ref(cmd, arg, value)
            .map(PathBuf::from)?;
        self.check_file_extension(&file_path)?;
        let _dir_path = file_path.parent().ok_or_else(|| {
            ConfigError::NoParentDictionary(file_path.to_string_lossy().to_smolstr())
        })?;

        Ok(file_path.to_path_buf())
    }

    fn check_file_extension(&self, path: &Path) -> Result<(), ConfigError> {
        if path.extension() != Some(OsStr::new(CONFIG_FILE_EXTENSION)) {
            return Err(ConfigError::InvalidFileExtension(
                path.extension().map(|e| e.to_string_lossy().to_smolstr()),
            ));
        }

        Ok(())
    }

    fn parse_config_toml<P: AsRef<Path>>(&self, path: P) -> Result<MiraxConfig, ConfigError> {
        let config = parse_toml(path)?;
        Ok(config)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_config() {
        let path = "../../tests/chain/config.toml";
        let mut config = ConfigParser.parse_config_toml(path).unwrap();
        assert_eq!(config.private_key, K256Bits::default());
        config
            .fill_private_key(Path::new("../../tests/chain"))
            .unwrap();
    }
}
