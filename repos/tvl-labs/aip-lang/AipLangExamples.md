# AIP Language Examples

This document shows examples of common token trading patterns expressed in the AIP language.

## 1. Exact Token Swaps
**Use Case**: Swap exactly 1000 Token1 for exactly 2000 Token2

```
intent ExactSwap {
    alice = owns 1000 of Token1;
    goal = desires 2000 of Token2;
    fulfill goal;
}
```

## 2. Token Swaps with Minimum Output
**Use Case**: Swap 1000 Token1 for at least 1950 Token2 (2.5% slippage)

```
intent MinimumSwap {
    alice = owns 1000 of Token1;
    goal = desires at least 1950 of Token2;
    fulfill goal;
}
```

## 3. Percentage Fee on Single Asset
**Use Case**: LP providing Token1, charging 1.5% fee for any amount used

```
intent SingleAssetFee {
    lp = owns 1000 of Token1;
    fee = desires 1.5 of Token2;  // 1.5% fee
    fulfill fee;
}
```

## 4. Range-Based Single Asset Trade
**Use Case**: Swap 1000 Token1 for between 1950-2050 Token2

```
intent RangeSwap {
    alice = owns 1000 of Token1;
    goal = desires 1950 to 2050 of Token2;
    fulfill goal;
}
```

## 5. Multi-Asset Exact Trade
**Use Case**: Split 1000 Token1 into exactly 500 Token2 and 250 Token3

```
intent MultiExactSwap {
    alice = owns 1000 of Token1;
    goal1 = desires 500 of Token2;
    goal2 = desires 250 of Token3;
    fulfill goal1 and goal2;
}
```

## 6. Multi-Asset Trade with Minimums
**Use Case**: Convert 1000 Token1 to at least 475 Token2 and 240 Token3

```
intent MultiMinSwap {
    alice = owns 1000 of Token1;
    goal1 = desires at least 475 of Token2;
    goal2 = desires at least 240 of Token3;
    fulfill goal1 and goal2;
}
```

## 7. Multi-Asset Percentage Fees
**Use Case**: LP providing Token1, charging 1.5% for Token2 trades and 2.5% for Token3 trades

```
intent MultiFeeLP {
    lp = owns 1000 of Token1;
    fee1 = desires 1.5 of Token2;  // 1.5% fee
    fee2 = desires 2.5 of Token3;  // 2.5% fee
    fulfill fee1 or fee2;
}
```

## 8. Multi-Asset Range Trading
**Use Case**: Trade 1000 Token1 for ranges of Token2 (1900-2100) and/or Token3 (950-1050)

```
intent MultiRangeSwap {
    alice = owns 1000 of Token1;
    goal1 = desires 1900 to 2100 of Token2;
    goal2 = desires 950 to 1050 of Token3;
    fulfill goal1 or goal2;
}
```

## 9. Fixed-Ratio Multi-Asset Trade
**Use Case**: Must get exactly 500 Token2 AND 250 Token3 for 1000 Token1

```
intent FixedRatioSwap {
    alice = owns 1000 of Token1;
    goal1 = desires 500 of Token2;
    goal2 = desires 250 of Token3;
    fulfill goal1 and goal2;
}
```

## 10. Multi-Asset Minimum Guarantees
**Use Case**: Must get at least 475 Token2 AND at least 240 Token3

```
intent MultiMinGuarantee {
    alice = owns 1000 of Token1;
    goal1 = desires at least 475 of Token2;
    goal2 = desires at least 240 of Token3;
    fulfill goal1 and goal2;
}
```

## 11. Multi-Asset Mandatory Fee Distribution
**Use Case**: 1% fee must be paid in both Token2 AND Token3

```
intent MultiFeeDistribution {
    lp = owns 1000 of Token1;
    fee1 = desires 1.0 of Token2;  // 1% fee
    fee2 = desires 1.0 of Token3;  // 1% fee
    fulfill fee1 and fee2;
}
```

## 12. Multi-Asset Portfolio with Ranges
**Use Case**: Must get Token2 (475-525) AND Token3 (235-265)

```
intent PortfolioRange {
    alice = owns 1000 of Token1;
    goal1 = desires 475 to 525 of Token2;
    goal2 = desires 235 to 265 of Token3;
    fulfill goal1 and goal2;
}
```

## Notes
- All examples show the basic structure. Additional parameters can be added to intents as needed.
- Token amounts are normalized to their respective decimals.
- The `fulfill` statement uses `and` to require all outcomes, `or` to allow any outcomes.
- Percentage values are expressed as decimal numbers (e.g., 1.5 for 1.5%).
