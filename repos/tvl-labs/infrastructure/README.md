\# TVL Labs infrastructure

In general the most important part of this repository is the `terraform` directory. It contains a lot of configuration for automatic deployment of the necessary infrastructure.

## Literature

1. [End to end deployment strategy](./end-to-end-deployment.md)
2. [AWS permissions](./aws-permissions.md)

## Artifacts

### The Khalani Chain Testnet

1. Balancer frontend: https://app.testnet.khalani.network [Repository.](https://github.com/tvl-labs/khalani-app) There's also a staging version: https://app.staging.khalani.network.
2. RPC: https://testnet.khalani.network (type it without "www.", it won't work otherwise)
3. Block explorer: https://block-explorer.testnet.khalani.network (Deployed via Terraform)
4. Graph Node: https://graph-node-http-khalani.testnet.khalani.network (Deployed via Terraform) For subgraphs configuration it is best to consult: https://github.com/tvl-labs/khalani-subgraph
5. Gnosis Safe: https://safe-ui.khalani.network. [More details.](./gnosis-safe.md)

### EKS

To check EKS related variables it is best to consult `terraform/terraform.tfvars` file.

### Notes

More information about CI deployment configuration can be found in the specific app-related repositories.
