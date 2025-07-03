Before running, make sure you have initialized all submodules. Go to the root directory of the monorepo and run

```bash
git submodule update --init --recursive
```

# Arcadia Local Dev Net

To start, ensure you are in the subdirectory `hyperlane-dev-env`.

## Three simple steps

1. Install dependencies
2. Copy the environment file
3. Start the network

### Install dependencies

Install the dependencies with `yarn install`.

### Copy the Environment File

Then, copy the `.env.example` file into a new `.env` file. Replace the FORK_URL with a valid alchemy API URL. Ensure that the Alchemy RPC URL is for Ethereum Sepolia.

### Run the Network

Start the network with `node multi-node.mjs`. It will take a minute or two for the whole system to spin up. Once the output shows the relayer is running, or once the output is simply printing eth RPC method names, you know that the network is fully deployed and configured.

Here is a snippet of what the output looks like once the process is finished:

```shell
Starting relayer ...
eth_blockNumber
eth_blockNumber
eth_blockNumber
eth_getLogs
eth_getLogs
eth_getLogs
eth_blockNumber
eth_blockNumber
eth_blockNumber
```

## Running Medusa Locally

To start medusa, open a new terminal tab, stay in the `hyperlane-dev-env` subdirectory, run

```bash
node run-medusa.mjs
```

## Running Solver Locally

To start solver, open a new terminal tab, stay in the `hyperlane-dev-env` subdirectory, run

```bash
node run-solver.mjs
```

## Running E2E tests

You can run the E2E tests from either the `hyperlane-dev-env` subdirectory or the `sdk-runner` directory.
If you're running from the `hyperlane-dev-env` directory, use:

```bash
npm run e2e
```
-----
# Arcadia Local Devnet in Container 
1. go to `dev-env/`
2. run
```bash
docker build -t arcadia-e2e  -f Dockerfile .. 
```
3. run 
```bash
docker run arcadia-e2e 
```
*TODO*: show test results better