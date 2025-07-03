use mirax_error::impl_into_mirax_error;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CliError {
    #[error(transparent)]
    IO(#[from] std::io::Error),
}

impl_into_mirax_error!(CliError, Cli);
