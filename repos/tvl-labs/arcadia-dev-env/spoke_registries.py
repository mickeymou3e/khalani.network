import os
import yaml

def create_spoke_registry(i):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    with open('spokelocal/metadata.yaml', 'r') as file:
        metadata = yaml.safe_load(file)
    
    original_chain_id = metadata['chainId']
    original_domain_id = metadata['domainId']
    original_port = 8546
    
    metadata['chainId'] = original_chain_id + i
    metadata['domainId'] = original_domain_id + i
    metadata['name'] = f"spokelocal{i}"
    metadata['displayName'] = f"Spokelocal{i}"
    
    new_port = original_port + i
    metadata['rpcUrls'] = [{"http": f"http://localhost:{new_port}"}]
    
    output_dir = f"{os.environ['HOME']}/.hyperlane/chains/spokelocal{i}"
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = f"{output_dir}/metadata.yaml"
    with open(output_file, 'w') as file:
        yaml.dump(metadata, file, default_flow_style=False, sort_keys=False)
    
    print(f"Created spoke registry for spokelocal{i} at {output_file}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python spoke_registries.py <number_of_spokes>")
        sys.exit(1)
    
    try:
        n = int(sys.argv[1])
        for i in range(1, n + 1):
            create_spoke_registry(i)
    except ValueError:
        print("Error: Please provide a valid integer for the number of spokes")
        sys.exit(1)