use std::net::SocketAddr;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RpcConfig {
    pub http_listening_address: Option<SocketAddr>,
    pub max_payload_size: u32,
    pub max_conn: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GraphQLConfig {
    pub http_listening_address: Option<SocketAddr>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ApiConfig {
    pub rpc: RpcConfig,
    pub graphql: GraphQLConfig,
}
