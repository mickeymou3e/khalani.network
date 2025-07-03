#!/bin/bash

export AWS_KMS_KEY_ID="alias/khalani-deployer"
export DEPLOYER_ADDRESS="0x04b0bff8776d8cc0ef00489940afd9654c67e4c7"
export RPC_URL="https://ethereum-sepolia.publicnode.com"
export ETH_FROM=$DEPLOYER_ADDRESS

echo "Deploying Escrow..."
forge script script/intents/DeployEscrow.s.sol --broadcast --aws true --sender $DEPLOYER_ADDRESS --slow --legacy --rpc-url $RPC_URL -vvvvv
echo "Deployed Escrow"
