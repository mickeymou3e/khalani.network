# Arcadia subgraphs for intent events

These subgraphs include subgraphs to capture intent events on Arcadia, and swap intent filler events on end chains.

Arcadia Chain Graph Node is deployed on AWS for both testnet and mainnet environments.

To access existing subgraphs and code of the Khalani-ex DeFi platform, please refer to the master-ex branch.

The subgraphs are deployed to both arcadiatestnet and arcadiamainnet networks.

## Existing deployments

Here you can find and play with the existing deployments of the subgraphs by visiting:

- Testnet: <https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/intents-arcadiatestnet>
- Mainnet: <https://graph-node-http-khalani.mainnet.khalani.network/subgraphs/name/intents-arcadiamainnet>

## Configuration

### Environment file

Create new file called `.env` by copying either `.env.testnet` or `.env.mainnet` content depending on your target environment. Set `GRAPH_ACCESS_TOKEN` if it is required.

For the Arcadia Chain you can find the `GRAPH_ACCESS_TOKEN` by going to AWS Secrets Manager and then find "/khalani/staging/secrets" for testnet or "/khalani/production/secrets" for mainnet. In the "Secret Value" section click "Retrieve secret value".

You will see a table with column "Secret value". Copy the value for secret key called "ACCESS_TOKEN". This is `GRAPH_ACCESS_TOKEN` that you need in the `.env` file for deploying to your target environment.

### Contracts addresses

In `config/${chain_name}.json` you have to put the addresses of the contracts deployed on the respective chains.

- SwapIntentBook - contract deployed on the Arcadia network.
- SwapIntentFiller - contracts deployed on the end chain.

## Deploy subgraphs

These actions will override previous deployments of the subgraphs.

For testnet:
`yarn subgraph:intents-arcadiatestnet`

For mainnet:
`yarn subgraph:intents-arcadiamainnet`
