import os
import requests
from typing import Tuple, NamedTuple
from decimal import Decimal, getcontext
from web3 import Web3
from datetime import datetime
from .config import RPC_URL
from .client import GraphQLClient


# Constants and setup
RPC_URL = os.environ.get("RPC_URL")
w3 = Web3(Web3.HTTPProvider(f"{RPC_URL}"))
getcontext().prec = 40
dir_path = os.path.dirname(os.path.realpath(__file__))
Q128 = Decimal(2) ** 128
ZERO = Decimal(0)
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


def load_graphql_query(file_path: str) -> str:
    with open(file_path, "r") as file:
        return file.read()


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


def calculate_fees(
    pool: dict, position: dict, token0: dict, token1: dict
) -> Tuple[Decimal, Decimal]:
    # Retrieve current tick, lower tick, and upper tick from the position data and convert them to integers
    tickCurrent = int(pool["tick"])
    tickLower = int(position["tickLower"]["tickIdx"])
    tickUpper = int(position["tickUpper"]["tickIdx"])

    # Retrieve and convert liquidity from the position data to Decimal
    liquidity = Decimal(position["liquidity"])

    # Retrieve and convert global fee growth for both tokens from the pool data using UFlow
    feeGrowthGlobal_0 = UFlow(int(pool["feeGrowthGlobal0X128"]), num_bits=256)
    feeGrowthGlobal_1 = UFlow(int(pool["feeGrowthGlobal1X128"]), num_bits=256)

    # Retrieve and convert fee growth outside lower and upper ticks for both tokens from the position data using UFlow
    tickLowerFeeGrowthOutside_0 = UFlow(int(position["tickLower"]["feeGrowthOutside0X128"]), num_bits=256)
    tickLowerFeeGrowthOutside_1 = UFlow(int(position["tickLower"]["feeGrowthOutside1X128"]), num_bits=256)
    tickUpperFeeGrowthOutside_0 = UFlow(int(position["tickUpper"]["feeGrowthOutside0X128"]), num_bits=256)
    tickUpperFeeGrowthOutside_1 = UFlow(int(position["tickUpper"]["feeGrowthOutside1X128"]), num_bits=256)

    # Initialize variables to zero
    tickLowerFeeGrowthBelow_0 = UFlow(0, num_bits=256)
    tickLowerFeeGrowthBelow_1 = UFlow(0, num_bits=256)
    tickUpperFeeGrowthAbove_0 = UFlow(0, num_bits=256)
    tickUpperFeeGrowthAbove_1 = UFlow(0, num_bits=256)

    # Conditional logic to calculate fee growth below the lower tick for both tokens
    if tickCurrent >= tickLower:
        tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0
        tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1
    else:
        tickLowerFeeGrowthBelow_0 = feeGrowthGlobal_0 - tickLowerFeeGrowthOutside_0
        tickLowerFeeGrowthBelow_1 = feeGrowthGlobal_1 - tickLowerFeeGrowthOutside_1

    # Conditional logic to calculate fee growth above the upper tick for both tokens
    if tickCurrent < tickUpper:
        tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0
        tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1
    else:
        tickUpperFeeGrowthAbove_0 = feeGrowthGlobal_0 - tickUpperFeeGrowthOutside_0
        tickUpperFeeGrowthAbove_1 = feeGrowthGlobal_1 - tickUpperFeeGrowthOutside_1

    # Calculate fee growth between the upper and lower ticks for both tokens
    fr_t1_0 = feeGrowthGlobal_0 - tickLowerFeeGrowthBelow_0 - tickUpperFeeGrowthAbove_0
    fr_t1_1 = feeGrowthGlobal_1 - tickLowerFeeGrowthBelow_1 - tickUpperFeeGrowthAbove_1

    # Retrieve and convert fee growth inside the position for the last time it was updated for both tokens using UFlow
    feeGrowthInsideLast_0 = UFlow(int(position["feeGrowthInside0LastX128"]), num_bits=256)
    feeGrowthInsideLast_1 = UFlow(int(position["feeGrowthInside1LastX128"]), num_bits=256)

    # Calculate uncollected fees for both tokens and adjust for token decimals
    uncollectedFees_0 = (liquidity * (fr_t1_0 - feeGrowthInsideLast_0).num) / Q128
    uncollectedFees_1 = (liquidity * (fr_t1_1 - feeGrowthInsideLast_1).num) / Q128

    # Get token decimals, with a default of 18 if not present
    decimals_0 = int(token0.get("decimals", 18))
    decimals_1 = int(token1.get("decimals", 18))

    # Adjust the uncollected fees for token decimals
    uncollectedFeesAdjusted_0 = uncollectedFees_0 / (10 ** Decimal(decimals_0))
    uncollectedFeesAdjusted_1 = uncollectedFees_1 / (10 ** Decimal(decimals_1))

    # Return the adjusted uncollected fees for both tokens
    return uncollectedFeesAdjusted_0, uncollectedFeesAdjusted_1


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
    token0_data = position_data["pool"]["token0"]
    token1_data = position_data["pool"]["token1"]
    decimals0 = int(position_data["token0"]["decimals"])
    decimals1 = int(position_data["token1"]["decimals"])

    # Calculate the uncollected fees
    token0_fee_amount, token1_fee_amount = calculate_fees(
        position_data["pool"], position_data, token0_data, token1_data
    )

    # Extract tick data
    tick_lower = int(position_data["tickLower"]["tickIdx"])
    tick_upper = int(position_data["tickUpper"]["tickIdx"])
    current_tick = int(position_data["pool"]["tick"])
    current_sqrt_price = int(position_data["pool"]["sqrtPrice"]) / (2**96)
    liquidity = int(position_data["liquidity"])

    current_price = tick_to_price(current_tick)
    adjusted_current_price = current_price / (10 ** (decimals1 - decimals0))
    print(
        "Current price={:.6f} {} for {} at tick {}".format(
            adjusted_current_price, token1_data, token0_data, current_tick
        )
    )

    sa = tick_to_price(tick_lower / 2)
    sb = tick_to_price(tick_upper / 2)

    if tick_upper <= current_tick:
        amount0 = 0
        amount1 = liquidity * (sb - sa)
    elif tick_lower < current_tick < tick_upper:
        amount0 = liquidity * (sb - current_sqrt_price) / (current_sqrt_price * sb)
        amount1 = liquidity * (current_sqrt_price - sa)
    else:
        amount0 = liquidity * (sb - sa) / (sa - sb)
        amount1 = 0

    token0_lp_amount = amount0 / (10**decimals0)
    token1_lp_amount = amount1 / (10**decimals1)

    print(f"tokenLP0 {token0_lp_amount}", f"tokenLP1 {token1_lp_amount}")

    return UniswapV3PositionState(
        pool_address,
        float(token0_lp_amount),
        float(token1_lp_amount),
        float(token0_fee_amount),
        float(token1_fee_amount),
    )

