# Uniswap V3 NFT Position and Fee Calculator

## Introduction

This module contains functions to interact with the Uniswap V3 GraphQL API to retrieve and calculate various properties related to a user's NFT positions on the exchange. It is useful for developers or traders who want to query Uniswap V3 for specific data on their NFTs and calculate fees accrued over time.

## Features

1. Retrieve positions for a specific Ethereum wallet.
2. Calculate uncollected fees for a given position.
3. Retrieve the current state of a Uniswap V3 Positon.

## Dependencies

- `os`
- `requests`
- `web3`
- `typing`
- `decimal`
- `datetime`
- `pytest` (for testing)

## Key Functions

### 1. `uniswap_v3_nfts(wallet_address: str, client: GraphQLClient) -> UniswapV3NFT`

This function retrieves the NFT positions for a given Ethereum wallet address using the provided GraphQL client. It returns a named tuple containing the current block time, the current block number, and a tuple of NFT addresses (assumed to be position IDs).

### 2. `calculate_fees(pool: dict, position: dict, token0: dict, token1: dict) -> Tuple[Decimal, Decimal]`

Given the pool, position, and token data, this function calculates and returns the uncollected fees for the position's tokens.

### 3. `uniswap_v3_position_state(position_id: str, client: GraphQLClient) -> UniswapV3PositionState`

Returns the current state of a V3 NFT. This includes the pool's address, amounts of both tokens in the LP NFT, and the amount of both tokens held as fees.

## Configuration

- `RPC_URL`: Ethereum RPC URL, which is read from the environment variable.

### Usage

1. Ensure you have the required dependencies installed.
2. Set up your Ethereum RPC URL in an environment variable or in the `config.py` file.
3. Instantiate a GraphQL client and use it as a parameter for the functions.
4. Call the desired functions with the required parameters.

### Testing with `pytest`

1. Ensure you have `pytest` installed. If not, install it using:

   ```bash
   pip install pytest
   ```

2. Navigate to the directory containing your test script.

3. Run the tests using the following command:

   ```bash
    pytest tests/test_uniswap.py 
   ```

4. `pytest` will automatically discover and run all functions prefixed with `test_`.

### Notes

- The `UniswapV3PositionState` function assumes a certain structure for the GraphQL response. If the structure of the response changes or if different data is desired, modifications might be required.
- The NFT addresses in `uniswap_v3_nfts` function are assumed to be position IDs. This assumption might need verification or adjustment based on your use case.
- Error handling is included for scenarios where the GraphQL response does not match the expected structure.
