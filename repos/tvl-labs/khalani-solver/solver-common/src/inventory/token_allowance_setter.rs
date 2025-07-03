use crate::ethereum::transaction::submit_transaction;
use crate::inventory::amount::Amount;
use crate::inventory::token::Token;
use crate::inventory::Inventory;
use anyhow::Result;
use async_trait::async_trait;
use bindings_khalani::ierc20_metadata::IERC20Metadata;
use ethers::types::Address;
use tracing::info;

#[derive(Debug, Clone)]
pub struct AllowanceRequest {
    pub token: Token,
    pub allowance_amount: Amount,
    pub spender_address: Address,
}

#[async_trait]
pub trait TokenAllowanceSetter {
    async fn approve_tokens(&self, allowance_request: AllowanceRequest) -> Result<()>;
}

#[async_trait]
impl TokenAllowanceSetter for Inventory {
    async fn approve_tokens(&self, approval_request: AllowanceRequest) -> Result<()> {
        info!(?approval_request, "Approving tokens");
        let token = approval_request.token.clone();

        let spender_address = approval_request.spender_address;
        let chain_id = approval_request.token.chain_id;
        let rpc_client = self.connector.get_rpc_client(chain_id)?;
        let erc20 = IERC20Metadata::new(token.address, rpc_client);
        let mut function = erc20.approve(
            spender_address,
            approval_request.allowance_amount.base_units,
        );
        function.tx.set_chain_id(Into::<u32>::into(chain_id));
        let receipt = submit_transaction(function).await?;
        let tx_hash = receipt.transaction_hash;

        info!(?approval_request, ?tx_hash, "Tokens have been approved");
        Ok(())
    }
}
