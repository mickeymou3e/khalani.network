from typing import List
from mcp.server.fastmcp import FastMCP
import httpx
import toml
import asyncio
import random
import json
from intent_types import hash_intent

mcp = FastMCP("medusa-mcp-demo")

try:
    config = toml.load("config.toml")
    medusa_url = config.get("medusa_server_url")
    if not medusa_url:
        print("Warning: Medusa URL not found in config.toml")
        medusa_url = "http://localhost:8001"  
except Exception as e:
    print(f"Error loading config.toml: {e}")
    medusa_url = "http://localhost:8001"  

lock = asyncio.Lock()
id = 1

def canonicalize_chain_name(chain_name: str) -> str:
    """
    Canonicalize the chain name to lowercase.
    """
    chain_name = chain_name.lower()
    if chain_name == "avalanche":
        return "avax"
    if chain_name == "optimism":
        return "optimism"
    if chain_name == "arb":
        return "arbitrum"
    return chain_name

@mcp.tool()
async def list_supported_chains() -> List[str]:
    """
    List all supported chains.  
    """
    return list(config["chains"].keys())

@mcp.tool()
async def get_nonce(address: str) -> int:
    """Get the nonce for a user address."""
    headers = {
        "Content-Type": "application/json",
    }
    global id
    payload = {
        "jsonrpc": "2.0",
        "method": "getNonce",
        "params": {
            "user": address
        },
        "id": id
    }
    async with lock:
        id += 1

    async with httpx.AsyncClient() as client:
        response = await client.post(medusa_url, headers=headers, json=payload, timeout=30.0)
        response.raise_for_status()
        result = response.json()["result"]
        return int(result, 16) + 1
    
def gen_refinement_request(token_name: str, src_amount: int, src_chain_name: str, dst_chain_name: str):
    """
    Generate a refinement request after validating Ethereum addresses.
    
    Args:
        token_name: The name of the token
        src_amount: Amount for bridging
        src_chain_name: The name of the source chain
        dst_chain_name: The name of the destination chain
        
    Returns:
        Dictionary containing the refinement
    """
    src_chain_name = canonicalize_chain_name(src_chain_name)
    dst_chain_name = canonicalize_chain_name(dst_chain_name)
    src_token = config["tokens"][src_chain_name][token_name]["mtoken_address"]
    dst_token = config["tokens"][dst_chain_name][token_name]["mtoken_address"]
    return {
        "author": "0x0000000000000000000000000000000000000000",
        "ttl": random.randint(1000, 10000),
        "nonce": random.randint(1, 10000000000),
        "srcMToken": src_token,
        "srcAmount": src_amount,
        "outcome": {
            "mTokens": [dst_token],
            "mAmounts": [0],
            "outcomeAssetStructure": "AnySingle",
            "fillStructure": "Exact"
        }
    }


