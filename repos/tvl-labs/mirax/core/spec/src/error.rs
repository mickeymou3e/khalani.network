use clap::error::{Error as ClapError, ErrorKind};
use smol_str::SmolStr;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum SpecError {
    #[error("no parent directory of {0}")]
    NoParentDictionary(SmolStr),

    #[error("Invalid spec file type: {0:?}, should be \".toml\"")]
    InvalidFileExtension(Option<SmolStr>),

    #[error("Invalid private key size {0}, expected 32 bytes")]
    InvalidKeySize(usize),

    #[error(transparent)]
    IO(#[from] std::io::Error),

    #[error(transparent)]
    Parser(#[from] mirax_parser::ParserError),
}

impl From<SpecError> for ClapError {
    fn from(err: SpecError) -> Self {
        ClapError::raw(ErrorKind::Io, err)
    }
}
