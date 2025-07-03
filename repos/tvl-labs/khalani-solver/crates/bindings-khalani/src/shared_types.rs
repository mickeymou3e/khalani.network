///`Intent(bytes,bytes)`
#[derive(
    Clone,
    ::ethers::contract::EthAbiType,
    ::ethers::contract::EthAbiCodec,
    serde::Serialize,
    serde::Deserialize,
    Default,
    Debug,
    PartialEq,
    Eq,
    Hash,
)]
pub struct Intent {
    pub intent: ::ethers::core::types::Bytes,
    pub signature: ::ethers::core::types::Bytes,
}
///`IntentBid(bytes32,bytes)`
#[derive(
    Clone,
    ::ethers::contract::EthAbiType,
    ::ethers::contract::EthAbiCodec,
    serde::Serialize,
    serde::Deserialize,
    Default,
    Debug,
    PartialEq,
    Eq,
    Hash,
)]
pub struct IntentBid {
    pub intent_id: [u8; 32],
    pub bid: ::ethers::core::types::Bytes,
}
///`SwapIntent(address,uint32,uint32,address,address,uint256,bytes,uint256,uint256)`
#[derive(
    Clone,
    ::ethers::contract::EthAbiType,
    ::ethers::contract::EthAbiCodec,
    serde::Serialize,
    serde::Deserialize,
    Default,
    Debug,
    PartialEq,
    Eq,
    Hash,
)]
pub struct SwapIntent {
    pub author: ::ethers::core::types::Address,
    pub source_chain_id: u32,
    pub destination_chain_id: u32,
    pub source_token: ::ethers::core::types::Address,
    pub destination_token: ::ethers::core::types::Address,
    pub source_amount: ::ethers::core::types::U256,
    pub source_permit_2: ::ethers::core::types::Bytes,
    pub nonce: ::ethers::core::types::U256,
    pub deadline: ::ethers::core::types::U256,
}
