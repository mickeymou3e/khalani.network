import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';
import ConfigMainnet from './src/config/godwoken-mainnet.json';
import ConfigTestnet from './src/config/godwoken-testnet.json';

import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-deploy';

dotenv.config();

const builderConfig: HardhatUserConfig = {
  defaultNetwork: 'godwoken-mainnet',
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'istanbul',
    },
  },
  typechain: {
    outDir: 'src/typechain/godwoken',
    target: 'ethers-v5',
  },
  namedAccounts: {
    deployer: {
      default: 0,
      godwoken: 0,
    },
  },
  networks: {
    ['godwoken-mainnet']: {
      chainId: Number(ConfigMainnet.chainId),
      url: ConfigMainnet.rpcUrl,
      throwOnCallFailures: true,
      accounts: [process.env.GODWOKEN_DEPLOYER as string],
    },
    ['godwoken-testnet']: {
      chainId: Number(ConfigTestnet.chainId),
      url: ConfigTestnet.rpcUrl,
      throwOnCallFailures: true,
      accounts: [process.env.GODWOKEN_DEPLOYER as string],
    },
  },
};

export default builderConfig;
