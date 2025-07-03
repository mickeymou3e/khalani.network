# Hyperlane Agents Deployment

## Agents deployed by Khalani team
![hyperlane-agent-deployment.png](../docs/images/hyperlane-agent-deployment.png)

### Khalani Validator
Indexes messages sent **from** Khalani to end-chains. 
Stores signed checkpoints to S3 bucket accessible to the Khalani Relayer.

> Note: there is currently only 1 validator. We will run at least 3 with threshold 2.

### Khalani Relayer
Relays messages sent **from** Khalani to end-chains.

Fetches validators' signed checkpoints from the S3 bucket. 
When the messages have achieved the consensus, sends them to the end-chains.

### Sepolia / Fuji / end-chain Relayers
Relay messages sent **to** Khalani from the end-chains. 
For each chain there is one relayer that indexes the source chains (Sepolia/Fuji)
and sends messages to Khalani chain when the messages have achieved the consensus.

These relayers use publicly available validators and S3 buckets deployed by the Hyperlane Core team, 
so we don't need to run our own validators for non-Khalani chain.

## Configuration
#### [config.json](config.json)
Contains the common agent configuration, which is shared for all validators and relayers.
This file is added to k8s cluster via `ConfigMap`, and is mounted as a file to all agents.
The rest of the configuration is passed via ENV variables (like `HYP_VALIDATOR_INTERVAL`) of a specific agent.

`chains.khalanitestnet.addresses` is the only part to be configured for a new environment. 
The other chains are configured properly with the publicly available addresses.

## Deploy

#### Install the tooling
Install `kubectl`, [`aws` CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html), `helm`, and `make`.

#### Log in to EKS `axon-eks` with `aws`
Configure an AWS CLI user having permissions to deploy to EKS.
```
# Pass the following configs
# - AWS Access Key ID (secret)
# - AWS Secret Access Key (secret)
# - Region name (currently, us-east-1)

aws configure
```

#### Change the current `kubectl` cluster to `axon-eks`

```
aws eks list-clusters
aws eks update-kubeconfig --name axon-eks
```

**Important!** When working with `kubectl` always check the current cluster
```
kubectl config current-context
```

#### Configure contract addresses for `khalanitestnet` in [config.json](config.json)
Specify the contract addresses for `mailbox`, `interchainGasPaymaster`, `validatorAnnounce`

#### AWS IAM configuration

**Validator**
1. Create `hyperlane-validators` IAM role with trust policy: [file](./hyperlane-validators/iam/role-trust-policy.json).
2. Create KMS key and S3 bucket for `hyperlane-validators` and set its permissions correctly. For more information refer to [this document](../eks-pod-aws-permissions.md).

**Relayers**
1. Create `hyperlane-relayers-khalani` IAM role with trust policy: [file](./hyperlane-relayers/hyperlane-relayers-khalani/iam/role-trust-policy.json).
2. Create `khalani/testnet/hyperlane-connection-urls` secret in AWS Secrets Manager with [resource permissions](./hyperlane-relayers/secrets/aws/hyperlane-connection-urls-resource-permissions.json) and [example secret value](./hyperlane-relayers/secrets/aws/hyperlane-connection-urls-secret-value-example.json) - remember to change values to actual RPC URLs.
3. Create KMS key for relayer signer, eg. `hyperlane-relayers-khalani-signer-goerli` (assymetric, ECC_SECG_P256K1, sign and verify) with [key policy](./hyperlane-relayers/hyperlane-relayers-khalani/iam/kms-key-policy.json). Set the KMS key id in [deployment.yaml](./hyperlane-relayers/hyperlane-relayers-khalani/templates/deployment.yaml).
4. Create IAM roles: `hyperlane-relayers-fuji`, `hyperlane-relayers-goerli` (like in step 1)
5. Create KMS keys: `hyperlane-relayers-fuji-signer`, `hyperlane-relayers-goerli-signer` (like in step 3)
6. Make sure RPC URLs secret in AWS Secrets Manager is accessible by the roles created in step 4.

#### Deploy

Before proceeding make sure you have already deployed "eks-universal/secrets" at least to "hyperlane" namespace.

`Makefile` contains all the needed commands for deployment to a remote EKS cluster.

```
make create-namespace
make deploy-all
```

