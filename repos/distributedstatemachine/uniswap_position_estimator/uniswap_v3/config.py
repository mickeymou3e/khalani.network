# config.py
import os
from web3 import Web3

# Environment settings
RPC_URL = os.environ.get('RPC_URL')
PRIVATE_KEY = os.environ.get('PRIVATE_KEY')
w3 = Web3(Web3.HTTPProvider(f"{RPC_URL}"))

# GraphQL endpoint
GRAPHQL_ENDPOINT = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
