#!/bin/bash

# Prompt for environment selection
echo "Select environment:"
echo "1. Local"
echo "2. Production"
read -p "Enter your choice (1 or 2): " environment

source .env

subgraph_node=""
subgraph_ipfs=""
subgraph_access_token=$GRAPH_ACCESS_TOKEN

if [[ $environment == 1 ]]; then
    echo -e "Running in local environment...\n"
    subgraph_node="http://127.0.0.1:8020"
    subgraph_ipfs="http://localhost:5001"

    echo -e "Subgraph will be deployed on: \n node - $subgraph_node \n ipfs - $subgraph_ipfs"

elif [[ $environment == 2 ]]; then
    echo -e "Running in production environment...\n"

    subgraph_node=$GRAPH_ADMIN_URL
    subgraph_ipfs=$GRAPH_IPFS_URL

    echo -e "Subgraph will be deployed on: \n node - $subgraph_node \n ipfs - $subgraph_ipfs"
    
else
    echo "Invalid environment. Please select 1 or 2."
    exit 1
fi


echo -e "\nSelect subgraph to deploy"

subgraph_names=("godwoken-mainnet" "godwoken-testnet" "zksync-mainnet" "zksync-testnet" "mantle-testnet")

echo ""

for subgraph_name in "${subgraph_names[@]}"; do
    echo -e "$subgraph_name\n"
done

read -p "Write subgraph name: " selected_subgraph_name

echo "Subgraph to deploy: $selected_subgraph_name"

echo "Clean up"
rm -rf generated
rm -rf build
rm -rf data

echo "Create template"
yarn mustache config/$selected_subgraph_name.json subgraph.template.yaml | sed '1,1d' > subgraph.yaml

echo "Generate manifests for subgraph"
yarn codegen


# Add balancer prefix
if [[ $selected_subgraph_name == "godwoken-mainnet" ]]; then
    selected_subgraph_name="lending-godwoken-mainnet"

elif [[ $selected_subgraph_name == "godwoken-testnet" ]]; then
     selected_subgraph_name="lending-godwoken-testnet"

elif [[ $selected_subgraph_name == "zksync-mainnet" ]]; then
    selected_subgraph_name="lending-zksync-mainnet"

elif [[ $selected_subgraph_name == "zksync-testnet" ]]; then
    selected_subgraph_name="lending-zksync-testnet"
    
elif [[ $selected_subgraph_name == "mantle-testnet" ]]; then
    selected_subgraph_name="lending-mantle-testnet"
else
    echo "Invalid subgraph name."
    exit 1
fi


echo -e "Remove subgraph \n: "

yarn graph remove $selected_subgraph_name --access-token $subgraph_access_token --node $subgraph_node

echo -e "Build subgraph \n: "

yarn build

echo -e "Create subgraph \n: "

yarn graph create $selected_subgraph_name --access-token $subgraph_access_token --node $subgraph_node

echo -e "Deploy subgraph \n: "

yarn graph deploy $selected_subgraph_name --access-token $subgraph_access_token --ipfs $subgraph_ipfs --node $subgraph_node -l 0.0.1
