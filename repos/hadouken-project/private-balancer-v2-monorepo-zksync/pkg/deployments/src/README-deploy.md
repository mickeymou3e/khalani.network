### Steps to Deploy Balancer Core Contracts:

1. Begin by compiling the contracts using the command `yarn build` in the root directory.

2. Deploy the contracts in the following order, using the appropriate deploy script:

   - AddressBalances (pkg/solidity-utils): Run `yarn hardhat deploy-zksync`.

   - Authorizer (pkg/liquidity-mining): Run `yarn hardhat deploy-zksync`.

   - Vault (pkg/vault): Run `yarn hardhat deploy-zksync`.

   - BalancerHelpers (pkg/standalone-utils): Run `1_deploy.ts` using the command `yarn hardhat deploy-zksync --script 1_deploy.ts`.

   - BalancerQueries (pkg/standalone-utils): Run `2_deploy.ts` with the command `yarn hardhat deploy-zksync --script 2_deploy.ts`.

   - ProtocolFeePercentagesProvider (pkg/standalone-utils): Run `3_deploy.ts` with the command `yarn hardhat deploy-zksync --script 3_deploy.ts`.

   - BatchRelayerLibrary (pkg/standalone-utils): Run `4_deploy.ts` using the command `yarn hardhat deploy-zksync --script 4_deploy.ts`.

   - AaveLinearPoolFactory (pkg/pool-linear): Run `1_deploy.ts` with the command `yarn hardhat deploy-zksync --script 1_deploy.ts`.

   - ComposableStablePoolFactory (pkg/pool-stable): Run `yarn hardhat deploy-zksync`.

   - WeightedPoolFactory (pkg/pool-weighted): Run `yarn hardhat deploy-zksync`.

These steps ensure the correct order of deployment for the Balancer core contracts.

### Deploying a Static Token using CLI

To deploy a static token using the (CLI), follow these steps:

1. Run the command `yarn cli:zksync-testnet` or `yarn cli:zksync-mainnet` to access the CLI in the environment.

2. Select `StaticAToken` option from the CLI menu.

3. Select `deploy` function

4. Provide the necessary information to deploy the token:

   - `Token Name`: Enter the desired name for the token.

   - `Token Symbol`: Specify the symbol for the token.

   - `Lending Pool Address (Proxy)`: Input the address of the lending pool (proxy) to connect the token with the lending functionality.

   - `Aave Linear Token`: Enter the necessary details for deploying the Aave Linear Token.

Upon executing the deployment command, the static token will be deployed with the provided parameters.

### Deploying Pools

To deploy pools of different types, follow the steps outlined below:

# Weighted Pool

1. Run the command `yarn cli:zksync-testnet` or `yarn cli:zksync-testnet` to access the CLI in the environment.

2. Select the "pools" option from the menu.

3. Choose "Weighted" to deploy a weighted pool.

4. Select the "factory" option and proceed to create a new pool.

5. Make sure to choose the correct template for the weighted pool and ensure that the template has the appropriate parameters set.

# Linear Pool

1. Access the CLI by running `yarn cli:zksync-testnet` or `yarn cli:zksync-testnet` to access the CLI in the environment.

2. From the menu, select the "pools" option.

3. Choose "Linear" to deploy a linear pool.

4. Select the "factory" option and create a new pool.

5. Ensure that you select the correct template for the linear pool and verify that the template has the required parameters.

# ComposableStable Pool

1. Open the CLI by executing `yarn cli:zksync-testnet` or `yarn cli:zksync-testnet` to access the CLI in the environment.

2. Select the "pools" option from the menu.

3. Choose "ComposableStable" to deploy a composable stable pool.

4. Select the "factory" option and create a new pool.

5. Select the template for the composable stable pool and verify that the template has the necessary parameters set correctly.
