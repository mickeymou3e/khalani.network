import json
import os
from pathlib import Path
from utils import get_spoke_token_address, get_asset_reserve_address, get_mtoken_address, get_hub_contract_addresses, get_permit2_address
 
def write_sdk_config(num_chains):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    project_root = Path(os.getcwd())
    sdk_config_path = project_root / "external" / "khalani-sdk" / "config" / "config.devnet.json"
    
    hub_info = get_hub_contract_addresses()

    if not sdk_config_path.exists():
        print(f"SDK config file not found at {sdk_config_path}")
        import sys
        sys.exit(1)
    
    with open(sdk_config_path, 'r') as file:
        sdk_config = json.load(file)

    sdk_config['contracts']['IntentBook'] = hub_info['intent_book_address']
    sdk_config['contracts']['MTokenManager'] = hub_info['m_token_manager_address'] 
    sdk_config['contracts']['ReceiptManager'] = hub_info['receipt_manager_address']
    sdk_config['contracts']['HubPublisher'] = hub_info['hub_publisher_address']
    sdk_config['contracts']['MTokenCrossChainAdapter'] = hub_info['m_token_cross_chain_adapter_address']
    sdk_config['contracts']['HubHandler'] = hub_info['hub_handler_address']
    sdk_config['contracts']['AssetReserves'] = {}
    sdk_config['contracts']['permit2'] = {}
    with open(sdk_config_path, 'w') as file:
        json.dump(sdk_config, file, indent=4)

    sdk_spoke_token_config_path = project_root / "external" / "khalani-sdk" / "config" / "devnet" / "tokens" / "spoke.tokens.json"
    sdk_hub_token_config_path = project_root / "external" / "khalani-sdk" / "config" / "devnet" / "tokens" / "hub.tokens.json"
    sdk_chain_config_path = project_root / "external" / "khalani-sdk" / "config" / "devnet" / "chains" / "devnet.chains.json"

    with open(sdk_spoke_token_config_path, 'r') as file:
        sdk_spoke_token_config = json.load(file)

    with open(sdk_hub_token_config_path, 'r') as file:
        sdk_hub_token_config = json.load(file)
    
    with open(sdk_chain_config_path, 'r') as file:
        sdk_chain_config = json.load(file)


    sdk_hub_token_config = []
    sdk_spoke_token_config = []
    hub_chain_info = {
    "id": 31337,
    "chainName": "arcadialocal",
    "chainId": "0x7a69",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorerUrls": [],
    "rpcUrls": ["ws://localhost:8545"],
    "logo": "",
    "borderColor": "#808080",
        "poolTokenSymbols": [],
        "isBalancerChain": True
    }
    sdk_chain_config = [hub_chain_info] 


    for i in range(1, num_chains + 1):
        spoke_chain_id = 31338 + i
        spoke_chain_name = f"spokelocal{i}"
        spoke_chain_port = 8546 + i
        token_name = f"tokenspokelocal"
        token_symbol = f"token.{spoke_chain_id}"
        token_address = get_spoke_token_address(spoke_chain_id)
        mtoken_name = f"mtokenspokelocal{i}"
        mtoken_symbol = f"token.{spoke_chain_id}"
        mtoken_address = get_mtoken_address(spoke_chain_id)
        asset_reserve_address = get_asset_reserve_address(spoke_chain_id)
        permit2_address = get_permit2_address(spoke_chain_id)
        print(f"Chain {spoke_chain_id}: AssetReserves: {asset_reserve_address}, SpokeToken: {token_name}({token_address}), MToken: {mtoken_name}({mtoken_address})")
        
        sdk_config['contracts']['AssetReserves'][f"0x{spoke_chain_id:x}"] = asset_reserve_address
        sdk_config['contracts']['permit2'][f"0x{spoke_chain_id:x}"] = permit2_address
        
        with open(sdk_config_path, 'w') as file:
            json.dump(sdk_config, file, indent=4)

        sdk_chain_config.append({
            "id": spoke_chain_id,
            "chainName": spoke_chain_name,
            "chainId": f"0x{spoke_chain_id:04x}",
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "blockExplorerUrls": [],
            "rpcUrls": [f"http://localhost:{spoke_chain_port}"],
            "logo": "",
            "borderColor": "#808080",
            "poolTokenSymbols": [],
            "isBalancerChain": False
        })
        
        sdk_spoke_token_config.append({
            "id": f"0x{spoke_chain_id:04x}:{token_address}",
            "address": token_address,
            "decimals": 18,
            "name": token_name,
            "symbol": token_symbol,
            "chainId": f"0x{spoke_chain_id:04x}"
        })
        
        sdk_hub_token_config.append({
            "id": f"0x{31337:04x}:{mtoken_address}",
            "address": mtoken_address,  
            "decimals": 18,
            "name": mtoken_name,
            "symbol": mtoken_symbol,
            "chainId": f"0x{31337:04x}",
            "sourceChainId": f"0x{spoke_chain_id:04x}"
        })

    with open(sdk_chain_config_path, 'w') as file:
        json.dump(sdk_chain_config, file, indent=4)

    with open(sdk_spoke_token_config_path, 'w') as file:
        json.dump(sdk_spoke_token_config, file, indent=4)

    with open(sdk_hub_token_config_path, 'w') as file:
        json.dump(sdk_hub_token_config, file, indent=4)





