#!/bin/bash

network="$1"

echo "Base Balancer Contracts";
echo "Deployin on $network";

yarn workspace @balancer-labs/v2-solidity-utils run deploy:$network;
yarn workspace @balancer-labs/v2-liquidity-mining run deploy:$network;
yarn workspace @balancer-labs/v2-vault run deploy:$network;
yarn workspace @balancer-labs/v2-standalone-utils run deploy:$network;
yarn workspace @balancer-labs/v2-pool-weighted run deploy:$network;
yarn workspace @balancer-labs/v2-pool-linear deploy:$network;
yarn workspace @balancer-labs/v2-pool-stable deploy:$network;