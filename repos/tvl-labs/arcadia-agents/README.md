# Refunder Agent

This is a simple agent that
1. polls the medusa api for hyperlane errors. When a hub $\implies$ spoke hyperlane error occurs, the refunder will call the hub `MTokenManager` contract to refund the user with mtokens.
2. polls the spoke chain rpc urls to check for deposit events. When a deposit event is detected, check the hub contract for a corresponding mtoken mint event. If one is not found, refund the user with the spoke chain tokens.

## To run

```bash
aws sso login
cargo run --release config.toml chain_config.toml
```

## Configs

`config.toml` contains the refunder's private key (`dev` mode only) and the aws secret manager information (for testnet and mainnet). To run in different modes, change the `mode` field in this config file.

`chain_config.toml` contains the chain config for the hub and spoke chains. Make sure the `arcadia_rpc_url`, `arcadia_chain_id` fields and all hub and spoke contract addresses are correct.

## Deployment

The github action workflow will build the docker image and push it to the ghcr.io registry. To pull and run (with `sudo` if needed),

```bash
docker compose pull && docker compose up -d
```


