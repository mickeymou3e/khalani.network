use ethers::types::{H160, H256};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("Failed to read config from file: {0}")]
    FailedReadFile(String),
    #[error("{0} {1} not found in config file")]
    FieldNotFound(String, String),
    #[error("Failed to parse {0} address: {1}")]
    FailedParseAddress(String, String),
    #[error("Failed to parse private key")]
    FailedParsePrivateKey(),
    #[error("{0} contract address not found for chain ID: {1}")]
    ContractAddressNotFound(String, u32),
}

#[derive(Debug, Error)]
pub enum ChainError {
    #[error("Failed to create a HTTP client for chain {0}")]
    FailedCreateClient(String),
    #[error("Failed to create a WebSocket client for chain {0}")]
    FailedCreateWebsocket(String),
    #[error("RPC client not found for chain ID {0}")]
    ClientNotFound(u32),
    #[error("Can not find chain for spoke chain id {0}")]
    ChainNotFound(u32),
}

#[derive(Debug, Error)]
pub enum TokenError {
    #[error("Unsupported mirror token with symbol {0} and chain id: {1}")]
    UnsupportedMirrorToken(String, u32),
    #[error("Unsupported spoke chain token with address {0}")]
    UnsupportedSpokeChainToken(H160),
}

#[derive(Debug, Error)]
pub enum StateError {
    #[error("{0} not found for intent ID: {1}")]
    NotFound(String, H256),
}
