# End to end deployment strategy

## Introduction

The reason for the creation of this document is to describe the practical steps needed to get the Khalani application up and running by any developer. The document has also been requested by one of the TVL developers. He asked for an introduction to deployment/configuration of the indexing software, frontend, Balancer, etc. to build the whole picture of what's required from the empty state to the end product working.

We can use the following steps to describe the process high-level:

1. Deploy Khalani Chain 
2. Deploy Hyperlane
3. Deploy KAI and Mirror tokens
4. Deploy Balancer
5. Nexus Diamond
6. Deploy Graph Node and subgraphs
7. Deploy Block Explorer
8. Update Balancer SDK
9. Update Khalani SDK
10. Deploy Frontend

## 1. Deploy Khalani Chain

The axon-eks cluster has to be deployed in Elastic Kubernetes Service in AWS using templates from this repository. It consists of 4 nodes that together will reach consensus and produce blocks. Axon is deployed separately using: https://github.com/tvl-labs/axon-devops.

**Literature**
1. [terraform/README.md](./terraform/README.md)

**Smoke testing**

1. Check if network is producing blocks
2. Check if sending transaction works

When the cluster is operating properly then you should observe that the network is successfully producing new blocks.

You can use following request to check the latest block and make sure it is changing over time:

```
curl --location 'https://testnet.khalani.network' \
--header 'Content-Type: application/json' \
--data '{
	"jsonrpc":"2.0",
	"method":"eth_getBlockByNumber",
	"params":[
        "latest",
        false
    ],
	"id":1
}'
```

The `result.number` field in the response should increment over time.

**Outcome**

The main outcome of deploying the chain should be working blockchain RPC URL:

- https://testnet.khalani.network

You should also have access (private key) to account that has native tokens on the chain. You will need native tokens to deploy contracts etc.

