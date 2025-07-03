import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    // Just run anvil.
    anvil: {
      url: "http://localhost:8545",
    },
    // Use: geth --dev --http --http.api eth,web3,net --dev.period 5
    geth: {
      url: "http://localhost:8545",
    },
    // Note: need to change the chain id to e.g. sepolia otherwise it won't work.
    axon: {
      url: "http://localhost:8000",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
  },
};

export default config;
