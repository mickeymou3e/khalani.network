import os
import json
import requests
from typing import Tuple, NamedTuple
from web3 import Web3
from datetime import datetime

w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/d1d1124a4f484e58ab1ce50fb5a89a4c'))

class UniswapV3NFT(NamedTuple):
    block_time: str
    current_block_number: int
    nft_addresses: Tuple[str, ...]

def load_graphql_query(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read()

def uniswap_v3_nfts(
    wallet_address: str,
    endpoint: str = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
) -> UniswapV3NFT:
    # Load GraphQL query from file
    query_path = os.path.join(os.getcwd(), 'queries', 'nft_positions_query.graphql')
    query = load_graphql_query(query_path)

    # Define variables for the GraphQL query
    variables = {'owner': wallet_address}

    # Execute GraphQL query
    response = requests.post(endpoint, json={'query': query, 'variables': variables})
    if response.status_code != 200:
        raise Exception(f"GraphQL query failed with status {response.status_code}: {response.content.decode()}")

    data = response.json()['data']

    if not data:
        raise Exception("No data found in the GraphQL response")

    positions = data.get('positions')

    if not positions:
        raise Exception("No positions found for the given wallet address")

    # Extract necessary information from the data (Adjust field names based on your actual query)
    block = w3.eth.get_block('latest')
    block_time = datetime.utcfromtimestamp(block.timestamp).strftime('%Y-%m-%dT%H:%M:%SZ')
    current_block_number = w3.eth.block_number
    nft_addresses = tuple(position for position in data['positions'])

    return UniswapV3NFT(block_time, current_block_number, nft_addresses)

if __name__ == "__main__":
    wallet_address = '0x50ec05ade8280758e2077fcbc08d878d4aef79c3'
    result = uniswap_v3_nfts(wallet_address)
    result_dict = result._asdict()
    pretty_json = json.dumps(result_dict, indent=4)
    print(pretty_json)
