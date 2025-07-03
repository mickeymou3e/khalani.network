use async_trait::async_trait;
use jsonrpsee::core::RpcResult;
use jsonrpsee::proc_macros::rpc;
use medusa_apm_derive::metrics;
use medusa_types::{Address, B256, SignedSolution};

#[rpc(server)]
pub trait MedusaRpc {
    #[method(name = "getSolutionForIntent")]
    async fn get_solution(&self, intent_id: B256) -> RpcResult<Option<SignedSolution>>;

    #[method(name = "getConnectedSolvers")]
    async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>>;
}

pub struct MedusaRpcImpl;

#[async_trait]
impl MedusaRpcServer for MedusaRpcImpl {
    #[metrics("getSolutionForIntent")]
    async fn get_solution(&self, _intent_id: B256) -> RpcResult<Option<SignedSolution>> {
        Ok(None)
    }

    #[metrics]
    async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>> {
        Ok(vec![])
    }
}

fn main() {}
