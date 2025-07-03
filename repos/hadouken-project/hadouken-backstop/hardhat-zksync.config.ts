import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import ZksyncTestnet from "./cli/config/environmentConfig/zksync-testnet.json";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";

dotenv.config();

const builderConfig: HardhatUserConfig = {
  defaultNetwork: "zksyncTestnet",
  zksolc: {
    version: "1.3.13",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
        mode: "z",
      },
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "istanbul",
    },
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  typechain: {
    outDir: "src/contracts/zksync",
    target: "ethers-v5",
  },
  networks: {
    zksyncTestnet: {
      accounts: [process.env.ZKSYNC_TESTNET_DEPLOYER],
      chainId: Number(ZksyncTestnet.chainId),
      url: ZksyncTestnet.rpcUrl,
      throwOnCallFailures: true,
      ethNetwork: "goerli",
      zksync: true,
    },
  },
};

export default builderConfig;
