# Directions

These steps will allow you to quickly spin up a multichain network locally, where each chain is communicating via hyperlane

## Pre-requisites

1. **SSH Authentication for GitHub:**  
   Some submodules use SSH URLs (e.g., `git@github.com:...`). To ensure you can clone these repositories, set up SSH authentication:

   - **Generate an SSH Key (if needed):**
     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ```
   - **Start the SSH Agent and Add Your Key:**
     ```bash
     eval "$(ssh-agent -s)"
     ssh-add ~/.ssh/id_ed25519
     ```
   - **Add Your Public Key to GitHub:**  
     Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
     Then, go to GitHub → Settings → SSH and GPG keys → New SSH key, give it a descriptive title, and paste the key.

2. Update all submodules in your repository to the latest commits on the branches specified in .gitmodules

````# 2.1. Make sure your local config is in sync with .gitmodules
git submodule sync --recursive

# 2.2. Initialize any submodules that aren’t initialized yet
git submodule update --init --recursive

# 2.3. Update all submodules to the branches specified in .gitmodules
git submodule update --remote --merge --recursive```

3. Run `make deps` to check dependencies.

4. Run
 ```bash
 git submodule update --init --recursive
````

Make sure `arcadia-core-contracts` is checked out at the `chore/move-balances-to-output-intent` branch.

## Run chains and deploy hyperlane and permit2

1. `make registry`
2. Choose one and only one of the following options:

- Open a new terminal and run `make start-hub` to start the hub chain in foreground
- In the same terminal run `make start-hub-daemon` to run the hub chain in background

3. Choose one and only one of the following options:

- Open a new terminal and `make start-spoke` to start a spoke chain in foreground
- Set variable `NUM_SPOKE_CHAINS` in `.dev.env`. Then in the same terminal run `make start-spoke-daemons` to start $n=$`NUM_SPOKE_CHAINS` spoke chains in background. The spoke chain ids will be `31338 + i` for integers `i` in $[1, n]$. The ports will be `8546 + i` for integers `i` in $[1, n]$.

4. `make deploy-hyperlane`
5. `make deploy-permit2` (change the salt in `external/permit2/script/DeployPermit2.s.sol` if you run into `EvmError: CreateCollision`)

If in step 2 or 3 you choose to run the hub or spoke chains in background, you can run `make stop-all-daemons` to stop the hub and spoke chains.

#### Caveat

Because hyperlane deployment is the most time consuming step, if you're running the chains in background (daemons), we recommend running

```bash
docker commit <CONTAINER_ID> <IMAGE_NAME_TO_SAVE>
```

on each hub and spoke chain container, to save a local snapshot of all hub and spoke chains after deploying hyperlane and permit2 contracts. When you need to reset chain states in later steps, you won't have to rerun everything and wait for hyperlane deployment again. Instead, you can just run

```bash
docker --rm -d -p 8545:8545 --net arcadia-local-network --name arcadialocal  <SAVED_IMAGE_NAME_FOR_HUB_CHAIN>
docker --rm -d -p 8547:8547 --net arcadia-local-network --name spokelocal1  <SAVED_IMAGE_NAME_FOR_SPOKE_CHAIN_1>
docker --rm -d -p 8548:8548 --net arcadia-local-network --name spokelocal2  <SAVED_IMAGE_NAME_FOR_SPOKE_CHAIN_2>
...
```

on each hub and spoke chain container, to restore the local snapshot.

## Update hyperlane mailbox adresses

Run `make rewrite-hyperlane-addresses` to update the `.dev.env` and `.core.hub.env` files with the correct mailbox address automatically.

It's unlikely you'll need to change any of the other environtment variables' values.

## Deploy AIP contracts

For now we have to deploy necessary contracts individually.

1. `make hub-core`
2. `make spoke-core`
3. `make hub-bridge`
4. `make spoke-bridge`
5. `make hub-connect`
6. `make spoke-connect`
7. `make spoke-bridge-event-registration`
8. `make hub-bridge-event-registration`
9. For spoke chain 31339:
   9.1. Get EventProver contract address from `SpokeConnectProverToVerifier.s.sol` broadcast folder
   9.2. Update `EVENT_PROVER` with this address in `.dev.env`
   9.3. Run `make hub-connect-remote-prover`

   Repeat the same three steps for spoke chain 31340:
   9.1. Get EventProver contract address from `SpokeConnectProverToVerifier.s.sol` broadcast folder `run-latest`.json file
   9.2. Update `EVENT_PROVER` with this address in `.dev.env`
   9.3. Run `make hub-connect-remote-prover`

10. For spoke chain 31339:
    10.1. Get EventProver contract address from `HubConnectProverToVerifier.s.sol` broadcast folder - the second JSON file above the 'run-latest.json' file with `31339` in arguments
    10.2. Update `EVENT_PROVER` with this address in `.dev.env`
    10.3. Run `make spoke-connect-remote-prover`

    Repeat the same three steps for spoke chain 31340:
    10.1. Get EventProver contract address from `HubConnectProverToVerifier.s.sol` broadcast folder `run-latest`.json file
    10.2. Update `EVENT_PROVER` with this address in `.dev.env`
    10.3. Run `spoke hub-connect-remote-prover`

11. `make spoke-set-default-gas`
12. `make hub-set-default-gas`
13. `make add-spoke-token`
14. `make add-m-token-to-hub`

## Deploy Hyperlane agents (validators and relayers)

Before running these commands, make sure you have installed eth_utils by running `pip install eth_utils` and pycryptodome `pip install pycryptodome`

1. `make hyperlane-agent-configs`
2. `make setup-validator-signatures-all`
3. `make rewrite-hyperlane-agent-configs`
4. `make run-validator-hub` (foreground) or `make run-validator-hub-daemon` (background)
5. `make run-validator-spoke` (foreground) or `make run-validator-spoke-daemons` (background)
6. `make run-relayer-hub` (foreground) or `make run-relayer-hub-daemon` (background)
7. `make run-relayer-spoke` (foreground) or `make run-relayer-spoke-daemons` (background)

To check if relayers are working, run the `hyperlane send message --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` command and choose source/destination chain in the CLI

## Update AIP addresses

In order to run offchain components (medusa, refunder-agent, sdk, etc.), you need to update the AIP addresses in each of their config files.
Before running these commands, make sure you have installed toml by running `pip install toml`

```bash
make rewrite-aip-addresses
```

## Build medusa and solver

Only need to run this when you change the medusa or solver code, or when you first clone the repo.

```bash
make build-medusa
```

To build the docker image, run

```bash
make build-medusa-image
```

## Build refunder

Refunder is deprecated and needs updates as of Apr. 17, 2025

~~Only need to run this when you change the refunder-agent code, or when you first clone the repo.~~

```bash
make build-refunder
```

## Run medusa

Make sure submodule `external/medusa-api-server` is checked out at the `dev` branch.
In foreground (open a new terminal):

```bash
make start-medusa
```

In background:

```bash
make start-medusa-daemon
```

To stop background medusa:

```bash
make stop-medusa-daemon
```

## Run solver

First you need add solver address to medusa so that medusa would allow solver to connect. The default solver address is `0x63fac9201494f0bd17b9892b9fae4d52fe3bd377` (private key `0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f`). You don't need to do this by hand. Just run

```bash
make register-solver
```

Then to start solver,

in foreground (open a new terminal):

```bash
make start-solver
```

or in background:

```bash
make start-solver-daemon
```

To stop background solver:

```bash
make stop-solver-daemon
```

## Run refund agent

Deprecated Apr 17, 2025

~~In foreground (open a new terminal):~~

```bash
make start-refunder
```

~~In background:~~

```bash
make start-refunder-daemon
```

~~To stop background refund agent:~~

```bash
make stop-refunder-daemon
```

## Run SDK e2e tests

If you are familiar with TypeScript, you can modify the e2e test parameters by navigating to `external/khalani-sdk/src/e2e/dev-env`.
If not, you can run the tests with the default configuration, which provides liquidity from Spoke1 to Spoke2, and bridges 10 default spoke tokens from Spoke2 to Spoke1.

```bash
make run-provide-liquidity
```

```bash
make run-bridge
```
