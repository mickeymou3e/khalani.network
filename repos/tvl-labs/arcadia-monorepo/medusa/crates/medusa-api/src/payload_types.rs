use alloy::primitives::{Address, B256, Signature, U256};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PayloadIntentId {
    pub intent_id: B256,
    pub nonce: U256,
    pub chain_id: u64,
}

pub type SignedPayloadIntentId = SignedPayload<PayloadIntentId>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PayloadAddress {
    pub address: Address,
    pub nonce: U256,
    pub chain_id: u64,
}

pub type SignedPayloadAddress = SignedPayload<PayloadAddress>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WithdrawalPayload {
    pub address: Address,
    pub amount: U256,
    pub mtoken: Address,
    pub nonce: U256,
    pub chain_id: u64,
}

pub type SignedWithdrawalPayload = SignedPayload<WithdrawalPayload>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SignedPayload<T> {
    pub payload: T,
    pub signature: Signature,
}

impl<T> SignedPayload<T>
where
    T: Serialize,
{
    pub fn recover_signer_address(&self) -> anyhow::Result<Address> {
        Ok(self
            .signature
            .recover_address_from_msg(bcs::to_bytes(&self.payload)?.as_slice())?)
    }
}
