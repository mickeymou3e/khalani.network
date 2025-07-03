import { HardhatUserConfig } from 'hardhat/types';
import ConfigMainnet from './src/config/zksync-mainnet.json';
import ConfigTestnet from './src/config/zksync-testnet.json';

import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

const builderConfig: HardhatUserConfig = {
  defaultNetwork: 'zksync-testnet',
  zksolc: {
    version: '1.3.8',
    compilerSource: 'binary',
    settings: {
      optimizer: {
        enabled: true,
        mode: 'z',
      },
      libraries: {
        'contracts/protocol/libraries/logic/ReserveLogic.sol': {
          ReserveLogic: '0xE56Dc0246e2Cd09160227b906447696ec150e52d',
        },
        'contracts/protocol/libraries/logic/GenericLogic.sol': {
          GenericLogic: '0x7ABD56679eF17C02F22d5FF2cf015458402a4205',
        },
        'contracts/protocol/libraries/logic/ValidationLogic.sol': {
          ValidationLogic: '0x28d4c312384Ee2888F9885Bd42Fdf5A1BE1Ef0e7',
        },
      },
    },
  },
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'istanbul',
    },
  },
  typechain: {
    outDir: 'src/typechain/zksync',
    target: 'ethers-v5',
  },
  networks: {
    'zksync-localhost': {
      url: 'http://localhost:3050',
      ethNetwork: 'http://localhost:8545',
      zksync: true,
    },
    ['zksync-mainnet']: {
      url: ConfigMainnet.rpcUrl,
      ethNetwork: 'mainnet',
      zksync: true,
    },
    ['zksync-testnet']: {
      url: ConfigTestnet.rpcUrl,
      ethNetwork: 'goerli',
      zksync: true,
    },
  },
};

export default builderConfig;
