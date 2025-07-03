mod error;

pub use crate::error::ParserError;

use serde::de::DeserializeOwned;
use std::{fs::File, io::Read, path::Path};

pub fn parse_toml<P: AsRef<Path>, T: DeserializeOwned>(path: P) -> Result<T, ParserError> {
    let mut buf = String::new();
    File::open(path)?.read_to_string(&mut buf)?;
    Ok(toml::from_str(&buf)?)
}

pub fn parse_json<P: AsRef<Path>, T: DeserializeOwned>(path: P) -> Result<T, ParserError> {
    let mut buf = Vec::new();
    File::open(path)?.read_exact(&mut buf)?;
    Ok(serde_json::from_slice(&buf)?)
}
