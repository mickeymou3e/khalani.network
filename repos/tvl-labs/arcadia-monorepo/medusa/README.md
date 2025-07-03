# Medusa

Medusa is an RFQ-as-a-service system that enables solver-solver collaboration and acts as an off-chain, high performance cache of the on-chain multi-dimensional, declarative orderbook called the "Intent Book".

For Medusa architecture, see the [docs](docs/architecture.md)

## How to Run

To run medusa server, you need to have [clang](https://clang.llvm.org/), [rust-lang](https://www.rust-lang.org/) and [foundry](https://book.getfoundry.sh/getting-started/installation) installed.

### Init Submodules
```bash
git submodule update --init --recursive
```

### Build Smart Contracts
```bash
cd contracts/arcadia-core-contracts
forge build
```

### Run Medusa API server
```bash
cargo build --release
./target/release/medusa-api-server config.toml
```

## Project Structure

### Core Components

- **api**: HTTP and WebSocket server exposing the Medusa API functionality
- **apm**: Application Performance Monitoring for gathering metrics
- **config**: Configuration handling and management
- **event**: Event handling system
- **key-manager**: Secure key management and AWS integration
- **solver**: Intent matching and solving logic
- **storage**: Persistent data storage using RocksDB
- **tx-worker**: Blockchain transaction processing
- **types**: Common types shared across the system

### Executables

- **medusa**: Main API server (`make build-service`)
- **arcadia-solver**: Intent solver (`make build-solver`)

### Build Commands

See the `Makefile` for available build commands:
```bash
make build-all      # Build all components in release mode
make build-service  # Build just the main service
make build-solver   # Build just the solver
make test           # Run all tests
make fmt            # Format code
make clippy         # Check clippy
```

### Run tests with postgres

To run tests with postgresql, first start postgresql with e.g. docker

```bash
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
```

Then run tests with the `test-with-postgres` features:

```bash
cargo test -p medusa-storage -p medusa-api --features test-with-postgres
```

## Instructions for local environment

The addresses of the deployed contracts are deterministic IF the deployer address is the same here. So, you do not need to modify the test config files.

First, start anvil: `anvil  -b 10 --block-base-fee-per-gas 0`

Then, deploy the contracts:
1. `cd contracts/arcadia-core-contracts`
2. `MEDUSA_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script ./scripts/Deployment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast`
3. Then, mint some MTokens: `MTOKEN_MANAGER=0xa513e6e4b8f2a923d98304ec87f64353c4d5c853 MTOKEN_ADMIN_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 MTOKEN_USER=0x70997970C51812dc3A010C7d01b50e0d17dc79C8 MTOKEN_REGISTRY=0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6 forge script ./scripts/DeployAndMintMToken.s.sol --rpc-url http://127.0.0.1:8545 --broadcast` 
    - Note: the mtoken admin key is usually just the same as the medusa admin key, especially in dev mode to keep things simple. 
usually, this is also just the FIRST of the pre-loaded, deterministic anvil accounts
    - Note: the mtoken user is usually just the SECOND pre-loaded anvil account

4. Copy the addresses logged in the above two script outputs to the relevant fields in `test.config.toml`
4. Then, start medusa `cargo run --bin medusa test.config.toml`
5. Then, start solver: `cargo run -p arcadia-solver ./crates/solver/test.config.toml`

6. Then, start user simulator: `USER_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d cargo run -p arcadia-user-simulator ./path/to/test.config.toml`
    - Note: The user key should be the key associated with the user address you used when running `DeployAndMintToken.s.sol`
    - Note: The two arguments passed to user simulator are the mtoken addresses. The first address is the address of the mtoken that you have, the second is the address of the mtoken that you want to swap for. The first address should be the address of MockToken, while the second address should be MockToken2. This is because in the DeployAndMintMTokens script, only MockToken was minted to the given user address.