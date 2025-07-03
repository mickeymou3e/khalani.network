#!/bin/bash

export REMOTES=godwokentestnet
export KHALANI=khalanitestnet

echo "Running forge script..."
forge script ./script/CrossChainRegister.s.sol --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7  --broadcast --verify -vvvv --verifier sourcify --slow --legacy
echo "Done running forge script."

