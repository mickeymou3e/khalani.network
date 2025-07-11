import json
from uniswap_v3.config import GRAPHQL_ENDPOINT
from uniswap_v3.client import GraphQLClient
from decimal import Decimal

from uniswap_v3.uniswap_position_utils import (
    uniswap_v3_nfts,
    calculate_fees,
    uniswap_v3_position_state,
    UniswapV3NFT,
    UniswapV3PositionState,
)

def test_uniswap_v3_nft():
    wallet_address = "0x50ec05ade8280758e2077fcbc08d878d4aef79c3"
    client = GraphQLClient(GRAPHQL_ENDPOINT)
    response = uniswap_v3_nfts(wallet_address, client)

    assert isinstance(response, UniswapV3NFT)
    assert response.block_time
    assert isinstance(response.current_block_number, int)

    nft_addresses = response.nft_addresses
    assert nft_addresses
    assert len(nft_addresses) == 4

    expected_keys = {
        "id",
        "liquidity",
        "pool",
        "tickLower",
        "tickUpper",
        "depositedToken0",
        "depositedToken1",
        "withdrawnToken0",
        "withdrawnToken1",
        "collectedFeesToken0",
        "collectedFeesToken1",
        "feeGrowthInside0LastX128",
        "feeGrowthInside1LastX128",
        "token0",
        "token1",
    }

    for nft in nft_addresses:
        assert expected_keys.issubset(nft.keys())
        assert isinstance(nft["id"], str)
        assert isinstance(nft["liquidity"], str)
        assert isinstance(nft["token0"], dict)
        assert isinstance(nft["token1"], dict)

def test_uniswap_v3_position_state():
    client = GraphQLClient(GRAPHQL_ENDPOINT)
    position_id = "2"
    result = uniswap_v3_position_state(position_id, client)

    assert isinstance(result, UniswapV3PositionState)
    assert result.pool_address == "0x6c6bc977e13df9b0de53b251522280bb72383700"
    assert len(result) == 5
