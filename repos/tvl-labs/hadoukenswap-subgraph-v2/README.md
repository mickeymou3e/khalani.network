# Subgraphs for Balancer V2 contracts on the Khalani Chain

Khalani Chain testnet Graph Node should be already deployed on AWS.

This repository consists of two subgraphs required for proper indexing of Balancer deployment on the Khalani Chain.

- "balancer-khala" subgraph indexes actual Balancer smart contracts.
- "blocks-khala" subgraph indexes data about all blockchain blocks for the UX reasons

## Existing deployment

Here you can find and play with the existing deployment of the subgraphs:

- https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/balancer-khala
- https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/blocks-khala

## Configuration

### Environment file

Create new file called `.env` by copying `.env.example` content. Set `GRAPH_TESTNET_ACCESS_TOKEN` if it is required.

For the Khalani Chain you can find the `GRAPH_TESTNET_ACCESS_TOKEN` by going to AWS Secrets Manager and then find "/khalani/staging/secrets" secret. In the "Secret Value" section click "Retrieve secret value".

You will see a table with column "Secret value". Copy the value for secret key called "ACCESS_TOKEN". This is `GRAPH_TESTNET_ACCESS_TOKEN` that you need in the `.env` file for deploying to testnet environment.

### Contracts addresses

In ["config/balancer/khala.json"](./config/balancer/khala.json) you have to put the addresses of the contracts deployed on the Khalani Chain.

You can find the addresses in the [Balancer repository](https://github.com/tvl-labs/balancer-v2-monorepo) for:

- ["Vault"](https://github.com/tvl-labs/balancer-v2-monorepo/blob/axon/pkg/deployments/tasks/20210418-vault/output/axon.json)
- ["WeightedPoolFactory"](https://github.com/tvl-labs/balancer-v2-monorepo/blob/axon/pkg/deployments/tasks/20220908-weighted-pool-v2/output/axon.json)
- ["ComposableStablePoolFactory"](https://github.com/tvl-labs/balancer-v2-monorepo/blob/axon/pkg/deployments/tasks/20220906-composable-stable-pool/output/axon.json)
- ["AaveLinearPoolFactory"](https://github.com/tvl-labs/balancer-v2-monorepo/blob/axon/pkg/deployments/tasks/20220817-aave-rebalanced-linear-pool/output/axon.json)

Now, update the "USDCeth", "USDCavax", "KAI" addresses. You should have them after deploying Mirror Tokens and KAI.

You can leave out the rest of the addresses as they are. They won't be needed so don't need to be updated.

> Note: Make sure to also update "startBlock" property in `khala.json` to the block number when Vault was deployed.

## Deploy Khalani Chain subgraphs

This action will override previous deployments of the subgraphs.

```
yarn
yarn subgraph:balancer:khala
yarn subgraph:blocks:khala
```