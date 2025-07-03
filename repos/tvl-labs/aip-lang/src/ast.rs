use std::ops::{Add, Div, Mul, Sub};

use alloy::primitives::U256;
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct FixedPointNumber {
    pub amount: U256,
    pub decimals: u8,
}

impl std::fmt::Display for FixedPointNumber {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let amount = self.amount.to_string();
        let decimals = self.decimals.to_string();
        write!(f, "{}.{}", amount, decimals)
    }
}

impl From<u64> for FixedPointNumber {
    fn from(value: u64) -> Self {
        FixedPointNumber {
            amount: U256::from(value),
            decimals: 0,
        }
    }
}

impl FixedPointNumber {
    pub fn parse(value: &str) -> Result<FixedPointNumber, String> {
        let (amount, decimals) = value.split_once('.').ok_or("Invalid number")?;
        let amount = U256::from_str_radix(amount, 10).map_err(|_| "Invalid number")?;
        let decimals = decimals.parse::<u8>().map_err(|_| "Invalid number")?;
        Ok(FixedPointNumber { amount, decimals })
    }
}

impl Add for FixedPointNumber {
    type Output = FixedPointNumber;

    fn add(self, rhs: Self) -> Self::Output {
        FixedPointNumber {
            amount: self.amount + rhs.amount,
            decimals: self.decimals,
        }
    }
}

impl Mul for FixedPointNumber {
    type Output = FixedPointNumber;

    fn mul(self, rhs: Self) -> Self::Output {
        FixedPointNumber {
            amount: self.amount * rhs.amount,
            decimals: self.decimals,
        }
    }
}

impl Div for FixedPointNumber {
    type Output = FixedPointNumber;

    fn div(self, rhs: Self) -> Self::Output {
        FixedPointNumber {
            amount: self.amount / rhs.amount,
            decimals: self.decimals,
        }
    }
}

impl Sub for FixedPointNumber {
    type Output = FixedPointNumber;

    fn sub(self, rhs: Self) -> Self::Output {
        FixedPointNumber {
            amount: self.amount - rhs.amount,
            decimals: self.decimals,
        }
    }
}

#[derive(Debug)]
pub struct Intent {
    pub name: String,
    pub params: Vec<String>,
    pub body: Vec<Statement>,
}

#[derive(Debug)]
pub enum Statement {
    Fact {
        name: String,
        amount: Expression,
        token: Expression,
    },
    Outcome {
        name: String,
        desire: Desire,
    },
    Fulfill {
        outcomes: Vec<String>,
        logic: FulfillmentLogic,
    },
}

#[derive(Debug)]
pub enum Desire {
    AmountOfToken {
        amount: Expression,
        token: Expression,
    },
    RangeOfToken {
        min: Expression,
        max: Expression,
        token: Expression,
    },
    AtLeastAmount {
        amount: Expression,
        token: Expression,
    },
}

#[derive(Debug)]
pub enum FulfillmentLogic {
    And,
    Or,
}

#[derive(Debug)]
pub enum Expression {
    Number(FixedPointNumber),
    Variable(String),
    BinaryOp {
        left: Box<Expression>,
        op: BinaryOperator,
        right: Box<Expression>,
    },
    FunctionCall {
        name: String,
        args: Vec<Expression>,
    },
}

#[derive(Debug)]
pub enum BinaryOperator {
    Plus,
    Minus,
    Multiply,
    Divide,
    Percentage,
}