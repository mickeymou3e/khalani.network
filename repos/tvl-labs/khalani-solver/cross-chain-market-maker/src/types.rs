use ethers::types::U256;

use solver_common::{inventory::amount::Amount, types::decimal::Decimal};

pub type Price = Decimal;

/// The direction of the limit order. Either ask or bid.
#[repr(u8)]
#[derive(Default, Copy, Clone, Debug, PartialEq, Eq)]
pub enum Direction {
    /// Ask is a limit order to sell the token.
    #[default]
    Ask = 0u8,
    /// Bid is a limit order to buy the token.
    Bid = 1u8,
}

impl Direction {
    /// Whether the direction is bid.
    pub fn is_bid(self) -> bool {
        self == Direction::Bid
    }
}

impl From<bool> for Direction {
    fn from(v: bool) -> Self {
        if v {
            return Direction::Bid;
        }
        Direction::Ask
    }
}

impl From<Direction> for bool {
    fn from(v: Direction) -> Self {
        v == Direction::Bid
    }
}

/// The limit order data to place. The `base_token` and `quote_token` is the key to
/// understand. The `base_token` is the token to ask or bid. The `quote_token` is the
/// token to measure to determine the self of the base token.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct LimitOrderData {
    /// The direction of the limit order. Either ask or bid.
    pub direction: Direction,
    /// The amount of the base token to ask or bid.
    pub amount: Amount,
    /// The price of the base token to ask or bid.
    pub price: U256,
}
