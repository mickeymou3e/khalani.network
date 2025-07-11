#!/bin/bash

export REMOTE=godwokentestnet
export KHALANI=khalanitestnet
export KHALANI_CHAIN_ID=10012

echo "Starting forge scripts"
forge script script/DeployRemote.s.sol --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7  --broadcast --verify -vvvv --verifier sourcify --slow --legacy --gas-estimate-multiplier 1000
