#!/bin/bash

export KHALANI=khalanitestnet
export REMOTES=sepolia,fuji,mumbai,bsctestnet,arb-goerli,optimism-goerli,godwokentestnet
export BALANCER_VAULT=0x580d2aa4231E4C2EFfb3A43D3b778cd956C875bf
export KLN_TOKENS=$(jq -r 'keys[]' ./script/config/kln_mirror_group.json | tr '\n' ',' | sed 's/,$//')

echo $KLN_TOKENS

echo "Starting forge script..."
forge script script/DeployKhalani.s.sol --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7  --broadcast --verify -vvvv --legacy --verifier sourcify
echo "Forge script completed"
