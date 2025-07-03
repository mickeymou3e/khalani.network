#!/bin/bash

echo -e "\nSelect subgraph to build"

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

