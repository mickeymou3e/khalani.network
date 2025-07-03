# Fund wallet script

A script designed to send funds to specified addresses controlled by KMS.

### Implementation

The main function `sendFunds` has six required parameters: `recipient`, `rpcUrl`, `chainID`, `awsRegion`, `kmsKeyId` and `amount`.
The `chainID` parameter should comply with the `ID` property specified in the `chains.json` file. The complete list of chains:

- `KHALANITESTNET`
- `SEPOLIA`
- `FUJI`
- `MUMBAI`
- `BSCTESTNET`
- `ARBITRUMGOERLI`
- `OPTIMISMGOERLI`
- `GODWOKENTESTNET`

The first step during script execution is to create a new KMS signer and then use it to create a new EVM instance.

### Usage

The script is deployed via GitHub Packages, and the main function `sendFunds` can be imported from `fund-wallet-script` package.
