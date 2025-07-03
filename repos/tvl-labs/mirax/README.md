# Mirax

Mirax is an intents resolve chain with cell model and validity verification VM.

## Run Testnet

### Build From Source
```shell
cargo build --release
```

### Run Mirax Network
```shell
./target/release/mirax init -c tests/chain/config.toml -s tests/chain/spec.toml
./target/release/mirax run -c tests/chain/config.toml -s tests/chain/spec.toml
```
