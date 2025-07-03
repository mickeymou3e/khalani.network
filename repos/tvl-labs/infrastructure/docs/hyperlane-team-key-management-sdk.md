## Overview
This document is an overview of Hyperlane's team [infrastructure TypeScript SDKs](https://github.com/hyperlane-xyz/hyperlane-monorepo/tree/7250c1c14d2602030bf10bb27a4ec373fb3cd212/typescript/infra)
containing useful scripts to manage cloud stored (AWS / GCP) keys used by relayers/validators.

We're yet to decide what ideas of these SDKs the Khalani team wants to adopt.

### Environment
Hyperlane infra has 3 [environments](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/ed17ddc32f6d7300694556591f43fe3929f29e80/typescript/infra/config/environments/index.ts#L5): `test` | `testnet3` | `mainnet2`.

For Khalani, we could override this to our `test` | `mainnet` environments.

### Context
Hyperlane infra has a notion of [context](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/ed17ddc32f6d7300694556591f43fe3929f29e80/typescript/infra/config/contexts.ts#L2): `hyperlane` | `rc`. Most of the time the `hyperlane` is used.

For Khalani, we could override this to our single `khalani` context.

### Key Role
There are several key [roles](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/ed17ddc32f6d7300694556591f43fe3929f29e80/typescript/infra/src/agents/roles.ts#L1-L0):
`relayer` | `validator` | `deployer` | `bank` (unused) | `kathy` (only for stress e2e testing).

### Key naming convention
Keys have a specific ID format. `/alias/` prefix is used for all AWS KMS keys, for GCP it is omitted.
Hyperlane SDKs extensively use the key naming convention to reference the keys of relayers / validators
from different parts of the code by knowing only `context` / `environment` / `role` / `chainName`.

##### role = `relayer`
`(alias/)?<context>-<environment>-key-<chainName>-relayer`:

- `alias/hyperlane-test-key-goerli-relayer` (AWS KMS)
- `alias/hyperlane-mainnet2-key-arbitrum-relayer` (AWS KMS)
- `hyperlane-mainnet2-key-optimism-relayer` (non AWS)

##### role = `validator`
`(alias/)?<context>-<environment>-key-<chainName>-validator-<index>`:
- `alias/hyperlane-testnet2-key-alfajores-validator-0` (AWS KMS)
- `alias/hyperlane-testnet2-key-mumbai-validator-3` (AWS KMS)
- `hyperlane-mainnet2-key-optimism-validator-3` (non AWS)

##### role = `deployer`
`(alias/)?<context>-<environment>-key-deployer`:
- `alias/hyperlane-testnet2-key-deployer` (AWS KMS)
- `hyperlane-mainnet2-key-deployer` (non AWS)

### Key [Types](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/ed17ddc32f6d7300694556591f43fe3929f29e80/typescript/infra/src/agents/keys.ts#L13-L12)
- `BaseAgentKey { environment, role, chainName, address() }`
    - `BaseCloudAgentKey { ..., context(), identifier() }`
        - `ReadOnlyCloudAgentKey`
        - `CloudAgentKey { ..., index?, fetch(), createIfNotExists(), delete(), getSigner()  } `
            - `AgentAwsKey`
            - `AgentGCPKey`

### Key Funding Script
[fund-keys-from-deployer.ts](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/7250c1c14d2602030bf10bb27a4ec373fb3cd212/typescript/infra/scripts/funding/fund-keys-from-deployer.ts) is used to top up a relayer's balance.
This script is packaged to [Helm chart](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/ed17ddc32f6d7300694556591f43fe3929f29e80/typescript/infra/helm/key-funder/templates/cron-job.yaml#L2-L1) as a `CronJob`.

For each chain, there is a "bank" account with _enough_ funds. The job maintains the [desired balance](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/7250c1c14d2602030bf10bb27a4ec373fb3cd212/typescript/infra/scripts/funding/fund-keys-from-deployer.ts#L98-L97)
of the relayers wallets by periodically transferring funds from a chain's "bank" to the relayer. This is used to simplify programmatic creation/rotation of the relayer keys.
For example, if a new relayer is added, its AWS KMS key is automatically picked up by the job and started being topped up. 

The `CronJob`'s pod process is authorized to access the AWS KMS key of the "bank" accounts.

There are two ways to specify a list of relayers to be funded:
- using a JSON file containing `[ { address, id: <relayer key ID> } ]`  
  - The job process doesn't need AWS KMS authorization because the keys' addresses are given in the input.  
- using a "context" auto discovery — the job will find all relayers registered in this context, fetch their keys from AWS KMS and top them up.
  - The job process needs AWS KMS authorization to fetch the keys' addresses

> The job periodically withdraws a chain's `IntechainGasPaymaster` balance to the relay wallet.
> Khalani V0 deployment runs without gas policies, so we can disable this step with `skipIgpClaim = true` flag passed to the script.

> Hyperlane team uses two clouds: AWS and GCP. The destination chain's RPC URLs are stored as [GCP secrets](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/ed17ddc32f6d7300694556591f43fe3929f29e80/typescript/infra/src/config/chain.ts#L25).
> Khalani team wants to use only AWS, so we can patch that code.

> `fund-keys-from-deployer.ts` script publishes Prometheus metrics of the current balances of the relayers and banks — a good candidate to our Grafana dashboards 