export KHALANI=khalanitestnet

touch script/config/kln_tokens_out.json

echo "Starting forge script..."
forge script script/DeployKlnToken.s.sol --broadcast --verify --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7  -vvvv --legacy --verifier sourcify
echo "Forge script completed"

#!/bin/bash

echo "Merging klnTokens and MirrorTokens..."
# Ensure python3 is installed
if command -v python3 &>/dev/null; then
    python3 script/lib/group_kln_mirror.py
else
    echo "Python3 is not installed. Please install Python3 and try again."
    exit 1
fi

echo "Merging completed"