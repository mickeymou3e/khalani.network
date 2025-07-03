pub mod mirax;

use jsonrpsee::server::ServerBuilder;
use mirax_config::ApiConfig;
use mirax_types::MiraxResult;
use smol_str::ToSmolStr;

use crate::{backend::traits::APIBackend, error::APIError};

#[derive(Default)]
pub struct JsonRpcServer {
    http: Option<jsonrpsee::server::ServerHandle>,
}

impl JsonRpcServer {
    pub fn stop(mut self) -> Result<(), APIError> {
        if let Some(http) = self.http.take() {
            http.stop()
                .map_err(|e| APIError::HttpServer(e.to_smolstr()))?;
        }

        Ok(())
    }
}

pub async fn run_jsonrpc_server<Backend: APIBackend + 'static>(
    config: ApiConfig,
    backend: Backend,
) -> MiraxResult<JsonRpcServer> {
    use mirax::MiraxRpcServer;

    let mut rpc_server = JsonRpcServer::default();
    let rpc = mirax::MiraxRpcImpl::new(backend).into_rpc();

    if let Some(addr) = config.rpc.http_listening_address {
        let server = ServerBuilder::new()
            .http_only()
            .max_request_body_size(config.rpc.max_payload_size)
            .max_response_body_size(config.rpc.max_payload_size)
            .max_connections(config.rpc.max_conn)
            .build(addr)
            .await
            .map_err(|e| APIError::HttpServer(e.to_smolstr()))?;

        let handle = server.start(rpc);

        rpc_server.http = Some(handle)
    }

    Ok(rpc_server)
}
