pub mod error;
pub mod genesis;
pub mod metadata;

use std::ffi::OsStr;
use std::path::{Path, PathBuf};

use clap::{
    builder::{StringValueParser, TypedValueParser, ValueParserFactory},
    Arg, Command, Error as ClapError,
};
use serde::{Deserialize, Serialize};
use smol_str::ToSmolStr;

use mirax_parser::parse_toml;

use crate::{error::SpecError, genesis::Genesis, metadata::SpecMetadata};

const SPEC_FILE_EXTENSION: &str = "toml";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MiraxSpec {
    pub genesis: Genesis,
    pub metadata: SpecMetadata,
}

impl ValueParserFactory for MiraxSpec {
    type Parser = SpecParser;

    fn value_parser() -> Self::Parser {
        SpecParser
    }
}

#[derive(Clone)]
pub struct SpecParser;

impl TypedValueParser for SpecParser {
    type Value = MiraxSpec;

    fn parse_ref(
        &self,
        cmd: &Command,
        arg: Option<&Arg>,
        value: &OsStr,
    ) -> Result<Self::Value, ClapError> {
        let spec_path = self.parse_spec_path(cmd, arg, value)?;
        let spec = self.parse_spec_toml(spec_path)?;
        Ok(spec)
    }
}

impl SpecParser {
    pub fn parse_spec_path(
        &self,
        cmd: &Command,
        arg: Option<&Arg>,
        value: &OsStr,
    ) -> Result<PathBuf, ClapError> {
        let file_path = StringValueParser::new()
            .parse_ref(cmd, arg, value)
            .map(PathBuf::from)?;
        self.check_file_extension(&file_path)?;

        Ok(file_path.to_path_buf())
    }

    fn check_file_extension(&self, path: &Path) -> Result<(), SpecError> {
        if path.extension() != Some(OsStr::new(SPEC_FILE_EXTENSION)) {
            return Err(SpecError::InvalidFileExtension(
                path.extension().map(|e| e.to_string_lossy().to_smolstr()),
            ));
        }

        Ok(())
    }

    fn parse_spec_toml<P: AsRef<Path>>(&self, path: P) -> Result<MiraxSpec, SpecError> {
        let spec = parse_toml(path)?;
        Ok(spec)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_spec() {
        let path = "../../tests/chain/spec.toml";
        let spec = SpecParser.parse_spec_toml(path).unwrap();
        assert_eq!(spec.metadata.validator_list().unwrap().len(), 1);
    }
}
