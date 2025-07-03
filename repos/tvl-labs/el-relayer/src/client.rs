use anyhow::Result;
use arcadia::types::{Block, U256, U64};
// use jsonrpsee::core::{client::ClientT, params::BatchRequestBuilder};
use jsonrpsee::http_client::{HttpClient, HttpClientBuilder};
use jsonrpsee::proc_macros::rpc;
use serde::{Serialize, Serializer};

#[rpc(client)]
pub trait ArcadiaRpc {
    #[method(name = "axon_getBlockById")]
    async fn get_block_by_id(&self, block_id: BlockId) -> Result<Option<Block>, ErrorObject>;

    #[method(name = "eth_blockNumber")]
    async fn block_number(&self) -> RpcResult<U256>;
}

pub struct RpcClient {
    client: HttpClient,
}

impl RpcClient {
    pub fn new(url: &str) -> Self {
        let client = HttpClientBuilder::new().build(url).unwrap();
        RpcClient { client }
    }

    pub async fn block_number(&self) -> Result<U256> {
        let ret = self.client.block_number().await?;
        Ok(ret)
    }

    pub async fn get_block_by_id(&self, block_id: U64) -> Result<Option<Block>> {
        eprintln!("get_block_by_id: {:?}", block_id);
        let ret = self.client.get_block_by_id(BlockId::Num(block_id)).await?;
        Ok(ret)
    }

    // pub async fn get_batch_blocks(&self, block_ids: Vec<U256>) -> Result<Vec<Block>> {
    //     let mut batch_req_builder = BatchRequestBuilder::new();
    //     for id in block_ids.iter() {
    //         batch_req_builder.insert(GET_BLOCK_REQUEST, [*id])?;
    //     }

    //     if let Ok(iter) = self
    //         .client
    //         .batch_request(batch_req_builder)
    //         .await?
    //         .into_ok()
    //     {
    //         let mut ret = Vec::with_capacity(block_ids.len());
    //         for block in iter {
    //             ret.push(block);
    //         }
    //         return Ok(ret);
    //     }
    //     anyhow::bail!("batch request failed");
    // }
}

#[derive(Default, Clone, Debug, PartialEq, Eq, Hash)]
pub enum BlockId {
    Num(U64),
    #[default]
    Latest,
    Earliest,
}

impl From<BlockId> for Option<u64> {
    fn from(id: BlockId) -> Self {
        match id {
            BlockId::Num(num) => Some(num.low_u64()),
            BlockId::Earliest => Some(0),
            _ => None,
        }
    }
}

impl Serialize for BlockId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match *self {
            BlockId::Num(ref x) => serializer.serialize_str(&format!("0x{:x}", x)),
            BlockId::Latest => serializer.serialize_str("latest"),
            BlockId::Earliest => serializer.serialize_str("earliest"),
        }
    }
}
