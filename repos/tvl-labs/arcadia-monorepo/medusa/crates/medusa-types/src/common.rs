pub use alloy::primitives::{Address, B256, ChainId, U256};
pub use alloy::signers::Signer;
use serde::{Deserialize, Serialize};

pub type BlockTime = U256;
pub type RealTime = u64;
pub type MetaTokenId = u32;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TokenAmt {
    pub amt: U256,
    pub decimals: u8,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TokenAmtRange {
    from: TokenAmt,
    to: TokenAmt,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RealTimeRange {
    begin: RealTime,
    end: RealTime,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TokenInfo {
    name: String,
    contract_address: Address,
    chain: ChainId,
}
