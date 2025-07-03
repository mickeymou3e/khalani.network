### Overview

Khalani solver off-chain bot built with [Artemis](https://github.com/paradigmxyz/artemis).

See the [overview](https://github.com/orgs/tvl-labs/discussions/109).

See the [demo](https://drive.google.com/file/d/1k9KUhbEGDbrSYUzYVKo3bpLgOmhRihFR/view?usp=drive_link).

### Prepare RPC environment variables

```shell
export SEPOLIA_RPC_URL=<sepolia RPC URL>
export FUJI_RPC_URL=<fuji RPC URL>

# For example
export SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com;
export FUJI_RPC_URL=https://avalanche-fuji-c-chain.publicnode.com;
```

### Prepare private keys

Retrieve private keys from the AWS Secrets Manager using the following command:

```
aws secretsmanager list-secrets khalani/testnet/solver-connection-urls
```

```
export MATCHMAKER_PRIVATE_KEY=<matchmaker agent private key>
export SETTLER_PRIVATE_KEY=<settler agent private key>
export SPOKE_CHAIN_CALLER_PRIVATE_KEY=<spoke chain caller agent private key>
```

### Starting the Matchmaker agent

```shell
RUST_LOG="debug,hyper=info" cargo run --bin intentbook-matchmaker -- --config-file ~/khalani-solver/config/.config.json --private-key $MATCHMAKER_PRIVATE_KEY
```

### Starting the Spoke Chain Caller agent

```shell
RUST_LOG="debug,hyper=info" cargo run --bin spoke-chain-caller -- --config-file ~/khalani-solver/config/.config.json --private-key $SPOKE_CHAIN_CALLER_PRIVATE_KEY
```

### Starting the Settler agent

```shell
RUST_LOG="debug,hyper=info" cargo run --bin swap-intent-settler -- --config-file ~/khalani-solver/config/.config.json --private-key $SETTLER_PRIVATE_KEY
```

### Testing end-to-end

Run this [test](https://github.com/tvl-labs/khalani-sdk/blob/main/src/e2e/intents/intents.e2e.test.ts#L9) from the Khalani SDK.

### Working with Solidity Contract Bindings

If you need to update bindings (`crates/bindings-khalani`) for the solidity contracts, make sure the `khalani-protocol` repository is checked out at `../khalani-protocol` (or specify the `CONTRACT_DIR` environment variable to the directory where it's checked out), and run

```shell
make generate-bindings
```

If you need to generate bindings for more contracts, edit the `Makefile` and modify `CONTRACTS`.

### Using the local dev env

- Copy `config/local.toml.example` to `config/local.toml` and edit the RPC urls.
- Start the local dev env:

```shell
cargo run --release --bin local-dev-env
```

- Now you can test the agents with the locally forked anvil nodes, just use `config/with-local.json` as the config file, e.g.

```shell
RUST_LOG="debug,hyper=info" cargo run --bin swap-intent-settler -- --config-file config/with-local.json --private-key $SETTLER_PRIVATE_KEY
```
