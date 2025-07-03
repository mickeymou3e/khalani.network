# Fund wallet script

A script designed to send funds to specified addresses controlled by KMS.

### Implementation

The main function `sendFundsTo` has four required parameters: `chain`, `amount`, `kmsSigner` and `recipient`.
The `chain` parameter should comply with the objects specified in the `chains.json` file. The complete list of chains:

- `KHALANITESTNET`
- `SEPOLIA`
- `FUJI`
- `MUMBAI`
- `BSCTESTNET`
- `ARBITRUMGOERLI`
- `OPTIMISMGOERLI`
- `GODWOKENTESTNET`

The first step during script execution is to create a new EVM instance.

### Usage

The script is deployed via GitHub Packages, and all exported items from the `index.ts` file can be imported from the `fund-wallet-script` package.
