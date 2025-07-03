import json
import os
from pathlib import Path

def checksum_address(address):
    from eth_utils import to_checksum_address
    return to_checksum_address(address)

def get_hub_contract_addresses():
    project_root = Path(os.getcwd())
    core_broadcast_path = project_root / "external" / "arcadia-core-contracts" / "broadcast" / "HubDeployCoreProtocol.s.sol" / "31337" / "run-latest.json"
    bridge_broadcast_path = project_root / "external" / "arcadia-core-contracts" / "broadcast" / "HubDeployHyperFlowBridge.s.sol" / "31337" / "run-latest.json"
    
    if not core_broadcast_path.exists():
        raise FileNotFoundError(f"Core broadcast file not found at {core_broadcast_path}")
    
    if not bridge_broadcast_path.exists():
        raise FileNotFoundError(f"Bridge broadcast file not found at {bridge_broadcast_path}")
    
    with open(core_broadcast_path, 'r') as file:
        core_broadcast_data = json.load(file)
    
    with open(bridge_broadcast_path, 'r') as file:
        bridge_broadcast_data = json.load(file)
    
    hub_contract_addresses = {}
    for tx in core_broadcast_data.get("transactions", []):
        if tx.get("transactionType") == "CREATE" and tx.get("contractName") == "MTokenManager":
            hub_contract_addresses["m_token_manager_address"] = checksum_address(tx.get("contractAddress"))
        elif tx.get("transactionType") == "CREATE" and tx.get("contractName") == "IntentBook":
            hub_contract_addresses["intent_book_address"] = checksum_address(tx.get("contractAddress"))
        elif tx.get("transactionType") == "CREATE" and tx.get("contractName") == "ReceiptManager":
            hub_contract_addresses["receipt_manager_address"] = checksum_address(tx.get("contractAddress"))
        elif tx.get("transactionType") == "CREATE" and tx.get("contractName") == "HubPublisher":
            hub_contract_addresses["hub_publisher_address"] = checksum_address(tx.get("contractAddress"))
        elif tx.get("transactionType") == "CREATE" and tx.get("contractName") == "HubHandler":
            hub_contract_addresses["hub_handler_address"] = checksum_address(tx.get("contractAddress"))
        elif tx.get("transactionType") == "CREATE" and tx.get("contractName") == "MockInterchainGasPaymaster":
            hub_contract_addresses["igp_address"] = checksum_address(tx.get("contractAddress"))
    
    # Get MTokenCrossChainAdapter from HubDeployHyperFlowBridge
    for tx in bridge_broadcast_data.get("transactions", []):
        if tx.get("transactionType") == "CREATE" and tx.get("contractName") == "MTokenCrossChainAdapter":
            hub_contract_addresses["m_token_cross_chain_adapter_address"] = checksum_address(tx.get("contractAddress"))
    
    if len(hub_contract_addresses) != 7:
        raise ValueError("Not all required hub contracts found in broadcast files")
    
    return hub_contract_addresses

def get_spoke_token_address(i):

    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    file_path = f"external/arcadia-core-contracts/broadcast/DeploySpokeToken.s.sol/{i}/run-latest.json"
    
    try:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return None
            
        with open(file_path, 'r') as file:
            data = json.load(file)
            
        # Go through all transactions to find the CustomERC20 contract
        for transaction in data.get('transactions', []):
            if (transaction.get('transactionType') == 'CREATE' and
                transaction.get('contractName') == 'CustomERC20' and
                transaction.get('contractAddress')):
                return transaction['contractAddress']
        
        # If we didn't find it in the loop
        print(f"No CustomERC20 contract deployment found in {file_path}")
        return None
            
    except Exception as e:
        print(f"Error reading token address from {file_path}: {str(e)}")
        return None

def get_asset_reserve_address(chain_id):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    project_root = Path(os.getcwd())
    broadcast_path = project_root / "external" / "arcadia-core-contracts" / "broadcast" / "SpokeDeployHyperFlowBridge.s.sol" / str(chain_id) / "run-latest.json"
    
    if not broadcast_path.exists():
        raise FileNotFoundError(f"Broadcast file not found at {broadcast_path}")
    
    with open(broadcast_path, 'r') as file:
        broadcast_data = json.load(file)
    
    for _, tx in enumerate(broadcast_data.get("transactions", [])):
        if tx.get("contractName") == "AssetReserves":
            return checksum_address(tx.get("contractAddress"))
    
    raise ValueError(f"AssetReserves contract not found in broadcast file for chain ID {chain_id}")



