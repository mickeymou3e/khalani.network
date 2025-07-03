#!/bin/bash

export AWS_KMS_KEY_ID="alias/khalani-deployer"
export DEPLOYER_ADDRESS="0x04b0bff8776d8cc0ef00489940afd9654c67e4c7"
export RPC_URL="https://ethereum-sepolia.publicnode.com"
export ETH_FROM=$DEPLOYER_ADDRESS
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=

echo "Deploying SwapIntentFiller..."
forge script script/intents/DeploySwapIntentFiller.s.sol --broadcast --aws true --sender $DEPLOYER_ADDRESS --slow --legacy -vvvvv
echo "Deployed SwapIntentFiller"
