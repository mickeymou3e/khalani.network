use ethers::types::U256;

use solver_common::inventory::amount::Amount;

use crate::types::{Direction, LimitOrderData};

pub const BASE_PRICE: U256 = U256([95, 0, 0, 0]);
pub const PRICE_STEP: U256 = U256::one();

/// Create a new stable token grid like:
/// ------------------------------
/// Direction Price Amount
/// ------------------------------
/// Bid       0.95  1/5quote_token
/// Bid       0.96  1/5quote_token
/// Bid       0.97  1/5quote_token
/// Bid       0.98  1/5quote_token
/// Bid       0.99  1/5quote_token
/// Ask       1.01  1/5base_token
/// Ask       1.02  1/5base_token
/// Ask       1.03  1/5base_token
/// Ask       1.04  1/5base_token
/// Ask       1.05  1/5base_token
/// ------------------------------
#[derive(Default, Copy, Clone, Debug)]
pub struct GridLevel {
    pub direction: Direction,
    pub price: U256,
    pub amount: Amount,
}

#[derive(Clone, Debug)]
pub struct Grid([GridLevel; 10]);

impl Grid {
    pub fn init() -> Self {
        let mut levels = [GridLevel::default(); 10];
        let mut bid_price = BASE_PRICE;
        let mut ask_price = BASE_PRICE;

        levels.iter_mut().enumerate().for_each(|(i, level)| {
            if i < 5 {
                // The index is [0, 5), are bid transactions. Use base token to buy
                // quote token.
                level.direction = Direction::Bid;
                level.price = bid_price;
                bid_price += PRICE_STEP;
            } else {
                // The index is [5, 10), are ask transactions. Sell quote token to buy
                // base token.
                level.direction = Direction::Ask;
                level.price = ask_price;
                ask_price += PRICE_STEP;
            }
        });

        Grid(levels)
    }

    pub fn increase(&mut self, index: usize, amount: Amount) {
        self.0[index].amount = self.0[index].amount + amount;
    }

    pub fn decrease(&mut self, index: usize, amount: Amount) {
        self.0[index].amount = self.0[index].amount - amount;
    }

    pub fn calculate_cancel_bid_prices(&self, average_bid_amount: Amount) -> Vec<U256> {
        self.0
            .iter()
            .enumerate()
            .filter_map(|(i, level)| {
                if level.direction.is_bid() && level.amount > average_bid_amount {
                    Some(BASE_PRICE + i)
                } else {
                    None
                }
            })
            .collect()
    }

    pub fn calculate_cancel_ask_prices(&self, average_ask_amount: Amount) -> Vec<U256> {
        self.0
            .iter()
            .enumerate()
            .filter_map(|(i, level)| {
                if (!level.direction.is_bid()) && level.amount > average_ask_amount {
                    Some(BASE_PRICE + i - 5)
                } else {
                    None
                }
            })
            .collect()
    }

    pub fn generate_inner_orders(
        &self,
        average_ask_amount: Amount,
        average_bid_amount: Amount,
    ) -> Vec<LimitOrderData> {
        self.0
            .iter()
            .map(|level| {
                if level.direction.is_bid() {
                    let amount = if average_bid_amount < level.amount {
                        average_bid_amount
                    } else {
                        average_bid_amount - level.amount
                    };

                    LimitOrderData {
                        direction: level.direction,
                        amount,
                        price: level.price,
                    }
                } else {
                    let amount = if average_ask_amount < level.amount {
                        average_ask_amount
                    } else {
                        average_ask_amount - level.amount
                    };

                    LimitOrderData {
                        direction: level.direction,
                        amount,
                        price: level.price,
                    }
                }
            })
            .collect()
    }
}