def get_mtoken_address(chain_id):
    spoke_token_address = get_spoke_token_address(chain_id)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    project_root = Path(os.getcwd())
    broadcast_path = project_root / "external" / "arcadia-core-contracts" / "broadcast" / "AddMTokenToHub.s.sol" / "31337" 
    
    if not broadcast_path.exists():
        raise FileNotFoundError(f"Broadcast path not found at {broadcast_path}")
    
    json_files = [f for f in broadcast_path.glob("*.json") if f.name != "run-latest.json"]
    
    if not json_files:
        raise FileNotFoundError(f"No JSON files found in {broadcast_path}")
    
    mtoken_address = None
    
    for json_file in json_files:
        try:
            with open(json_file, 'r') as file:
                data = json.load(file)
            
            for tx in data.get("transactions", []):
                if (tx.get("transactionType") == "CALL" and 
                    tx.get("function") == "createMToken(string,string,address,uint32)" and 
                    tx.get("arguments")[3] == str(chain_id) and
                    tx.get("arguments")[2].lower() == spoke_token_address.lower()):
                    
                    for receipt in data.get("receipts", []):
                        if receipt.get("logs"):
                            for log in receipt.get("logs", []):
                                mtoken_address = log.get("address")
                                return checksum_address(mtoken_address)
        except Exception as e:
            print(f"Error processing {json_file}: {str(e)}")
            continue
    
    if not mtoken_address:
        raise ValueError(f"MToken address not found for spoke token {spoke_token_address}")

def get_spoke_igp_address(i):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    project_root = Path(os.getcwd())
    broadcast_path = project_root / "external" / "arcadia-core-contracts" / "broadcast" / "SpokeDeployCoreProtocol.s.sol" / str(i) / "run-latest.json"
    
    if not broadcast_path.exists():
        raise FileNotFoundError(f"Broadcast file not found at {broadcast_path}")
    
    with open(broadcast_path, 'r') as file:
        broadcast_data = json.load(file)
    
    for tx in broadcast_data.get("transactions", []):
        if tx.get("transactionType") == "CREATE" and tx.get("contractName") == "MockInterchainGasPaymaster":
            return checksum_address(tx.get("contractAddress"))
    
    raise ValueError(f"MockInterchainGasPaymaster contract not found in broadcast file for chain ID {i}")

def get_permit2_address(i):
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        run_path = Path(f"external/permit2/broadcast/DeployPermit2.s.sol/{i}/run-latest.json")
        
        if not run_path.exists():
            print(f"Warning: No run-latest.json found for chain {i} at {run_path}")
            return None
        
        with open(run_path, 'r') as file:
            data = json.load(file)
            
        if 'returns' in data:
            for _, ret in data['returns'].items():
                if isinstance(ret, dict) and 'value' in ret:
                    return ret['value']
            print(f"Warning: No contractAddress found in transactions for chain {i}")
            return None
        else:
            print(f"Warning: No transactions found in run-latest.json for chain {i}")
            return None
            
    except Exception as e:
        print(f"Error fetching permit2 address for chain {i}: {str(e)}")
        return None

def get_hub_igp_address():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    project_root = Path(os.getcwd())
    broadcast_path = project_root / "external" / "arcadia-core-contracts" / "broadcast" / "HubDeployCoreProtocol.s.sol" / "31337" / "run-latest.json"
    
    if not broadcast_path.exists():
        raise FileNotFoundError(f"Broadcast file not found at {broadcast_path}")
    
    with open(broadcast_path, 'r') as file:
        broadcast_data = json.load(file)
    
    for tx in broadcast_data.get("transactions", []):
        if tx.get("transactionType") == "CREATE" and tx.get("contractName") == "MockInterchainGasPaymaster":
            return checksum_address(tx.get("contractAddress"))
    
    raise ValueError(f"MockInterchainGasPaymaster contract not found in broadcast file for hub chain")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python utils.py <function_name> <argument>")
        sys.exit(1)
    
    func_name = sys.argv[1]
    arg = sys.argv[2]
    
    if func_name == "get_spoke_token_address":
        try:
            result = get_spoke_token_address(int(arg))
            print(result)
        except ValueError:
            print(f"Error: Argument '{arg}' must be an integer for get_spoke_token_address function")
    else:
        print(f"Error: Unknown function '{func_name}'")