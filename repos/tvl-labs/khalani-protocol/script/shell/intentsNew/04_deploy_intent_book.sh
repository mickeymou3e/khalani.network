#!/bin/bash

export AWS_KMS_KEY_ID=""

export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_SESSION_TOKEN=""

#-------USER INPUTS-------#
export KHALANI_CHAIN=khalanitestnet

echo "Starting forge script..."
forge script ./script/intents/DeployIntentBook.s.sol --sig "run()" --broadcast --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 -vvvv --legacy --slow
echo "Forge script finished."
