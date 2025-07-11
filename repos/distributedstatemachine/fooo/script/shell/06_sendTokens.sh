#!/bin/bash

export REMOTE=godwokentestnet
export KHALANI=khalanitestnet


echo "Starting forge script..."
forge script script/SendToken.s.sol --broadcast --verify --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 -vvvv
echo "Forge script finished."