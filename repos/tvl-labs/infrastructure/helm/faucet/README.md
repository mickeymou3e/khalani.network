# Khalani Faucet Helm Chart
This Helm chart is used to configure and install the [Khalani Faucet](https://github.com/tvl-labs/faucet).

### Configuration
The faucet can distribute multiple test tokens from different chains.

The configuration is stored at [config.json](.config%2Fconfig.json) (not a secret):
- `GLOBAL_RL` are rate limiter [parameters](https://github.com/ava-labs/avalanche-faucet#rate-limiters-important).
- `evmchains` is the list of supported EVM [chains](https://github.com/ava-labs/avalanche-faucet#adding-a-new-subnet).
Note the `"RPC": "<SECRET>"` placeholder indicating that the chains' RPCs are stored in secrets and 
mounted to the pods via ENV variables having format `EVM_CHAINS_${ID}_RPC`. We store the secrets in the AWS Secrets Manager 
and use [CSI Secrets Driver](https://secrets-store-csi-driver.sigs.k8s.io/topics/set-as-env-var.html) to mount them. 
See volumes configuration at [deployment.yaml](templates%2Fdeployment.yaml).
- `erc20tokens` are ERC-20 USD-like tokens on each chain.

The faucet wallet owns tokens on each supported chain and transfers them to users when requested (protected with a rate limiter).

#### Make sure the `applications` namespace exists
```shell
kubectl get ns applications
```

#### Install the faucet Helm chart
```shell
make install-faucet
```

#### Upgrade the existing faucet Helm chart
```shell
make upgrade-faucet
```