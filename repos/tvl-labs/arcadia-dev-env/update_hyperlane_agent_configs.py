import json
import os
from pathlib import Path
from utils import get_hub_contract_addresses, get_spoke_igp_address
import copy


def update_hyperlane_igp_addresses(num_chains):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    project_root = Path(os.getcwd())

    hub_igp_address = get_hub_contract_addresses()['igp_address']

    hyperlane_config_path = project_root / "configs" / "agent-config.json"
    with open(hyperlane_config_path, 'r') as file:
        hyperlane_config = json.load(file)
    
    
    spoke_igp_addresses = {}
    for i in range(1, num_chains + 1):
        chain_name = f"spokelocal{i}"
        chain_id = 31338 + i
        spoke_igp_addresses[chain_name] = get_spoke_igp_address(chain_id)

    print("spoke chain igp addresses: ", spoke_igp_addresses)
    
    for chain_name in hyperlane_config['chains']:
        chain = hyperlane_config['chains'][chain_name]
        if chain['name'] == 'arcadialocal':
            chain['interchainGasPaymaster'] = hub_igp_address
        elif chain['name'] in spoke_igp_addresses:
            chain['interchainGasPaymaster'] = spoke_igp_addresses[chain['name']]

    daemon_config = copy.deepcopy(hyperlane_config)
    for chain_name in daemon_config['chains']:
        chain = daemon_config['chains'][chain_name]
        if chain['name'] == 'arcadialocal':
            chain['rpcUrls'] = [
                {
                    "http": f"http://{chain['name']}:8545"
                }
            ]
        elif chain['name'].startswith('spokelocal'):
            # Extract the number from spokelocal{i}
            i = int(chain['name'][10:])  # Get the number after 'spokelocal'
            port = 8546 + i
            chain['rpcUrls'] = [
                {
                    "http": f"http://{chain['name']}:{port}"
                }
            ]
    with open(hyperlane_config_path, 'w') as file:
        json.dump(hyperlane_config, file, indent=4)

    daemon_config_path = project_root / "configs" / "daemon-config.json"
    with open(daemon_config_path, 'w') as file:
        json.dump(daemon_config, file, indent=4)
    

if __name__ == "__main__":
    import sys
    num_spoke_chains = sys.argv[1]
    update_hyperlane_igp_addresses(int(num_spoke_chains))