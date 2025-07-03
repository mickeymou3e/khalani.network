hub_address_path = ".hyperlane/chains/arcadialocal/addresses.yaml"
spoke_address_path = ".hyperlane/chains/spokelocal/addresses.yaml"
import os
import json
import yaml
from pathlib import Path
import re
from utils import get_permit2_address

def get_mailbox_address(i):
    try:
        home_dir = os.environ.get('HOME')
        if not home_dir:
            print("Error: HOME environment variable not set")
            return None
            
        address_path = Path(f"{home_dir}/.hyperlane/chains/spokelocal{i}/addresses.yaml")
        
        if not address_path.exists():
            print(f"Warning: No addresses.yaml found for chain {i} at {address_path}")
            return None
        
        with open(address_path, 'r') as file:
            data = yaml.safe_load(file)
            
        if 'mailbox' in data:
            return data['mailbox']
        else:
            print(f"Warning: No mailbox field found in addresses.yaml for chain {i}")
            return None
            
    except Exception as e:
        print(f"Error fetching mailbox address for chain {i}: {str(e)}")
        return None

def get_hub_mailbox_address():
    try:
        home_dir = os.environ.get('HOME')
        if not home_dir:
            print("Error: HOME environment variable not set")
            return None
            
        address_path = Path(f"{home_dir}/.hyperlane/chains/arcadialocal/addresses.yaml")
        
        if not address_path.exists():
            print(f"Warning: No addresses.yaml found for hub at {address_path}")
            return None
        
        with open(address_path, 'r') as file:
            data = yaml.safe_load(file)
            
        if 'mailbox' in data:
            return data['mailbox']
        else:
            print(f"Warning: No mailbox field found in addresses.yaml for hub")
            return None
            
    except Exception as e:
        print(f"Error fetching hub mailbox address: {str(e)}")
        return None


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python update_chain_info.py <number_of_chains>")
        sys.exit(1)
    
    try:
        n = int(sys.argv[1])
        mailbox_addresses = {}
        
        # Get hub mailbox address
        hub_mailbox_address = get_hub_mailbox_address()
        print(f"hub_mailbox_address", hub_mailbox_address)
        
        for i in range(1, n + 1):
            chain_id = 31338 + i
            permit2_address = get_permit2_address(chain_id)
            mailbox_address = get_mailbox_address(i)
            mailbox_addresses[chain_id] = mailbox_address
            print("permit2_address", permit2_address)
            print(f"mailbox_address_{chain_id}", mailbox_address)
            
            # Update .env.dev file
            env_dev_path = Path('.env.dev')
            if env_dev_path.exists():
                with open(env_dev_path, 'r') as file:
                    env_dev_content = file.read()
                
                # Update PERMIT2_ADDRESS and PERMIT2
                if permit2_address:
                    env_dev_content = re.sub(r'export PERMIT2_ADDRESS=.*', f'export PERMIT2_ADDRESS={permit2_address}', env_dev_content)
                    env_dev_content = re.sub(r'export PERMIT2=.*', f'export PERMIT2={permit2_address}', env_dev_content)
                
                # Update HUB_MAILBOX
                if hub_mailbox_address:
                    env_dev_content = re.sub(r'export HUB_MAILBOX=.*', f'export HUB_MAILBOX={hub_mailbox_address}', env_dev_content)
                    if not re.search(r'export HUB_MAILBOX=', env_dev_content):
                        env_dev_content += f'export HUB_MAILBOX={hub_mailbox_address}\n'
                
                env_dev_content = re.sub(r'export SPOKE_MAILBOX_\d+=.*\n', '', env_dev_content)
                
                for chain_id in mailbox_addresses:
                    if mailbox_addresses[chain_id]:
                        env_dev_content += f'export SPOKE_MAILBOX_{chain_id}={mailbox_addresses[chain_id]}\n'
                
                with open(env_dev_path, 'w') as file:
                    file.write(env_dev_content)
                print(f"Updated .env.dev with mailbox and permit2 addresses")
            else:
                print("Warning: .env.dev file not found")
            
            # Update .env.core.hub file
            env_core_hub_path = Path('.env.core.hub')
            if env_core_hub_path.exists():
                with open(env_core_hub_path, 'r') as file:
                    env_core_hub_content = file.read()
                
                # Update PERMIT2_ADDRESS and PERMIT2
                if permit2_address:
                    env_core_hub_content = re.sub(r'export PERMIT2_ADDRESS=.*', f'export PERMIT2_ADDRESS={permit2_address}', env_core_hub_content)
                    env_core_hub_content = re.sub(r'export PERMIT2=.*', f'export PERMIT2={permit2_address}', env_core_hub_content)
                
                # Update HUB_MAILBOX
                if hub_mailbox_address:
                    env_core_hub_content = re.sub(r'export HUB_MAILBOX=.*', f'export HUB_MAILBOX={hub_mailbox_address}', env_core_hub_content)
                    if not re.search(r'export HUB_MAILBOX=', env_core_hub_content):
                        env_core_hub_content += f'export HUB_MAILBOX={hub_mailbox_address}\n'
                
                env_core_hub_content = re.sub(r'export SPOKE_MAILBOX_\d+=.*\n', '', env_core_hub_content)
                
                for chain_id in mailbox_addresses:
                    if mailbox_addresses[chain_id]:
                        env_core_hub_content += f'export SPOKE_MAILBOX_{chain_id}={mailbox_addresses[chain_id]}\n'
                
                with open(env_core_hub_path, 'w') as file:
                    file.write(env_core_hub_content)
                print(f"Updated .env.core.hub with mailbox and permit2 addresses")
            else:
                print("Warning: .env.core.hub file not found")

    except ValueError:
        print("Error: Please provide a valid integer for the number of chains")
        sys.exit(1)