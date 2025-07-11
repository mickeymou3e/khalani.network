import os
import time
import json
import pytest
from web3 import Web3
from typing import Optional
from uniswap_v3.config import GRAPHQL_ENDPOINT, RPC_URL,w3
from uniswap_v3.client import GraphQLClient
from uniswap_v3.utils import dir_path
from uniswap_v3.uniswap_liquidity import (
    deploy_pool,
    add_liquidity,
)
from unittest.mock import patch, Mock

UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
ERC20_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "erc20.json")
POOL_ABI_PATH = os.path.join(os.path.dirname(dir_path), "abi", "pool.json")

def mock_graphql_response(pool_address, token0, token1, fee):
    return {
        "data": {
            "pools": [{
                "feeTier": str(fee),
                "token0": {"id": token0},
                "token1": {"id": token1}
            }]
        }
    }

with open(POOL_ABI_PATH, "r") as file:
    contract_data = json.load(file)
    POOL_ABI = contract_data["abi"]

with open(ERC20_ABI_PATH, "r") as file:
    contract_data = json.load(file)
    ERC20_ABI = contract_data["abi"]


def deploy_mock_token(name: str, symbol: str, supply: float, account: str) -> Optional[str]:
    erc20 = w3.eth.contract(abi=ERC20_ABI, bytecode=contract_data["bytecode"])
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
    print(f"Deployed Token A at address: {mockTokenA}")
    print(f"Deployed Token B at address: {mockTokenB}")
    
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

    # Mock GraphQL response
    response = mock_graphql_response(pool, tokenA, tokenB, 3000)
    mock_client = Mock()
    mock_client.get.return_value = response

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
    print(tx_receipt)
    assert tx_receipt["status"] == 1  # Ensure the transaction was successful
    assert lower_tick == -60_000
    assert upper_tick == 60_000

    token0_contract = w3.eth.contract(abi=ERC20_ABI, address=tokenA)
    token1_contract = w3.eth.contract(abi=ERC20_ABI, address=tokenB)
    token0_amount_pool = token0_contract.functions.balanceOf(pool).call()
    token1_amount_pool = token1_contract.functions.balanceOf(pool).call()

    assert token0_amount_pool == token0_amount
    assert token1_amount_pool == token1_amount



    

    
    