@mcp.tool()
async def create_refinement(token_name: str, src_amount: float, src_chain_name: str, dst_chain_name: str):
    """Make a request to the Medusa API to generate a refinement. Returns the refinement id. 
    
    Args:
        token_name: The name of the token in lowercase
        src_amount: Amount for bridging
        src_chain_name: The name of the source chain in lowercase
        dst_chain_name: The name of the destination chain in lowercase
        
    Returns:
        The refinement id if successful, None otherwise
    """
    token_name = token_name.lower()
    src_chain_name = canonicalize_chain_name(src_chain_name)
    dst_chain_name = canonicalize_chain_name(dst_chain_name)
    big_int_amount = int(src_amount * 10**18)
    refinement = gen_refinement_request(token_name, big_int_amount, src_chain_name, dst_chain_name)
    headers = {
        "Content-Type": "application/json",
    }
    global id
    payload = {
        "jsonrpc": "2.0",
        "method": "createRefinement",
        "params": {
            "intent": refinement
        },
        "id": id
    }
    async with lock:
        id += 1
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(medusa_url, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            return response.json()["result"]
        except Exception:
            return None
        
@mcp.tool()
async def check_refinement_status(refinement_id: str):
    """Check the status of a refinement.
    
    Args:
        refinement_id: The id of the refinement
        
    Returns:
        "RefinementNotFound" if the refinement is not found, meaning the bridge cannot be fulfilled immediately,
        "None" if the refinement is still pending, 
        The refinement json object if the refinement is filled,
        None if an error occurs
    """
    headers = {
        "Content-Type": "application/json",
    }
    global id
    payload = {
        "jsonrpc": "2.0",
        "method": "queryRefinement",
        "params": {
            "intent_id": refinement_id
        },
        "id": id
    }
    async with lock:
        id += 1
    async with httpx.AsyncClient() as client:
        response = await client.post(medusa_url, headers=headers, json=payload, timeout=30.0)
        response.raise_for_status()
        result_json = response.json()
        if "result" in result_json:
            ref = result_json["result"]["Refinement"]
            ref["ttl"] = int(ref["ttl"], 16)
            ref["nonce"] = int(ref["nonce"], 16)
            ref["srcAmount"] = int(ref["srcAmount"], 16)
            ref["outcome"]["mAmounts"] = [int(m_amount, 16) for m_amount in ref["outcome"]["mAmounts"]]
            return ref
        else:
            return None
        

# @mcp.tool()
# async def create_and_check_refinement(author: str, src_token: str, src_amount: float, dst_token: str, timeout: int):
#     """Create a refinement and keep polling its status, until a filled refinement or `RefinementNotFound` is returned, or the timeout is reached.
    
#     Args:
#         author: The author's Ethereum address
#         src_token: Source token Ethereum address
#         src_amount: Amount of source tokens
#         dst_token: Destination token Ethereum address
#         timeout: Timeout in seconds
        
#     Returns:
#         a generator that yields
#             - The refinement json object if the refinement is filled,
#             - "RefinementNotFound" if the refinement is not found, meaning the bridge cannot be fulfilled immediately,
#             - None if the refinement is still pending,
#             - "Timeout" if the timeout is reached
#     """
#     refinement = await create_refinement(author, src_token, src_amount, dst_token)
#     start_time = time.time()
#     while time.time() - start_time < timeout:
#         refinement = await check_refinement_status(refinement)
#         if refinement == "None":
#             yield None
#             await asyncio.sleep(2)
#         else:
#             yield refinement
#             return
#     yield "Timeout"
#     return

@mcp.tool()
async def gen_bridge_intent(token_name: str, src_amount: int, src_chain_name: str, dst_chain_name: str):
    """
    Generate a bridge intent to bridge `src_amount` of `token_name` from `src_chain_name` to `dst_chain_name`.
    Args:
        token_name: The name of the token in lowercase
        src_amount: Amount of source tokens
        src_chain_name: The name of the source chain in lowercase
        dst_chain_name: The name of the destination chain in lowercase
        
    Returns:
        A dictionary containing the steps to bridge the tokens.
    """
    token_name = token_name.lower()
    src_chain_name = canonicalize_chain_name(src_chain_name)
    dst_chain_name = canonicalize_chain_name(dst_chain_name)
    return {
        "step1": f"use the mcp tool create_refinement to create a refinement with parameters token_name={token_name}, src_amount={src_amount}, src_chain_name={src_chain_name}, dst_chain_name={dst_chain_name}, which tells you how many tokens you will get on the destination chain. you will get the refinement id as the return value.",
        "step2": "use the mcp tool check_refinement_status to check the status of the refinement id you got in job1, until it is filled or you are told that the refinement cannot be found, or you get a timeout, in the latter two cases, bridge is not possible. abort the process.",
        "step3": "if the refinement is filled, replace the author field with your own address, set ttl to be current timestamp + 300 seconds, and use the mcp tool get_nonce to get a nonce for the intent. the nonce is the return value of the get_nonce tool. set the nonce as the nonce field in the intent.",
        "step4": f"the rpc url of the source chain is {config['chains'][src_chain_name]['rpc_url']}, the asset reserve address is {config['chains'][src_chain_name]['asset_reserve_address']}, the permit2 address is {config['chains'][src_chain_name]['permit2_address']}, the {token_name} token address on {src_chain_name} is {config['tokens'][src_chain_name][token_name]['token_address']}. use these parameters to sign permit2 and call deposit function (in the TS SDK) of the asset reserve contract to deposit the tokens and convert them to mtokens. This cannot be done with the mcp tools. You need to do it with the TS SDK.",
        "step5": f"After step 4 is done, in your app, use your private key and intent book address {config['intent_book_address']}, to generate a eip712 signature for your intent.",
        "step6": "After step 5 is done, use the mcp tool submit_bridge_intent_after_deposit to publish the intent, the tool will return intent_id, which can be used to query the intent status."
    }

@mcp.tool()
async def submit_bridge_intent_after_deposit(intent_data: str, signature: str):
    """Submit a bridge intent.
    
    Args:
        intent_data: The intent data in json format
        signature: The signature in json format
        
    Returns:
        intent_id: The intent id
    """
    intent_data = json.loads(intent_data)
    signature = json.loads(signature)

    headers = {
        "Content-Type": "application/json",
    }
    global id 
    
    intent_id = hash_intent(intent_data)

    signed_intent = {
        "intent": intent_data,
        "signature": signature
    }
    
    payload = {
        "jsonrpc": "2.0",
        "method": "proposeIntent",
        "params": {
            "intent": signed_intent
        },
        "id": id
    }
    async with lock:
        id += 1
    async with httpx.AsyncClient() as client:
        response = await client.post(medusa_url, headers=headers, json=payload, timeout=30.0)
        response.raise_for_status()
        return intent_id

async def test():
    ret = await check_refinement_status("0x9e06253459f9a5e014c3c3009013fc5ef1d16c01d1595442c7f31c208a29beb9")
    print(ret)

if __name__ == "__main__":
    mcp.run(transport='stdio')
    # asyncio.run(test())