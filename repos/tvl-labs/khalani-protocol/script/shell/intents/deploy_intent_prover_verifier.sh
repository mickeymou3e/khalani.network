#!/bin/bash

export AWS_KMS_KEY_ID="alias/khalani-deployer"
export DEPLOYER_ADDRESS="0x04b0bff8776d8cc0ef00489940afd9654c67e4c7"
export ETH_FROM=$DEPLOYER_ADDRESS
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=

echo "Deploying SwapIntentFiller..."
forge script script/intents/DeployIntentProverVerifier.s.sol --broadcast --aws true --sender $DEPLOYER_ADDRESS --verify --verifier etherscan --legacy --slow -vvvvv
echo "Deployed SwapIntentFiller"
