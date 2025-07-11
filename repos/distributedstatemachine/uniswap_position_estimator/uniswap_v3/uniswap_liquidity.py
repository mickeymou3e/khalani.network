import os
import json
import math

from typing import Tuple, Dict, Optional
from uniswap_v3.client import GraphQLClient
from uniswap_v3.utils import load_graphql_query, dir_path
from uniswap_v3.config import PRIVATE_KEY, w3
from uniswap_v3.uniswap_position_utils import (
    uniswap_v3_position_state,
    UniswapV3PositionState,
)


private_key = os.environ.get("PRIVATE_KEY")
dir_path = os.path.dirname(os.path.realpath(__file__))

IERC20_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "IERC20_minimal.json")
POSITION_MANAGER_ABI_PATH = os.path.join(
    os.path.dirname(dir_path), "abi", "position_manager.json"
)
FACTORY_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "factory.json")
POOL_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "pool.json")
MIN_TICK = -887272
MAX_TICK = -MIN_TICK
FOREVER_DEADLINE = 2**63
ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
NON_FUNGIBLE_POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"

with open(IERC20_ABI_PATH, "r") as file:
    contract_data = json.load(file)
    IER20_ABI = contract_data["abi"]

with open(POSITION_MANAGER_ABI_PATH, "r") as file:
    POSITION_ABI = json.load(file)

with open(FACTORY_ABI_PATH, "r") as file:
    FACTORY_ABI = json.load(file)

with open(POOL_ABI_PATH, "r") as file:
    POOL_ABI = json.load(file)


DEFAULT_TICK_SPACINGS = {
    # 100 bps fee level wasn't defined in factory contract, but was added later by UNI governance
    # https://etherscan.io/tx/0x5c84f89a67237db7500538b81af61ebd827c081302dd73a1c20c8f6efaaf4f3c#eventlog
    100: 1,
    # 3 default tick spacings as defined in v3 factory contract:
    # https://github.com/Uniswap/v3-core/blob/v1.0.0/contracts/UniswapV3Factory.sol#L26-L31
    500: 10,
    3_000: 60,
    10_000: 200,
}

DEFAULT_FEES = list(DEFAULT_TICK_SPACINGS.keys())


def get_min_tick(fee: int) -> int:
    tick_spacing: int = DEFAULT_TICK_SPACINGS[fee]
    return math.ceil(MIN_TICK / tick_spacing) * tick_spacing


def get_max_tick(fee: int) -> int:
    tick_spacing: int = DEFAULT_TICK_SPACINGS[fee]
    return math.floor(MAX_TICK / tick_spacing) * tick_spacing


def get_default_range_tick(fee: int) -> tuple[int, int]:
    min_tick = get_min_tick(fee)
    max_tick = get_max_tick(fee)
    return min_tick, max_tick


def get_nearest_usable_tick(tick: int, fee: int):
    min_tick, max_tick = get_default_range_tick(fee)
    assert min_tick <= tick <= max_tick
    tick_spacing = DEFAULT_TICK_SPACINGS[fee]
    rounded = round(tick / tick_spacing) * tick_spacing

    if rounded < min_tick:
        return rounded + tick_spacing
    elif rounded > max_tick:
        return rounded - tick_spacing
    else:
        return rounded


def check_balances(account_address, token0_address, token1_address, amount0, amount1):
    token0 = w3.eth.contract(token0_address, abi=IER20_ABI)
    token1 = w3.eth.contract(token1_address, abi=IER20_ABI)

    balance_token0 = token0.functions.balanceOf(account_address).call()
    balance_token1 = token1.functions.balanceOf(account_address).call()

    if balance_token0 < amount0:
        raise ValueError(
            f"Insufficient balance of token0: required {amount0}, available {balance_token0}"
        )
    if balance_token1 < amount1:
        raise ValueError(
            f"Insufficient balance of token1: required {amount1}, available {balance_token1}"
        )


def approve_tokens(
    position_manager, account_address, token0_address, token1_address, amount0, amount1
):
    token0 = w3.eth.contract(address=token0_address, abi=IER20_ABI)
    token1 = w3.eth.contract(address=token1_address, abi=IER20_ABI)

    position_manager = w3.to_checksum_address(position_manager)

    token0.functions.approve(position_manager, amount0).transact(
        {"from": account_address}
    )
    token1.functions.approve(position_manager, amount1).transact(
        {"from": account_address}
    )


def encode_sqrt_ratio_x96(*, amount0: int, amount1: int) -> int:
    """Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0

    :param int amount0: the denominator amount, i.e amount of token0
    :param int amount1: the numerator amount, i.e. amount of token1
    :return: the sqrt ratio

    `Lifted from StakeWise Oracle (AGPL license) <https://github.com/stakewise/oracle/blob/master/oracle/oracle/distributor/uniswap_v3.py#L547>`__.
    """
    numerator: int = amount1 << 192
    denominator: int = amount0
    ratio_x192: int = numerator // denominator
    return int(math.sqrt(ratio_x192))