class FlowInt:
    '''
    Fixed-width signed or unsigned integers, integers that explicitly under- or over-flow
    according to a particular number of bits. Abstract class that is sub-typed in this
    module.
    '''
    
    def __init__(self, num, is_signed=False, num_bits=8):
        '''
        Initialize the class with a value that can be converted to a signed or unsigned integer
        with the top-level int() call, and also a particular bit size.
        :param num: Integer value
        :param is_signed: Is this object a signed integer, or an unsiged integer with twice
        the range only on the positive side? Defaults to False for a traditional unsigned byte.
        :param num_bits: Number of bits for this signed or unsigned integer. Defaults to 8 for a
        traditional unsigned byte.
        '''
        self.num = int(num)
        self.is_signed = is_signed
        self.num_bits = num_bits

        self.two_pow = 2 ** num_bits
        self.min_signed_neg, self.max_signed_pos = -self.two_pow // 2, (self.two_pow // 2) - 1
        if self.is_signed:
            assert self.num in range(self.min_signed_neg, self.max_signed_pos + 1), f"Value {self.num} out-of-range for signed {num_bits:,d} bits"
        else:
            assert self.num in range(self.two_pow), f"Value {self.num} out-of-range for unsigned {num_bits:,d} bits"
        self.mask = self.two_pow - 1  # 0xFFF... or 0b111...

    def __format__(self, *fmt_args):
        '''
        Just use the underlying Python int()'s formatting.
        '''
        return self.num.__format__(*fmt_args)


class UFlow(FlowInt):
    """
    Fixed-width unsigned integers, an integer that explicitly under- or over-flows
    according to a particular number of bits.
    """

    def __init__(self, num, num_bits=8):
        super().__init__(num, is_signed=False, num_bits=num_bits)

    def __repr__(self):
        return f"uflow{self.num}"
   
    def __add__(self, o):
        result = self.num + o.num
        return self.__class__(result & self.mask, num_bits=self.num_bits)

    def __sub__(self, o):
        result = self.num - o.num
        return self.__class__(result & self.mask, num_bits=self.num_bits)
    
    def __mul__(self, o):
        result = self.num * o.num
        return self.__class__(result & self.mask, num_bits=self.num_bits)
    
    def __truediv__(self, o):
        result = self.num // o.num
        return self.__class__(result & self.mask, num_bits=self.num_bits)
    