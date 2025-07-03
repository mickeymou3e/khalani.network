import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "hardhat-deploy";

import { HardhatUserConfig } from "hardhat/config";
import GodwokenMainnet from "./cli/config/environmentConfig/godwoken-mainnet.json";
import GodwokenTestnet from "./cli/config/environmentConfig/godwoken-testnet.json";
import MantleTestnet from "./cli/config/environmentConfig/mantle-testnet.json";

dotenv.config();

const builderConfig: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.19",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  typechain: {
    outDir: "src/contracts/godwoken",
    target: "ethers-v5",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  networks: {
    godwokenMainnet: {
      accounts: [process.env.GODWOKEN_MAINNET_DEPLOYER],
      chainId: Number(GodwokenMainnet.chainId),
      url: GodwokenMainnet.rpcUrl,
      throwOnCallFailures: true,
    },
    godwokenTestnet: {
      accounts: [process.env.GODWOKEN_TESTNET_DEPLOYER],
      chainId: Number(GodwokenTestnet.chainId),
      url: GodwokenTestnet.rpcUrl,
      throwOnCallFailures: true,
    },
    mantleTestnet: {
      accounts: [process.env.MANTLE_TESTNET_DEPLOYER],
      chainId: Number(MantleTestnet.chainId),
      url: MantleTestnet.rpcUrl,
      throwOnCallFailures: true,
    },
  },
};

export default builderConfig;
