pub mod amount;
pub mod token;
pub mod token_allowance_query;
pub mod token_allowance_setter;
pub mod token_balance_query;

use crate::config::chain::ChainId;
use crate::config::token::TokenConfig;
use crate::config::Config;
use crate::connectors::Connector;
use crate::error::ChainError;
use crate::error::TokenError;
use crate::inventory::amount::Amount;
use crate::inventory::token::Token;
use crate::inventory::token_balance_query::TokenBalanceQuery;

use anyhow::Result;
use async_trait::async_trait;
use bindings_khalani::ierc20_metadata::IERC20Metadata;
use ethers::types::Address;
use std::default::Default;
use std::sync::Arc;

use self::token_allowance_query::TokenAllowanceQuery;

#[derive(Debug)]
pub struct Inventory {
    connector: Arc<Connector>,
    config: Config,
    pub tokens: Vec<Token>,
}

impl Inventory {
    pub async fn new(config: Config, connector: Arc<Connector>) -> Result<Self> {
        let mut inventory = Inventory {
            connector,
            config,
            tokens: Vec::default(),
        };

        inventory.request_tokens().await?;
        Ok(inventory)
    }

    async fn request_tokens(&mut self) -> Result<()> {
        for token_config in &self.config.tokens {
            let token = self.request_token(token_config).await?;
            self.tokens.push(token);
        }
        Ok(())
    }

    async fn request_token(&self, token_config: &TokenConfig) -> Result<Token> {
        let rpc_client = self.connector.get_rpc_client(token_config.chain_id)?;

        let erc20 = IERC20Metadata::new(token_config.address, rpc_client.clone());
        let name = erc20.name().await?;
        let symbol = erc20.symbol().await?;
        let decimals = erc20.decimals().await?;
        let token = Token {
            address: token_config.address,
            name,
            symbol,
            chain_id: token_config.chain_id,
            decimals,
        };
        Ok(token)
    }

    pub fn find_token_by_address(&self, address: Address, chain_id: ChainId) -> Option<&Token> {
        self.tokens
            .iter()
            .find(|&i| i.address == address && i.chain_id == chain_id)
    }

    pub fn find_token_by_symbol(&self, symbol: String, chain_id: ChainId) -> Result<&Token> {
        self.tokens
            .iter()
            .find(|&i| i.symbol == symbol && i.chain_id == chain_id)
            .ok_or_else(|| {
                TokenError::UnsupportedMirrorToken(symbol.to_string(), chain_id.into()).into()
            })
    }

    pub fn find_token_by_symbol_partial_match(
        &self,
        symbol: String,
        chain_id: ChainId,
    ) -> Result<&Token> {
        self.tokens
            .iter()
            .find(|&i| {
                i.symbol.matches(&symbol).collect::<Vec<&str>>().len() == 1
                    && i.chain_id == chain_id
            })
            .ok_or_else(|| {
                TokenError::UnsupportedMirrorToken(symbol.to_string(), chain_id.into()).into()
            })
    }

    pub fn find_mirror_token(
        &self,
        spoke_chain_token_address: Address,
        spoke_chain_id: ChainId,
    ) -> Result<&Token> {
        let spoke_chain_token = self
            .find_token_by_address(spoke_chain_token_address, spoke_chain_id)
            .ok_or(TokenError::UnsupportedSpokeChainToken(
                spoke_chain_token_address,
            ))?;
        let generalized_token_symbol: &str = &spoke_chain_token.symbol[..4];
        let spoke_chain = self
            .config
            .chains
            .iter()
            .find(|chain| chain.chain_id == spoke_chain_id)
            .ok_or(ChainError::ChainNotFound(spoke_chain_id.into()))?;
        let mut mirror_token_symbol: String = generalized_token_symbol.to_string();
        mirror_token_symbol.push('.');
        mirror_token_symbol.push_str(&spoke_chain.name);

        let mirror_token =
            self.find_token_by_symbol(mirror_token_symbol.clone(), ChainId::Khalani)?;

        Ok(mirror_token)
    }
}

#[async_trait]
impl TokenBalanceQuery for Inventory {
    async fn get_balance(&self, token: &Token, owner: Address) -> Result<Amount> {
        let rpc_client = self.connector.get_rpc_client(token.chain_id)?;
        let erc20 = IERC20Metadata::new(token.address, rpc_client);
        let balance = erc20.balance_of(owner).await?;
        let amount = Amount::from_token_base_units(balance, token);
        Ok(amount)
    }
}

#[async_trait]
impl TokenAllowanceQuery for Inventory {
    async fn get_allowance(
        &self,
        token: &Token,
        owner: Address,
        spender: Address,
    ) -> Result<Amount> {
        let rpc_client = self.connector.get_rpc_client(token.chain_id)?;
        let erc20 = IERC20Metadata::new(token.address, rpc_client);
        let balance = erc20.allowance(owner, spender).await?;
        let amount = Amount::from_token_base_units(balance, token);
        Ok(amount)
    }
}
