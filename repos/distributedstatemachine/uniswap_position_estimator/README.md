# Uniswap V3 NFT Position and Fee Calculator

## Introduction

This module contains functions to interact with the Uniswap V3 GraphQL API to retrieve and calculate various properties related to a user's NFT positions on the exchange. It is useful for developers or traders who want to query Uniswap V3 for specific data on their NFTs and calculate fees accrued over time.

## Features

- Retrieve positions for a specific Ethereum wallet.
- Calculate uncollected fees for a given position.
- Retrieve the current state of a Uniswap V3 Position.

## Dependencies

- `os`
- `requests`
- `web3`
- `typing`
- `decimal`
- `datetime`
- `pytest` (for testing)
- `Node.js` and `npm` (for running JavaScript calculations)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) 

## Key Functions

- `uniswap_v3_nfts(wallet_address: str, client: GraphQLClient) -> UniswapV3NFT`
- `calculate_fees(pool: dict, position: dict, token0: dict, token1: dict) -> Tuple[Decimal, Decimal]`
- `uniswap_v3_position_state(position_id: str, client: GraphQLClient) -> UniswapV3PositionState`

## Configuration

- `RPC_URL`: Ethereum RPC URL, which is read from the environment variable.

## JavaScript Environment Setup

Before using this Python module, you need to set up the JavaScript environment required to perform calculations:

1. Ensure you have `Node.js` and `npm` installed on your system.
2. Navigate to the `uniswap_v3` directory within this project.
3. Run `npm install` to install the necessary JavaScript dependencies.

## Usage

1. Ensure you have the required Python dependencies installed.
2. Set up your Ethereum RPC URL in an environment variable or in the `config.py` file.
3. For JavaScript calculations, make sure the JavaScript environment is set up with the instructions provided above.
4. Instantiate a GraphQL client and use it as a parameter for the functions.
5. Call the desired functions with the required parameters.

## Testing with `pytest`

To run tests for the Python module, follow these steps:

```
anvil -f <INFURA_URL>
```

```
export RPC_URL=http://localhost:8545
```

```
export PRIVATE_KEY=<private_key_generate_by_anvil>
```

1. Install `pytest` if it is not already installed:
   ```bash
   pip install pytest
   ```


