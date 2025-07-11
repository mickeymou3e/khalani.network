from uniswap_position.uniswap_position_utils import uniswap_v3_nfts
from uniswap_position.client import GraphQLClient
import os
from web3 import Web3

rpc_url = "https://mainnet.infura.io/v3/d1d1124a4f484e58ab1ce50fb5a89a4c"

# Constants and setup
RPC_URL = os.environ.get("RPC_URL")
print(f"RPC_URL: {RPC_URL}")  # Add this line
w3 = Web3(Web3.HTTPProvider(rpc_url))

# Define the wallet address
wallet_address = "0x50ec05ade8280758e2077fcbc08d878d4aef79c3"

# Create a GraphQLClient instance
client = GraphQLClient("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3")

# Call the function
result = uniswap_v3_nfts(wallet_address, client)

# Print the result
print(result)