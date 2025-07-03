#!/bin/bash

export AWS_KMS_KEY_ID=""

export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_SESSION_TOKEN=""

#-------USER INPUTS-------#
export KHALANI_CHAIN=khalanitestnet

echo "Starting forge script to deploy liquidity projector..."
forge script ./script/intents/DeployLiquidityProjectorV2.s.sol --sig "run()" --broadcast --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 -vvvv --legacy --slow
echo "Forge script finished."

#comment out the above forge command if liquidity projector is already deployed

#use the following pattern to register mirror tokens for different spoke chains

#sepolia
export SPOKE_CHAIN=sepolia
export KHALANI_CHAIN=khalanitestnet
echo "Starting forge script to register mirror tokens..."
forge script ./script/intents/DeployLiquidityProjectorV2.s.sol --sig "registerMirrorTokens()" --broadcast --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 -vvvv --legacy --slow
echo "Forge script finished."

#fuji
export SPOKE_CHAIN=fuji
export KHALANI_CHAIN=khalanitestnet
echo "Starting forge script to register mirror tokens..."
forge script ./script/intents/DeployLiquidityProjectorV2.s.sol --sig "registerMirrorTokens()" --broadcast --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 -vvvv --legacy --slow
echo "Forge script finished."