By default the private keys to accounts that should contain native tokens can be found in AWS Secrets Manager in a secret called ["axon_node_config"](https://us-east-1.console.aws.amazon.com/secretsmanager/secret?name=axon_node_config&region=us-east-1). 

For example `NODE_1_PRIVATE_KEY` should contain native tokens. You can send some native tokens to other account you plan to use for interacting with the Khalani Chain. You shouldn't continuously use `NODE_1_PRIVATE_KEY` to eliminate risk of interfering with mining blocks on the network.

## 2. Deploy Hyperlane

Literature:
1. Read the [README.md of "tvl-labs/hyperlane-deploy" repository](https://github.com/tvl-labs/hyperlane-deploy/blob/main/README.md).

## 3. KAI and Mirror tokens

Literature:
1. [Khalani Smart Contracts Overview](https://github.com/tvl-labs/khalani-core/blob/main/docs/arch.png)
2. [Khalani Deployment](https://github.com/tvl-labs/khalani-monorepo/blob/main/solidity/khalani-core/docs/Deployment.md)

## 4. Deploy Balancer

**Requirements**
1. Khalani Chain RPC URL
2. KAI and mirror tokens (eg. USDTeth, USDTavax) addresses on the Khalani Chain. They will be needed for the deployment of the pools.
3. Deployer account on Khalani Chain private key + Khalani Chain native tokens to pay for gas fees
3. Initial liquidity for the deployment of the pools. Right now it's 150k of USDT.eth, 150k of USDT.avax and 300k of KAI (150k * 2 pools). Make sure your deployer address on Khalani Chain has these tokens before trying to deploy any Balancer pools. 

**Deployment**

Information about the deployment of the core Balancer contracts and the pools can be found in [tvl-labs/balancer-v2-monorepo](https://github.com/tvl-labs/balancer-v2-monorepo). Specifically in [the Khalani Chain deployment document](https://github.com/tvl-labs/balancer-v2-monorepo/blob/axon/khalani-deployment.md).

## 5. Nexus Diamond

Literature:
1. [Khalani Smart Contracts Overview](https://github.com/tvl-labs/khalani-core/blob/main/docs/arch.png)
2. [Khalani Deployment](https://github.com/tvl-labs/khalani-monorepo/blob/main/solidity/khalani-core/docs/Deployment.md)

## 6. Deploy Graph Node and subgraphs

**Introduction**

Graph Node is a blockchain indexer service that is used by the frontend application. The subgraph is a name of the particular indexing database for some specific smart contracts.

**Requirements**

1. TVL AWS account CLI access
2. Khalani Chain RPC URL
3. Sepolia RPC URL (eg. Infura)
4. Fuji RPC URL (eg. Infura)
5. Addresses of deployed core Balancer contracts (Vault, pool factories)
6. Addresses of deployed Hyperlane mailboxes and Cross Chain Routers on all supported chains 

### 6.1. Graph Node

**Deployment**

Graph Node deployment is now part of Terraform automatic deployment. It means that when you apply terraform changes it will attempt to deploy Graph Node using Helm charts.

Make sure though to manually create a secret that is passed as "connection_urls_secret" in terraform/main.tf to graph-node module. It should contain RPC connection URLs Graph Node. Example format:
```
{"Chain1Name":"khalanitestnet","Chain1RpcUrl":"https://testnet.khalani.network","Chain2Name":"sepolia","Chain2RpcUrl":"https://sepolia.infura.io/v3/X","Chain3Name":"fuji","Chain3RpcUrl":"https://avalanche-fuji.infura.io/v3/X"}
```

**Outcome**

- https://graph-node-http-khalani.testnet.khalani.network - Graph Node GraphQL HTTP endpoint
- wss://graph-node-ws-khalani.testnet.khalani.network - Graph Node GraphQL WebSockets endpoint
- https://graph-node-admin-khalani.testnet.khalani.network - Graph Node Admin endpoint ("ACCESS_TOKEN" protected)
- https://ipfs-khalani.testnet.khalani.network - Graph Node IPFS endpoint
- Admin endpoint "ACCESS_TOKEN" - find it in AWS Secrets Manager under secret with name ["graph-node-access-token-secret-2"](https://us-east-1.console.aws.amazon.com/secretsmanager/secret?name=graph-node-access-token-secret-2&region=us-east-1)

Admin endpoint, IPFS endpoint and access token are all required to deploy subgraphs. You will need to put these values in `.env` files in subgraph repositories.

### 6.2. Subgraphs

**Introduction**

In Khalani we use multiple subgraphs:
1. https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/balancer-khalani - Balancer subgraph on Khalani Chain
2. https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/blocks-khalani - Balancer helper subgraph that's only indexing data about blocks on Khalani Chain
3. https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/mailbox-khalanitestnet - Khalani + Hyperlane subgraph on Khalani Chain
4. https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/mailbox-fuji - Khalani + Hyperlane subgraph on Fuji
5. https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/mailbox-sepolia - Khalani + Hyperlane subgraph on Sepolia

Websockets endpoints work perfectly fine too. Example subgraph WSS URL: wss://graph-node-ws-khalani.testnet.khalani.network/subgraphs/name/balancer-khalani

**Deployment**

You can only deploy subgraphs when the Graph Node is already up and running and you have working URLs.

1. [Balancer subgraphs deployment instruction](https://github.com/tvl-labs/hadoukenswap-subgraph-v2/blob/parity/README.md) - it will deploy subgraphs 1 and 2 from the "Introduction" list
2. [Khalani subgraphs deployment instruction](https://github.com/tvl-labs/khalani-subgraph/blob/master/README.md) - it will deploy subgraphs 3, 4, 5 from the "Introduction" list

### 7. Deploy Block Explorer

Block Explorer URL is required by the Khalani Explorer that is part of the frontend.

Deployment is part of `terraform/` deployment.

### 8. Update Balancer SDK

1. ["config.ts"](https://github.com/tvl-labs/swap-sdk/blob/master/balancer-js/src/lib/constants/config.ts) file has to be updated. Make sure to update the "vault" address and "balancer-khalani" subgraph absolute URL. You don't need to update "multicall" and "wrappedNativeAsset" because they are not used right now. 
2. Create new NPM version locally and push the commit and the tag to "master" branch
3. Go to ["Releases" tab](https://github.com/tvl-labs/swap-sdk/releases) and create a new release with the tag that you've just created. It will automatically publish an NPM package. You don't need any special permissions to perform this action.

### 9. Update Khalani SDK

Most of the important domain logic in frontend has been moved to Khalani SDK package.

1. Update "package.json" file with the latest version of Balancer SDK npm package. The NPM package name is ["@tvl-labs/swap-v2-sdk"](https://github.com/tvl-labs/swap-sdk/pkgs/npm/swap-v2-sdk). 
2. Update all configs in config directory: https://github.com/tvl-labs/khalani-sdk/tree/main/config
3. Create new NPM version locally and push the commit and the tag to "master" branch
4. Go to "Releases" tab and create a new release with the tag that you've just created. It will automatically publish an NPM package. You don't need any special permissions to perform this action.

### 10. Deploy Frontend

**Deployment**

1. Update Khalani SDK package version in package.json. 
2. A "master" branch of [tvl-labs/khalani-app](https://github.com/tvl-labs/khalani-app) is set to automatically deploy to https://app.testnet.khalani.network/