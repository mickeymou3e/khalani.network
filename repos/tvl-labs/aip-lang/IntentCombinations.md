# Intent Combinations List

This document enumerates all possible combinations of OutcomeAssetStructure and FillStructure, explaining the semantic meaning of each combination.

## OutcomeAssetStructure Types
- **AnySingle**: Only one asset from the outcome list can be selected
- **Any**: Multiple assets from the outcome list can be selected
- **All**: All assets from the outcome list must be received

## FillStructure Types
- **Exactly**: The exact specified amounts must be filled
- **Minimum**: At least the specified amounts must be filled
- **PctFilled**: Amounts represent percentage-based fees on the filled amount
- **ConcreteRange**: Amounts represent a range of acceptable values

## Combinations and Their Semantics

### 1. AnySingle + Exactly
**Use Case**: Exact token swaps
- Requires receiving exactly the specified amount of one token from the outcome list
- Common in atomic swaps where price is fixed
- Example: Swap exactly 1000 Token1 for exactly 2000 Token2

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [2000],
        outcomeAssetStructure: AnySingle,
        fillStructure: Exactly
    }
}
```

### 2. AnySingle + Minimum
**Use Case**: Token swaps with slippage tolerance
- Requires receiving at least the minimum amount of one token
- Perfect for standard DEX-style trades with slippage protection
- Example: Swap 1000 Token1 for at least 1950 Token2 (2.5% slippage)

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [1950],
        outcomeAssetStructure: AnySingle,
        fillStructure: Minimum
    }
}
```

### 3. AnySingle + PctFilled
**Use Case**: Single-asset liquidity provision with percentage-based fees
- Fee is calculated as percentage of the source amount used
- Allows partial fills with proportional fees
- Example: LP providing Token1, charging 1.5% fee for any amount used

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [15], // 1.5% fee
        outcomeAssetStructure: AnySingle,
        fillStructure: PctFilled
    }
}
```

### 4. AnySingle + ConcreteRange
**Use Case**: Flexible single-asset trades with price ranges
- Accepts a range of output amounts for one chosen token
- Useful for limit orders with price ranges
- Example: Swap 1000 Token1 for between 1950-2050 Token2

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [1950, 2050], // min and max
        outcomeAssetStructure: AnySingle,
        fillStructure: ConcreteRange
    }
}
```

### 5. Any + Exactly
**Use Case**: Multi-asset exact trades
- Can receive multiple assets but each must be exact amount
- Useful for complex trades requiring precise outputs
- Example: Split 1000 Token1 into exactly 500 Token2 and 250 Token3

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [500, 250],
        outcomeAssetStructure: Any,
        fillStructure: Exactly
    }
}
```

### 6. Any + Minimum
**Use Case**: Multi-asset trades with slippage tolerance
- Can receive multiple assets, each with minimum amounts
- Good for complex trades with slippage protection
- Example: Convert 1000 Token1 to at least 475 Token2 and 240 Token3

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [475, 240],
        outcomeAssetStructure: Any,
        fillStructure: Minimum
    }
}
```

### 7. Any + PctFilled
**Use Case**: Multi-asset liquidity provision
- Percentage-based fees for multiple possible output tokens
- Common in AMM-style liquidity provision
- Example: LP providing Token1, charging 1.5% for Token2 trades and 2.5% for Token3 trades

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [15, 25], // 1.5% fee for Token2, 2.5% fee for Token3
        outcomeAssetStructure: Any,
        fillStructure: PctFilled
    }
}
```

### 8. Any + ConcreteRange
**Use Case**: Flexible multi-asset trading ranges
- Accepts ranges for multiple possible output tokens
- Useful for complex portfolio rebalancing
- Example: Trade 1000 Token1 for ranges of Token2 (1900-2100) and/or Token3 (950-1050)

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [1900, 2100, 950, 1050], // ranges for each token
        outcomeAssetStructure: Any,
        fillStructure: ConcreteRange
    }
}
```

### 9. All + Exactly
**Use Case**: Fixed-ratio multi-asset trades
- Must receive exact amounts of all specified tokens
- Useful for preset portfolio construction
- Example: Must get exactly 500 Token2 AND 250 Token3 for 1000 Token1

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [500, 250],
        outcomeAssetStructure: All,
        fillStructure: Exactly
    }
}
```

### 10. All + Minimum
**Use Case**: Multi-asset trades with minimum guarantees
- Must receive at least the minimum of all specified tokens
- Good for portfolio construction with slippage tolerance
- Example: Must get at least 475 Token2 AND at least 240 Token3

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {å
        mTokens: [Token2Address, Token3Address],
        mAmounts: [475, 240],
        outcomeAssetStructure: All,
        fillStructure: Minimum
    }
}
```

### 11. All + PctFilled
**Use Case**: Multi-asset mandatory fee distribution
- Percentage-based fees must be paid in all specified tokens
- Useful for complex fee distribution mechanisms
- Example: 1% fee must be paid in both Token2 AND Token3

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [10, 10], // 1% fee in both tokens
        outcomeAssetStructure: All,
        fillStructure: PctFilled
    }
}
```

### 12. All + ConcreteRange
**Use Case**: Multi-asset portfolio construction with ranges
- Must receive all assets within specified ranges
- Perfect for flexible portfolio rebalancing
- Example: Must get Token2 (475-525) AND Token3 (235-265)

```solidity
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [475, 525, 235, 265], // ranges for both tokens
        outcomeAssetStructure: All,
        fillStructure: ConcreteRange
    }
}
```

## Notes
- All combinations assume the presence of a source token (srcMToken) and amount (srcAmount)
- Amounts are normalized to 18 decimal places
- Percentage values in PctFilled are expressed as 0-1000 (2 decimal precision)
- For ConcreteRange, the amounts array contains min and max values for each token in sequence