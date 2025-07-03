use crate::config::chain::ChainId;
use crate::inventory::amount::Amount;
use ethers::types::{Address, U256};
use std::ops::Mul;

#[derive(Clone, Debug, Eq, PartialEq, Hash)]
pub struct Token {
    pub chain_id: ChainId,
    pub address: Address,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
}

impl Token {
    pub fn new(
        chain_id: ChainId,
        address: Address,
        name: String,
        symbol: String,
        decimals: u8,
    ) -> Self {
        Self {
            chain_id,
            address,
            name,
            symbol,
            decimals,
        }
    }
}

impl Amount {
    pub fn from_user_units_token(user_units: U256, token: &Token) -> Amount {
        let multiplier = U256::exp10(token.decimals as usize);
        let base_units = user_units.mul(multiplier);
        Amount {
            decimals: token.decimals,
            base_units,
        }
    }

    pub fn from_token_base_units(base_units: U256, token: &Token) -> Amount {
        Amount {
            decimals: token.decimals,
            base_units,
        }
    }
}
