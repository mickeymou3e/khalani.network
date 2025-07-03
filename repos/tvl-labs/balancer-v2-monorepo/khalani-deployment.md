# Deployment to The Khalani Chain

## Existing deployment

### Core contracts

The information about core smart contracts deployed on Khalani Chain can be found in `axon.json` file artifacts spread across respective deployment tasks. Examples:
1. [Vault](./pkg/deployments/tasks/20210418-vault/output/axon.json)
2. [ComposableStablePool Factory](./pkg/deployments/tasks/20220906-composable-stable-pool/output/axon.json)

### Pools

The information about currently deployed pools can be found in the [ComposableStablePool CLI artifacts directory](./pkg/deployments/cli/pools/ComposableStablePool/factory/create/output/).

Currently we only use Composable Stable Pools in Khalani.

## Requirements before proceeding with the deployment

1. Chain RPC URL
2. Private key to a deployer account that has Khalani Chain tokens to pay for the gas fees for the deployment of the contracts.
3. Addresses on the Khalani chain of the Mirror Tokens (USDT.eth, USDT.avax) and KAI/KAI.
4. Deployer needs to have initial liquidity for the pools, eg. for USDT.eth/KAI pool. The templates are right now configured in a way where you need 150k of USDT.eth, 150k USDT.avax and 150k KAI. If you want to change it you need to edit the pool template (more in sections below).

## Configuration for the new deployment

This repository is configured in a way where Hardhat config isn't part of the repository itself, but you have to create `.hardhat` directory with `networks.json` file in your user directory in your system. Without this step you won't be able to deploy anything.

If you don't have it already, please create `~/.hardhat/networks.json` (~ is your user directory). This is an example how this file could look like:

```
{
  // ...
  {
    // ...
    "axon": {
      "url": "https://www.axon-node.info"
    }
  },
  "defaultConfig": {
    "gasPrice": "auto",
    "gasMultiplier": 1,
    "accounts": {
      "mnemonic": "test test test test test test test test test test test junk"
    }
  }
};
```

Make sure that mnemonic or private key in Hardhat config is set to the account that has funds on the desired chain.

Here is another example of working config where you specify private key that is used only for the Khalani Chain (axon):
```
{
  "networks": {
    "axon": {
      "url": "https://www.axon-node.info",
      "accounts": ["0x_DEPLOYER_PRIVATE_KEY"]
    }
  },
  "defaultConfig": {
    "gasPrice": "auto",
    "gasMultiplier": 1,
    "accounts": {
      "mnemonic": "test test test test test test test test test test test junk"
    }
  }
}
```

Make sure to replace `0x_DEPLOYER_PRIVATE_KEY` with an actual private key.

## New deployment

### Build

In the root directory of the repository run:

```
yarn
yarn build
```

Set correct admin account in ["pkg/deployments/tasks/20210418-authorizer/input.ts"](./pkg/deployments/tasks/20210418-authorizer/input.ts) for Khalani chain. You can find it here:
```
axon: {
  admin: '0xE8fb7Ec07375e889824eC0fdD336e358122087Ea',
}
```
  
You can use the default value if it works for you. You can put here EOA address or Gnosis Safe address.

### Deploy core contracts and factories

This step will only deploy necessary core contracts and pool factories. It won't deploy actual pools - this will come later.

```
cd pkg/deployments
./deploy
```

Choose "axon" network (type correct number and press `Enter`).

The script will deploy any contracts that haven't been yet deployed to the chosen chain, eg. if the Vault is already deployed to Khalani, the script won't try to redeploy it. The existence check is based on the presence of axon.json file artifact.

If you want to verify all the contracts run:
```
./deploy -verify
```

If you want to force redeployment of all contracts run:
```
./deploy -force
```

The above command will automatically delete all previous contract artifacts (`axon.json`) and will deploy new contracts and create new artifact files.

### Prepare pools templates

> **If you have deployed new Mirror Tokens and KAI this is the place where you should change the addresses.**

The best way to manage deployment of the pools is to use templates. Template is a JSON file that contains pool configuration and it's easier to use saved file instead of pasting all the values (addresses etc.) into the command line.

Define a template of the pool you want to deploy in "pkg/deployments/cli/pools/ComposableStablePool/factory/create/templates".

Due to bugs in the CLI please make sure to do the following:
1. In the "tokens" array in the template use only LOWERCASE addresses
2. In the "initialLiquidity" object use only CHECKSUMMED addresses as the keys
3. Sometimes minimum 1e6 initial liquidity for each token is required otherwise Balancer complains with 204 error, MINIMUM_BPT. Please note that this is an absolute number in the lowest denomination of a token, not total number of tokens, in case of ETH this would be 1e6 WEI, not 1e6 ETH. WEI is 1/10**18 ETH.

Regarding other parameters you can leave them as they are if you plan to deploy `USDT-ETH-KAI` and `USDT-AVAX-KAI` pools.

### Deploy pools

Right now we only use Composable Stable Pools for Khalani. **Remember that your deployer account needs to have tokens for initial liquidity of the pool!** When your template is ready and deployer account has initial liquidity for the pool, run:

```
cd pkg/deployments
yarn hardhat run cli/index.ts --network axon
```
Navigation: axon > pools > ComposableStablePools > factory > template create

Then choose the template of the pool you want to deploy and proceeed. The pool should be deployed and then initial liquidity will be added to it. You can't use the pool without initial liquidity provision.

The artifacts of the deployed pool will be saved to `./pkg/deployments/cli/pools/ComposableStablePool/factory/create/output/`.

If you want to deploy multiple pools, then after the deployment of the first is finished, you can select another pool template to be deployed.

## Other ways (not recommended)

### Deploy an instance of Composable Stable Pool using Custom create (not template)

This way of deploying pools isn't recommended but may be useful in rare cases.

Due to [error in the CLI sorting code]( https://github.com/hadouken-project/private-balancer-v2-monorepo/issues/1 
) - please pass all addresses as lowercase if you use custom create.

****

#### Custom create

You can also use custom create if you don't want to use JSON templates.

Navigation: axon > pools > ComposableStablePools > factory > custom create
Example parameters:
```
name: USDC.eth/KAI
symbol: balUSDCethKAI
tokens: [
  {
    address: 0xf5522cd86c97bbd7674890561d950c8fa433ba3b
    rateProvider: 0x5a44bB00760bdaf550094eC31778f62dC1a3CED0
    priceRateCacheDuration: 200
    exemptFromYieldProtocolFee: y
  },
  {
    address: 0xfe8bfd320811526e96fa708ba6eb346c09f54c9e
    rateProvider: 0xefdDcE55C434F94cc4286bDdE561fCedEE0eD7F5
    priceRateCacheDuration: 200
    exemptFromYieldProtocolFee: y
  }
]
swapFeePercentage: 100
amplificationParameter: 1
owner: 0x73B31aC967f46dB2C45280C7f5d1D3ee7F38E122
```

### Add initial liquidity for new Composable Stable Pools

**Do this only if you have used custom create. If you use template initial liquidity provision is automated.**

```
yarn hardhat run cli/index.ts --network axon
```

axon > Vault > inital join

pool address: one of Composable Stable Pools address

join type: INIT
