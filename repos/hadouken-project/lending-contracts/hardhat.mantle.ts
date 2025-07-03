import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';
import ConfigTestnet from './src/config/mantle-testnet.json';

import '@typechain/hardhat';
import 'hardhat-deploy';
//
import '@nomiclabs/hardhat-ethers';

dotenv.config();

const builderConfig: HardhatUserConfig = {
  defaultNetwork: 'mantle-testnet',
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'istanbul',
    },
  },
  typechain: {
    outDir: 'src/typechain/mantle',
    target: 'ethers-v5',
  },
  namedAccounts: {
    deployer: {
      default: 0,
      godwoken: 0,
    },
  },
  networks: {
    ['mantle-mainnet']: {
      chainId: Number(ConfigTestnet.chainId),
      url: ConfigTestnet.rpcUrl,
      throwOnCallFailures: true,
      accounts: [process.env.MANTLE_DEPLOYER as string],
    },
    ['mantle-testnet']: {
      chainId: Number(ConfigTestnet.chainId),
      url: ConfigTestnet.rpcUrl,
      throwOnCallFailures: true,

      accounts: [process.env.MANTLE_DEPLOYER as string],
    },
  },
};

export default builderConfig;
