# Gas oracle services

## Gas Oracle Updater Service

## Overview

This service automatically adjusts the on-chain gas usage parameter (stored in the GasAmountOracle contract) used for interchain gas fee calculations. It recalculates the effective gas usage based on the current gas price (in wei) on the destination chain versus a baseline measured during benchmarking.

## How It Works

### Baseline Benchmarking:

A baseline gas usage (e.g., the gas consumed by your handle function) and a baseline gas price (in wei) are determined during initial testing.

### Real-Time Monitoring:

The service periodically fetches the current gas price (in wei) from the destination chain's RPC.

### Calculation:

It recalculates the effective gas usage using the formula:

    newGasUsage = baselineGasUsage × (currentGasPrice / baselineGasPrice) × safety_margin

This scales your baseline consumption to match current network conditions.

### Conditional Update:

If the recalculated value differs from the stored value by more than a preset threshold (e.g., 5%), the service updates the GasAmountOracle on-chain.

### Periodic Execution:

The routine runs at a configurable interval (for example, every 30 minutes).

## Configuration

In the configuration file (config.json), you need to specify:

- baselineGasUsage: Gas units consumed by the handle function (e.g., 100,000).
- baselineGasPrice: Gas price (in wei) at the time of benchmarking (e.g., 50 gwei = 50,000,000,000 wei).
- safety_margin: A multiplier for extra gas (e.g., 1.1 for 10% extra).
- update_threshold: The minimum relative difference (e.g., 0.05 for 5%) needed to trigger an update.
- interval_minutes: How often the updater runs.

This will continuously monitor the destination chain's gas price and update the GasAmountOracle when necessary.

## Redeemer Updater Service

### Overview

The Redeemer Updater Service automatically maintains the conversion rate (s_aipEthRate) in your EthAipRedeemer contract to match current ETH market prices. This rate determines how much "mirrored ETH" a relayer receives when depositing your proprietary AIP token.

### How It Works:

- Fetch ETH Price: Periodically retrieves the current ETH price from a reliable source (e.g., Coingecko).
- Recalculate Rate: Uses the formula:

  newRate = baselineRate × (currentEthPrice / baselineEthPrice)

  where:

- baselineRate is the conversion rate you originally set (in wei),
- baselineEthPrice is the ETH price (in USD) when the baseline rate was established.

- Compare and Update: Compares the new calculated rate with the on-chain value. If the difference exceeds a small threshold (e.g., 1%), the service sends a transaction to update the conversion rate.

- Operation: The service runs at a fixed interval (e.g., every 30 minutes) and updates the contract only when the change is significant.

### Configuration

- Fill in your redeemer details (such as the redeemer contract address, private key, baseline conversion rate, and baseline ETH price) in your configuration file.
- The baseline values must reflect the conditions when you benchmarked the conversion rate. For example, if you set the baseline conversion rate to 1e18 (1:1) when ETH was $1800, use those numbers.

## Running the Services

Compile and run the service in local, use:

```shell
cargo run --release
```

To run the service with AWS signer, use:

```shell
cargo run --release --features aws
```
