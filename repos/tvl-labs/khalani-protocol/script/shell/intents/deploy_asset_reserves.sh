#!/bin/bash

export AWS_KMS_KEY_ID="alias/khalani-deployer"
export DEPLOYER_ADDRESS="0x04b0bff8776d8cc0ef00489940afd9654c67e4c7"
export RPC_URL="https://ethereum-sepolia.publicnode.com"
export ETH_FROM=$DEPLOYER_ADDRESS
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=

export PROVER_ADDRESS=
export VERIFIER_ADDRESS=

echo "Deploying Asset Reserves..."
forge script script/intents/DeployAssetReserves.s.sol --broadcast --aws true --sender $DEPLOYER_ADDRESS --slow --legacy --rpc-url $RPC_URL -vvvvv
echo "Deployed Asset Reserves"
