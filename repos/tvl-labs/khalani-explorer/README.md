# Khalani Explorer

## Overview

This application interfaces with an existing deployed subgraph on the Khalani chain, retrieving a list of intent transactions along with their details. It is specifically designed to handle three transaction statuses: 'Pending', 'Completed', and 'Error'. Queries to the Khalani subgraph are executed using Apollo Client, ensuring efficient and reliable data management.
Additionally, the user interface is built using the `@tvl-labs/khalani-ui` library, which provides a suite of UI components.

## Scripts

The `package.json` includes several scripts for common tasks:

- `yarn dev`: Launches the application in development mode with hot module replacement, making it easier to develop and debug.
- `yarn build`: Bundles the application for production using the production configuration.
- `yarn typecheck`: Runs TypeScript compiler for type checking, enhancing code quality and maintainability.
- `yarn lint`: Lints the codebase, automatically fixing issues where possible.
- `yarn rebuild`: Forces a fresh install of dependencies and resolves any issues with `@tvl-labs/khalani-ui` dependencies.

## Subgraphs

Link to the utilized Khalani subgraph: 'https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/intents-khalanitestnet', and to the repository: 'https://github.com/tvl-labs/khalani-subgraph'.

## Deployment

The current deployment can be found at 'https://cross-chain-explorer.staging.khalani.network/explorer'. A GitHub workflow handles the deployment process after a pull request is submitted to the master branch
