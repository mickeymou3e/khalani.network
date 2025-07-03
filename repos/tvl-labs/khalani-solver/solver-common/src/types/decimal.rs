use std::cmp::{Eq, PartialEq};
use std::fmt::{self, Display, Formatter};
use std::ops::{Add, Div, Mul, Sub};

use ethers::{types::U256, utils::format_units};

/// An universal decimal type. The real value is
/// `base_units / 10^decimals`.
#[derive(Debug, Copy, Clone, PartialOrd, Ord, Default)]
pub struct Decimal {
    /// Base unit part.
    pub base_units: U256,
    /// Decimal places.
    pub decimals: u8,
}

impl PartialEq for Decimal {
    fn eq(&self, other: &Self) -> bool {
        if self.decimals == other.decimals {
            return self.base_units == other.base_units;
        }

        let left = self.reduction();
        let right = other.reduction();
        left.base_units == right.base_units && left.decimals == right.decimals
    }
}

impl Eq for Decimal {}

impl Decimal {
    /// Create an decimal from base units and decimals.
    pub const fn from_base_units(base_units: U256, decimals: u8) -> Self {
        Decimal {
            base_units,
            decimals,
        }
    }

    /// Rescale the decimals precision of the decimal.
    pub fn rescale_to_decimals(&self, decimals: u8) -> Self {
        if self.decimals == decimals {
            return *self;
        }

        if self.decimals < decimals {
            let multiplier = U256::exp10((decimals - self.decimals) as usize);
            Self {
                decimals,
                base_units: self.base_units.mul(multiplier),
            }
        } else {
            let divisor = U256::exp10((self.decimals - decimals) as usize);
            Self {
                decimals,
                base_units: self.base_units.div(divisor),
            }
        }
    }

    /// If the decimal is zero.
    pub fn is_zero(&self) -> bool {
        self.base_units.is_zero()
    }

    pub fn reduction(self) -> Self {
        let trailing_zero = self.base_units.trailing_zeros();
        if trailing_zero == 0 {
            return self;
        }

        let coef = trailing_zero.min(self.decimals as u32);
        let divisor = U256::exp10(coef as usize);

        Self {
            base_units: self.base_units.div(divisor),
            decimals: self.decimals + coef as u8,
        }
    }
}

impl Add for Decimal {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        if self.decimals == rhs.decimals {
            return Decimal {
                base_units: self.base_units + rhs.base_units,
                decimals: self.decimals,
            };
        }

        if self.decimals < rhs.decimals {
            let amplifier = self.rescale_to_decimals(rhs.decimals);
            return Decimal {
                base_units: amplifier.base_units + rhs.base_units,
                decimals: rhs.decimals,
            };
        }

        // self.decimals > rhs.decimals case
        let rhs = rhs.rescale_to_decimals(self.decimals);
        Decimal {
            base_units: self.base_units + rhs.base_units,
            decimals: self.decimals,
        }
    }
}

impl Sub for Decimal {
    type Output = Self;

    fn sub(self, rhs: Self) -> Self::Output {
        if self.decimals == rhs.decimals {
            return Decimal {
                base_units: self.base_units - rhs.base_units,
                decimals: self.decimals,
            };
        }

        if self.decimals < rhs.decimals {
            let amplifier = self.rescale_to_decimals(rhs.decimals);
            return Decimal {
                base_units: amplifier.base_units - rhs.base_units,
                decimals: rhs.decimals,
            };
        }

        // self.decimals > rhs.decimals case
        let rhs = rhs.rescale_to_decimals(self.decimals);
        Decimal {
            base_units: self.base_units - rhs.base_units,
            decimals: self.decimals,
        }
    }
}

impl Mul<U256> for Decimal {
    type Output = Self;

    fn mul(self, rhs: U256) -> Self::Output {
        Decimal {
            base_units: self.base_units * rhs,
            decimals: self.decimals,
        }
        .reduction()
    }
}

impl Mul<Decimal> for Decimal {
    type Output = Self;

    fn mul(self, rhs: Decimal) -> Self::Output {
        Decimal {
            base_units: self.base_units * rhs.base_units,
            decimals: self.decimals + rhs.decimals,
        }
        .reduction()
    }
}

impl Div<U256> for Decimal {
    type Output = Self;

    fn div(self, rhs: U256) -> Self::Output {
        Decimal {
            base_units: self.base_units.div(rhs),
            decimals: self.decimals,
        }
    }
}

impl Display for Decimal {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match format_units(self.base_units, self.decimals as u32) {
            Ok(result) => write!(f, "{}", result),
            Err(error) => {
                writeln!(f, "Error formatting units {}", error)?;
                Err(fmt::Error)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_decimal_add() {
        let decimal1 = Decimal {
            base_units: U256::from_dec_str("1000").unwrap(),
            decimals: 2,
        };

        let decimal2 = Decimal {
            base_units: U256::from_dec_str("2000").unwrap(),
            decimals: 2,
        };

        let expected_sum = Decimal {
            base_units: U256::from_dec_str("3000").unwrap(),
            decimals: 2,
        };

        let result = decimal1 + decimal2;
        assert_eq!(result, expected_sum);
    }

    #[test]
    fn test_decimal_addition_different_decimals() {
        let decimal1 = Decimal {
            base_units: U256::from_dec_str("1000").unwrap(),
            decimals: 2,
        };

        let decimal2 = Decimal {
            base_units: U256::from_dec_str("2000").unwrap(),
            decimals: 3,
        };

        let result = decimal1 + decimal2;
        assert_eq!(
            result,
            Decimal::from_base_units(U256::from_dec_str("12000").unwrap(), 3)
        );
    }

    #[test]
    fn test_decimal_mul() {
        let decimal1 = Decimal {
            base_units: U256::from_dec_str("1000").unwrap(),
            decimals: 2,
        };

        let coefficient = U256::from_dec_str("2000").unwrap();

        let result = decimal1 * coefficient;
        assert_eq!(
            result,
            Decimal::from_base_units(U256::from_dec_str("20000").unwrap(), 4)
        );
    }

    #[test]
    fn test_rescale_to_decimals() {
        let decimal = Decimal {
            base_units: U256::from_dec_str("12345678901234567890").unwrap(),
            decimals: 8,
        };
        assert_eq!(decimal.to_string(), "123456789012.34567890");
        assert_eq!(
            decimal.rescale_to_decimals(10).to_string(),
            "123456789012.3456789000"
        );
        assert_eq!(
            decimal.rescale_to_decimals(6).to_string(),
            "123456789012.345678"
        );
    }

    #[test]
    fn test_decimal_display() {
        let decimal = Decimal {
            base_units: U256::from_dec_str("12345678901234567890").unwrap(),
            decimals: 8,
        };
        assert_eq!(decimal.to_string(), "123456789012.34567890");
    }

    #[test]
    fn test_is_zero() {
        let decimal = Decimal {
            base_units: U256::from_dec_str("0").unwrap(),
            decimals: 8,
        };
        assert!(decimal.is_zero());
    }

    #[test]
    fn test_div() {
        let decimal = Decimal {
            base_units: U256::from_dec_str("12345678901234567890").unwrap(),
            decimals: 8,
        };
        let res = decimal.div(U256::from_dec_str("2").unwrap());
        assert_eq!(res.to_string(), "61728394506.17283945");
    }
}