def deploy_pool(
    factory: str,
    token0: str,
    token1: str,
    fee: int,
) -> Optional[str]:
    assert token0 != token1
    assert (
        fee in DEFAULT_FEES
    ), f"Invalid fee , UniswapV3 supports only allows {len(DEFAULT_FEES)} fee levels: {', '.join(map(str, DEFAULT_FEES))}"
    factory_address = w3.to_checksum_address(factory)
    factory_contract = w3.eth.contract(factory_address, abi=FACTORY_ABI)
    account = w3.eth.account.from_key(private_key)
    token0_address = w3.to_checksum_address(token0)
    token1_address = w3.to_checksum_address(token1)
    tx_hash = factory_contract.functions.createPool(
        token0_address, token1_address, fee
    ).transact({"from": account.address, "gas": 5_000_000})
    try:
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        if tx_receipt["status"] != 1:
            raise Exception("Transaction failed")
    except Exception as e:
        print(e)
        print("Pool already exists")
        return None
    decoded_logs = factory_contract.events.PoolCreated().process_receipt(tx_receipt)
    pool_address = decoded_logs[0]["args"]["pool"]
    return str(pool_address)


def add_liquidity(
    pool_address: str, amount0: int, amount1: int, lower_tick: int, upper_tick: int
) -> tuple[Dict, int, int]:
    """Add liquidity to a Uniswap V3 pool.

    Args:
        pool_address (str): The address of the pool.
        amount0 (int): The amount of token0 to add.
        amount1 (int): The amount of token1 to add.
        lower_tick (int): The lower tick of the range in which to add liquidity.
        upper_tick (int): The upper tick of the range in which to add liquidity.

    Returns:
        Tuple[Dict, int, int]: A tuple containing the transaction receipt,
        and the adjusted lower and upper ticks.
    """

    account_address = w3.eth.account.from_key(PRIVATE_KEY).address
    pool_contract = w3.eth.contract(abi=POOL_ABI, address=pool_address)
    token0_address = pool_contract.functions.token0().call()
    token1_address = pool_contract.functions.token1().call()
    fee = pool_contract.functions.fee().call()
    check_balances(account_address, token0_address, token1_address, amount0, amount1)

    lower_tick = get_nearest_usable_tick(lower_tick, fee)
    upper_tick = get_nearest_usable_tick(upper_tick, fee)

    assert lower_tick < upper_tick, "Upper tick is too close to lower tick"

    *_, initialized = pool_contract.functions.slot0().call()
    if initialized is False:
        sqrt_price_x96 = encode_sqrt_ratio_x96(amount0=amount0, amount1=amount1)
        pool_contract.functions.initialize(sqrt_price_x96).transact(
            {"from": account_address}
        )

    # approve_tokens
    approve_tokens(
        NON_FUNGIBLE_POSITION_MANAGER,
        account_address,
        token0_address,
        token1_address,
        amount0,
        amount1,
    )

    # mint_params
    mint_params = (
        token0_address,  # token0
        token1_address,  # token1
        fee,  # fee
        lower_tick,  # tickLower
        upper_tick,  # tickUpper
        amount0,  # amount0Desired
        amount1,  # amount1Desired
        0,  # amount0Min
        0,  # amount1Min
        account_address,  # recipient
        FOREVER_DEADLINE,  # deadline
    )

    # mint_tokens
    position_manager_contract = w3.eth.contract(
        address=NON_FUNGIBLE_POSITION_MANAGER, abi=POSITION_ABI
    )
    tx_hash = position_manager_contract.functions.mint(mint_params).transact(
        {"from": account_address}
    )

    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt, lower_tick, upper_tick


def remove_liquidity(
    position_id: int,
    liquidity_decrease_amount: int,
    amount0_min: int = 0,
    amount1_min: int = 0,
):
    account_address = w3.eth.account.from_key(PRIVATE_KEY).address
    position_manager_contract = w3.eth.contract(
        address=NON_FUNGIBLE_POSITION_MANAGER, abi=POSITION_ABI
    )
    *_, liquidity, _, _, _, _ = position_manager_contract.functions.positions(position_id).call()
    assert liquidity >= liquidity_decrease_amount, "Insufficient liquidity"
    tx_hash = position_manager_contract.functions.decreaseLiquidity(
        (
            position_id,
            liquidity_decrease_amount,
            amount0_min,
            amount1_min,
            FOREVER_DEADLINE,
        )
    ).transact({"from": account_address})
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt


def adjust_ticks(lower_tick, upper_tick, fee):
    lower_tick = get_nearest_usable_tick(lower_tick, fee)
    upper_tick = get_nearest_usable_tick(upper_tick, fee)
    if lower_tick >= upper_tick:
        raise ValueError("Upper tick is too close to or lower than lower tick")
    return lower_tick, upper_tick
