## Khalani off-chain SDK

Discussion: https://github.com/orgs/tvl-labs/discussions/66

Tasks: https://github.com/tvl-labs/khalani-sdk/issues

## Development

- This repository has dependencies on private NPM repositories. Please set the npmAuthToken value in the .yarnrc.yml file.

```shell
yarn
yarn build
yarn test
```

## Network-Specific Publishing

This repository now supports automatic configuration for mainnet or testnet releases. During the release process, a GitHub Actions workflow:
• Detects the network based on branch/tag names (if the ref contains mainnet, it is treated as a mainnet release; otherwise, testnet).
• Compiles and runs a pre‑publish script (located at src/scripts/updatePackage.ts) that updates the package.json metadata—changing the package name to either @tvl-labs/sdk-mainnet or @tvl-labs/sdk-testnet based on the detected network.

## Post intent to medusa

1. Install all dependencies: `yarn`
2. Navigate to `src/e2e/intents/provideLiquidity.e2e.test.ts` and adjust the parameters if necessary.
3. Provide liquidity intent `yarn test -- provideLiquidity.e2e --testPathIgnorePatterns dist`
4. Navigate to `src/e2e/intents/bridge.e2e.test.ts` and adjust the parameters if necessary
5. Bridge intent `yarn test -- bridge.e2e --testPathIgnorePatterns dist`

## Publish the SDK package locally, which is useful for local development

### In this repository

1. Install Verdaccio globally: `yarn global add verdaccio`
2. Start Verdaccio in a separate terminal: `verdaccio`
3. Obtain the Verdaccio server URL, which is typically: `http://localhost:4873/`
4. Run `./verdaccio-publish.sh` script.
   The script may ask you for username/password — enter any.

The script will publish `@tvl-labs/sdk@0.1.1-snapshot` to local registry.

### In the dependent repositories

1. Update `.npmrc`:

```
@tvl-labs:registry=http://localhost:4873/
```

2. Update `package.json` dependency on `@tvl-labs/sdk`:

```
"dependencies": {
   "@tvl-labs/sdk": "0.1.1-snapshot"
}
```

3. Run `yarn install`
