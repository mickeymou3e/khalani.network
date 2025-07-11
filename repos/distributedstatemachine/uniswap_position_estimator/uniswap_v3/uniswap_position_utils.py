import os
import json
import subprocess
from typing import Any, Tuple, NamedTuple
from decimal import Decimal, getcontext, ROUND_DOWN
from web3 import Web3
from datetime import datetime
from .config import RPC_URL
from .client import GraphQLClient
from .utils import load_graphql_query, dir_path


# Constants and setup
RPC_URL = os.environ.get("RPC_URL")
w3 = Web3(Web3.HTTPProvider(f"{RPC_URL}"))
getcontext().prec = 78  # 256 bits
dir_path = os.path.dirname(os.path.realpath(__file__))
ZERO = Decimal(0)
Q128 = Decimal(2) ** 128
Q256 = Decimal(2) ** 256
TICK_BASE = 1.0001
MAX_UINT256 = 2**256 - 1


class UniswapV3NFT(NamedTuple):
    block_time: str
    current_block_number: int
    nft_addresses: Tuple[str, ...]


class UniswapV3PositionState(NamedTuple):
    pool_address: str
    token0_lp_amount: float
    token1_lp_amount: float
    token0_fee_amount: float
    token1_fee_amount: float



def uniswap_v3_nfts(wallet_address: str, client: GraphQLClient) -> UniswapV3NFT:
    """Retrieve NFT positions for a wallet using a GraphQL client."""

    # Load GraphQL query from file
    file_path = os.path.join(dir_path, "queries", "nft_positions_query.graphql")
    query = load_graphql_query(file_path)

    # Define variables for the GraphQL query
    variables = {"owner": wallet_address}

    # Use the client to get the data
    response = client.get(query, variables)

    # Extract data from the "data" key of the response
    graphql_response = response.get("data", {})
    positions = graphql_response.get("positions", [])

    if not positions:
        raise Exception(
            "No NFT positions found in the GraphQL response for the given wallet_address"
        )

    # Extract necessary information from the data
    block = w3.eth.get_block("latest")
    block_time = datetime.utcfromtimestamp(block.timestamp).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )
    current_block_number = w3.eth.block_number

    # Extract NFT positions
    nft_addresses = tuple(
        position for position in positions
    )  # Assuming position id represents the NFT address.

    return UniswapV3NFT(block_time, current_block_number, nft_addresses)


def tick_to_price(tick):
    return TICK_BASE**tick


def sub_in_256(x, y):
    Q256 = 2**256
    difference = x - y
    if difference < 0:
        difference += Q256
    return difference

# Mimic JavaScript's toFixed function
def to_fixed(num, decimals=0):
    return num.quantize(Decimal('1.' + '0' * decimals), rounding=ROUND_DOWN)
    

def to_decimal(num_str):
    return Decimal(num_str)

def calculate_fees(position_id) -> Tuple[float, float]:
    # Assuming 'pool', 'position', 'token0', 'token1' are dicts or objects that contain the necessary data.
    # You'll have to adjust the access of attributes to match the structure of your objects.

    # Replace 'dir_path' and 'calculate_fees.js' with your actual directory path and JavaScript file name.
    results = subprocess.run(
        ["node", os.path.join(dir_path, "calculate_fees.js"), str(position_id)],
        capture_output=True,
        text=True,
    )

    if results.returncode != 0:
        print("Error running script:", results.stderr)
        return None, None

    output = results.stdout.strip()
    if output:
    # Split the output into individual parts
        parts = output.split()
        # Ensure there are at least three parts and only get the last two
        if len(parts) >= 3:
            print("Output from JS:", output)  # Add this line to debug
            _, uncollectedFeesAdjusted_0_str, uncollectedFeesAdjusted_1_str = output.split()
            uncollectedFeesAdjusted_0 = uncollectedFeesAdjusted_0_str
            uncollectedFeesAdjusted_1 = uncollectedFeesAdjusted_1_str
            return float(uncollectedFeesAdjusted_0), float(uncollectedFeesAdjusted_1)
        else:
            raise ValueError("Output did not contain enough values.")
    else:
        raise ValueError("No output returned from JavaScript script")

def uniswap_v3_position_state(
    position_id: str, client: GraphQLClient
) -> UniswapV3PositionState:
    """
    Returns the actual state of a V3 NFT.

    :param position_id: str, identifier of the NFT representing the position
    :param client: GraphQLClient instance for executing queries

    :returns: namedtuple of:
        - pool_address: str. Can't be None.
        - token0_lp_amount: float. Can't be None. Amount of token0 in the LP NFT.
        - token1_lp_amount: float. Can't be None. Amount of token1 in the LP NFT.
        - token0_fee_amount: float. Can't be None. Amount of token0 held as fees.
        - token1_fee_amount: float. Can't be None. Amount of token1 held as fees.
    """
    # Load GraphQL query from file
    query_path = os.path.join(dir_path, "queries", "position_data_query.graphql")
    query = load_graphql_query(query_path)

    # Define variables for the GraphQL query
    variables = {"id": position_id}

    # Use the client to get the data
    response = client.get(query, variables)

    # Extract data from the "data" key of the response
    graphql_response = response.get("data", {})
    positions = graphql_response.get("positions", [])

    if not positions:
        raise Exception(
            "No data found in the GraphQL response for the given position_id"
        )

    position_data = positions[0]

    # Extract necessary information from the data
    pool_address = position_data["pool"]["id"]

    # Extract token data for the pool's tokens
    token0_data = position_data["token0"]
    token1_data = position_data["token1"]
    decimals0 = int(position_data["token0"]["decimals"])
    decimals1 = int(position_data["token1"]["decimals"])

    # Calculate the uncollected fees
    token0_fee_amount, token1_fee_amount = calculate_fees(
        position_id
    )

    # Extract tick data
    tick_lower = int(position_data["tickLower"]["tickIdx"])
    tick_upper = int(position_data["tickUpper"]["tickIdx"])
    current_tick = int(position_data["pool"]["tick"])
    current_sqrt_price = Decimal(position_data["pool"]["sqrtPrice"]) / (2**96)
    liquidity = Decimal(position_data["liquidity"])

    current_price = int(tick_to_price(current_tick))
    adjusted_current_price = current_price / (10 ** (decimals1 - decimals0))
    print(
        "Current price={:.6f} {} for {} at tick {}".format(
            adjusted_current_price, token1_data, token0_data, current_tick
        )
    )

    sa = Decimal(tick_to_price(tick_lower / 2))
    sb = Decimal(tick_to_price(tick_upper / 2))

    if tick_upper <= current_tick:
        amount0 = ZERO
        amount1 = liquidity * (sb - sa)
    elif tick_lower < current_tick < tick_upper:
        amount0 = liquidity * (sb - current_sqrt_price) / (current_sqrt_price * sb)
        amount1 = liquidity * (current_sqrt_price - sa)
    else:
        amount0 = liquidity * (sb - sa) / (sa * sb)
        amount1 = ZERO

    token0_lp_amount = amount0 / (10**decimals0)
    token1_lp_amount = amount1 / (10**decimals1)

    print(f"tokenLP0 {token0_lp_amount}", f"tokenLP1 {token1_lp_amount}")

    return UniswapV3PositionState(
        pool_address,
        float(token0_lp_amount),
        float(token1_lp_amount),
        token0_fee_amount,
        token1_fee_amount,
    )