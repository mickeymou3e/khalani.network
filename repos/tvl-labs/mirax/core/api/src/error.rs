use jsonrpsee::types::{ErrorObject, ErrorObjectOwned};
use mirax_error::impl_into_mirax_error;
use smol_str::SmolStr;
use thiserror::Error;

#[derive(Debug, Error, Clone)]
pub enum RpcError {
    #[error("Internal error: {0}")]
    Internal(SmolStr),
}

impl RpcError {
    fn code(&self) -> i32 {
        match self {
            RpcError::Internal(_) => -49999,
        }
    }
}

impl From<RpcError> for ErrorObjectOwned {
    fn from(err: RpcError) -> Self {
        match &err {
            RpcError::Internal(msg) => {
                ErrorObject::owned(err.code(), msg.to_string(), Option::<String>::None)
            }
        }
    }
}

#[derive(Debug, Error)]
pub enum APIError {
    #[error("http server: {0}")]
    HttpServer(SmolStr),
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl_into_mirax_error!(APIError, API);
