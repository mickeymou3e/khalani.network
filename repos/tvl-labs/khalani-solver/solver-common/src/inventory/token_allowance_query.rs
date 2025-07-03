use crate::inventory::amount::Amount;
use crate::inventory::token::Token;
use anyhow::Result;
use async_trait::async_trait;
use ethers::addressbook::Address;

#[async_trait]
pub trait TokenAllowanceQuery {
    async fn get_allowance(
        &self,
        token: &Token,
        owner: Address,
        spender: Address,
    ) -> Result<Amount>;
}
