import os
import time
import json
import pytest
from web3 import Web3
from web3._utils.events import EventLogErrorFlags
from typing import Optional
from uniswap_v3.config import GRAPHQL_ENDPOINT, RPC_URL,w3
from uniswap_v3.client import GraphQLClient
from uniswap_v3.utils import dir_path
from uniswap_v3.uniswap_liquidity import (
    deploy_pool,
    add_liquidity,
    remove_liquidity,
    NON_FUNGIBLE_POSITION_MANAGER,
    POSITION_ABI,
    POOL_ABI,
)
from unittest.mock import patch, Mock

UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
ERC20_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "erc20.json")
POOL_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "pool.json")


def get_bytecode_as_text_from_file_name(bytecode_file_name: str) -> str:
    # Start by finding the directory of the current script
    script_dir = os.path.dirname(os.path.realpath(__file__))

    # Go up one directory from the script directory
    project_root = os.path.dirname(script_dir)

    # Construct the path to the 'bytecode' directory relative to the project root
    bytecode_dir = os.path.join(project_root, 'bytecode')

    # Now construct the full path to the bytecode file
    bytecode_file_path = os.path.join(bytecode_dir, bytecode_file_name)

    # Read the file and return its content
    try:
        with open(bytecode_file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"File not found: {bytecode_file_path}")
        return ""

erc20_bytecode = get_bytecode_as_text_from_file_name("erc20_bytecode.txt")


with open(ERC20_ABI_PATH, "r") as file:
    ERC20_ABI = json.load(file)





def deploy_mock_token(name: str, symbol: str, supply: float, account: str) -> Optional[str]:
    erc20 = w3.eth.contract(abi=ERC20_ABI, bytecode=erc20_bytecode)
    tx_hash = erc20.constructor(name, symbol, supply).transact({'from': account})
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt['contractAddress']


@pytest.fixture(scope="module")
def account() -> str:
    return w3.eth.accounts[0]

@pytest.fixture(scope="module")
def mockTokenA(account: str) -> Optional[str]:
    return deploy_mock_token("Mock Token A", "MTA", int(1_000_000e18), account)

@pytest.fixture(scope="module")
def mockTokenB(account: str) -> str:
    return deploy_mock_token("Mock Token B", "MTB", int(1_000_000e18), account)



def test_deploy_pool(mockTokenA, mockTokenB):    
    # Determine the expected order of token0 and token1
    expected_token0, expected_token1 = sorted([mockTokenA, mockTokenB])

    with pytest.raises(AssertionError) as e:
        deploy_pool(UNISWAP_V3_FACTORY_ADDRESS, mockTokenA, mockTokenB, 10)
    assert str(e.value) == "Invalid fee , UniswapV3 supports only allows 4 fee levels: 100, 500, 3000, 10000"
    
    pool = deploy_pool(UNISWAP_V3_FACTORY_ADDRESS, mockTokenA, mockTokenB, 3000)
    pool_contract = w3.eth.contract(abi=POOL_ABI, address=pool)
    assert pool_contract.functions.token0().call() == expected_token0
    assert pool_contract.functions.token1().call() == expected_token1




def test_add_liquidity(account):
    # Deploy new pool
    tokenA = deploy_mock_token("TokenA", "TKA", int(1_000_000e18), account)
    tokenB = deploy_mock_token("TokenB", "TKB", int(1_000_000e18), account)
    pool = deploy_pool(UNISWAP_V3_FACTORY_ADDRESS, tokenA, tokenB, 3000)

    # Define amount of tokens to add to the pool
    token0_amount = 1000 * 10**18  # considering token decimals as 18
    token1_amount = 1000 * 10**18  # considering token decimals as 18
    # Add liquidity
    tx_receipt, lower_tick, upper_tick = add_liquidity(
        pool,
        token0_amount,
        token1_amount,
        -60_000,  # example tick values; adjust as needed
        60_000
    )
    assert tx_receipt["status"] == 1  # Ensure the transaction was successful
    assert lower_tick == -60_000
    assert upper_tick == 60_000

    token0_contract = w3.eth.contract(abi=ERC20_ABI, address=tokenA)
    token1_contract = w3.eth.contract(abi=ERC20_ABI, address=tokenB)
    token0_amount_pool = token0_contract.functions.balanceOf(pool).call()
    token1_amount_pool = token1_contract.functions.balanceOf(pool).call()

    assert token0_amount_pool == token0_amount
    assert token1_amount_pool == token1_amount


def test_createpool_increase_decrease_liquidity(account):
    # Deploy new pool
    token0 = deploy_mock_token("Token0", "TK0", int(1_000_000e18), account)
    token1 = deploy_mock_token("Token1", "TK1", int(1_000_000e18), account)
    pool = deploy_pool(UNISWAP_V3_FACTORY_ADDRESS, token0, token1, 3000)

    # Define amount of tokens to add to the pool
    token0_amount = 1000 * 10**18  # considering token decimals as 18
    token1_amount = 1000 * 10**18  # considering token decimals as 18
    # Add liquidity
    tx_receipt, _, _ = add_liquidity(
        pool,
        token0_amount,
        token1_amount,
        -60_000,  # example tick values; adjust as needed
        60_000
    )

    position_manager_contract = w3.eth.contract(
        address=NON_FUNGIBLE_POSITION_MANAGER, abi=POSITION_ABI
    )

    increase_event = position_manager_contract.events.IncreaseLiquidity().process_receipt(tx_receipt, EventLogErrorFlags.Discard)
    token_id = increase_event[0].args.tokenId

    *_, liquidity, _, _, _, _ = position_manager_contract.functions.positions(token_id).call()

    # decrease liquidity
    decrease_amount = int(liquidity/5)

    tx_receipt = remove_liquidity(token_id, decrease_amount)

    *_, new_liquidity, _, _, _, _ = position_manager_contract.functions.positions(token_id).call()

    assert new_liquidity == liquidity - decrease_amount

    decrease_event = position_manager_contract.events.DecreaseLiquidity().process_receipt(tx_receipt, EventLogErrorFlags.Discard)
    liquidity_reduction_amount = decrease_event[0].args.liquidity
    token0_received = decrease_event[0].args.amount0
    token1_received = decrease_event[0].args.amount1
    assert liquidity_reduction_amount == decrease_amount
    assert token0_received > 0 or token1_received > 0

    *_, token0_owed, token1_owed = position_manager_contract.functions.positions(token_id).call()
    assert token0_owed == token0_received
    assert token1_owed == token1_received
    


    

    
    