if __name__ == "__main__":
    import sys
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir) 
    if len(sys.argv) < 2:
        print("Usage: python update_aip_info.py <number_of_chains>")
        sys.exit(1)
    
    try:
        n = int(sys.argv[1])
        refunder_private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        medusa_api_url = "http://127.0.0.1:8001"
        madusa_ws_url = "ws://127.0.0.1:8002"
        hub_info = get_hub_contract_addresses()
        for key, value in hub_info.items():
            print(f"{key}: {value}")
      
        import toml

        print("\nUpdating arcadia-agents/chain_config.toml...")
        chain_config_path = Path(os.getcwd()) / "external" / "arcadia-agents" / "chain_config.toml"
      
        if not chain_config_path.exists():
            print(f"Chain config file not found at {chain_config_path}")
            sys.exit(1)
        else:
            with open(chain_config_path, 'r') as file:
                chain_config = toml.load(file)
          
            chain_config['mtoken_manager_address'] = hub_info['m_token_manager_address']
            chain_config['arcadia_rpc_url'] = "http://127.0.0.1:8545"
            chain_config['arcadia_chain_id'] = 31337
            chain_config['chains_to_listen'] = []
            chain_config['rpc_urls'] = {}
            chain_config['ws_urls'] = {}
            chain_config['asset_reserves_addresses'] = {}
            import copy
            daemon_chain_config = copy.deepcopy(chain_config)
            daemon_chain_config['arcadia_rpc_url'] = "http://arcadialocal:8545"
            for i in range(1, n + 1):
                chain_id = 31338 + i
                chain_name = f"spokelocal{i}"
                try:
                    asset_reserve_address = get_asset_reserve_address(chain_id)
                    chain_config['chains_to_listen'].append(chain_id)
                    daemon_chain_config['chains_to_listen'].append(chain_id)
                    chain_config['asset_reserves_addresses'][str(chain_id)] = asset_reserve_address
                    daemon_chain_config['asset_reserves_addresses'][str(chain_id)] = asset_reserve_address
                    chain_config['rpc_urls'][str(chain_id)] = f"http://127.0.0.1:{8546 + i}"
                    chain_config['ws_urls'][str(chain_id)] = f"ws://127.0.0.1:{8546 + i}"
                    daemon_chain_config['rpc_urls'][str(chain_id)] = f"http://{chain_name}:{8546 + i}"
                    daemon_chain_config['ws_urls'][str(chain_id)] = f"ws://{chain_name}:{8546 + i}"
                except (FileNotFoundError, ValueError) as e:
                    print(f"Error for Chain ID {chain_id}: {e}")
                    sys.exit(1)

            daemon_chain_config_path = Path(os.getcwd()) / "external" / "arcadia-agents" / "daemon-chain-config.toml"
            with open(daemon_chain_config_path, 'w') as file:
                toml.dump(daemon_chain_config, file)

            with open(chain_config_path, 'w') as file:
                toml.dump(chain_config, file)


        print("\nUpdating arcadia-agents/config.toml...")
        config_path = Path(os.getcwd()) / "external" / "arcadia-agents" / "config.toml"
        daemon_config_path = Path(os.getcwd()) / "external" / "arcadia-agents" / "daemon-config.toml"
        if not config_path.exists():
            print(f"Config file not found at {config_path}")
            sys.exit(1)
          
        with open(config_path, 'r') as file:
            config = toml.load(file)
        config['mode'] = "dev"
        config['dev']['refund_private_key'] = refunder_private_key
        daemon_refunder_config = copy.deepcopy(config)
        daemon_refunder_config['dev']['medusa_api_url'] = "http://medusa-api-server:8001"

        with open(config_path, 'w') as file:
            toml.dump(config, file)

        with open(daemon_config_path, 'w') as file:
            toml.dump(daemon_refunder_config, file)
      
        print("\nUpdating medusa config...")
        # Copy test.config.toml to config.toml
        test_config_path = Path(os.getcwd()) / "external" / "medusa-api-server" / "test.config.toml"
        medusa_config_path = Path(os.getcwd()) / "external" / "medusa-api-server" / "config.toml"
        
        if not test_config_path.exists():
            print(f"Test config file not found at {test_config_path}")
            sys.exit(1)
            
        # Copy the test config to the main config location
        import shutil
        shutil.copy2(test_config_path, medusa_config_path)
        print(f"Copied {test_config_path} to {medusa_config_path}")
        medusa_config_path = Path(os.getcwd()) / "external" / "medusa-api-server" / "config.toml"
        if not medusa_config_path.exists():
            print(f"Medusa config file not found at {medusa_config_path}")
            sys.exit(1)
          
        with open(medusa_config_path, 'r') as file:
            medusa_config = toml.load(file)

        medusa_config['mode'] = "dev"
        medusa_config['key'] = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        medusa_config['contracts_path'] = "../arcadia-core-contracts"
        medusa_config['intent_book_address'] = hub_info['intent_book_address']
        medusa_config['m_token_manager_address'] = hub_info['m_token_manager_address']
        medusa_config['receipt_manager_address'] = hub_info['receipt_manager_address']
        medusa_config['hub_publisher_address'] = hub_info['hub_publisher_address']
        medusa_config['arcadia_url'] = "http://127.0.0.1:8545"
        medusa_config['medusa_rpc_url'] = medusa_api_url[7:]
        medusa_config['medusa_ws_url'] = madusa_ws_url[5:]
        medusa_config['spoke_asset_reserve_addresses'] = {}
        medusa_config['spoke_rpc_urls'] = {}
        medusa_config['gas_price'] = 1_000_000_000
        for i in range(1, n + 1):
            chain_id = 31338 + i
            medusa_config['spoke_asset_reserve_addresses'][str(chain_id)] = get_asset_reserve_address(chain_id)
            medusa_config['spoke_rpc_urls'][str(chain_id)] = f"http://127.0.0.1:{8546 + i}"
      
      
        with open(medusa_config_path, 'w') as file:
            toml.dump(medusa_config, file)
      
        daemon_config_path = Path(os.getcwd()) / "external" / "medusa-api-server" / "daemon-config.toml"
        shutil.copy2(medusa_config_path, daemon_config_path)
        print(f"Copied {medusa_config_path} to {daemon_config_path}")
        
        with open(daemon_config_path, 'r') as file:
            daemon_config = toml.load(file)
        
        daemon_config['contracts_path'] = "./contracts/arcadia-core-contracts"
        daemon_config['arcadia_url'] = "http://arcadialocal:8545"
        daemon_config['medusa_rpc_url'] = "0.0.0.0:8001"
        daemon_config['medusa_ws_url'] = "0.0.0.0:8002"
        daemon_config['spoke_rpc_urls'] = {}
        for i in range(1, n + 1):
            chain_id = 31338 + i
            chain_name = f"spokelocal{i}"
            daemon_config['spoke_rpc_urls'][str(chain_id)] = f"http://{chain_name}:{8546 + i}"
        
        with open(daemon_config_path, 'w') as file:
            toml.dump(daemon_config, file)

        print("\nUpdating medusa-api-server/crates/solver/config.toml...")
        solver_config_path = Path(os.getcwd()) / "external" / "medusa-api-server" / "crates" / "solver" / "config.toml"
        if not solver_config_path.exists():
            print(f"Solver config file not found at {solver_config_path}")
            sys.exit(1)
        
        daemon_solver_config_path = Path(os.getcwd()) / "external" / "medusa-api-server" / "crates" / "solver" / "daemon-config.toml"
        shutil.copy2(solver_config_path, daemon_solver_config_path)
        print(f"Copied {solver_config_path} to {daemon_solver_config_path}")
        with open(daemon_solver_config_path, 'r') as file:
            daemon_solver_config = toml.load(file)
        
        daemon_solver_config['medusa_url'] = "ws://medusa-api-server:8002"
        with open(daemon_solver_config_path, 'w') as file:
            toml.dump(daemon_solver_config, file)
        
        

        write_sdk_config(n)

              
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)