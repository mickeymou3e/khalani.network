import contractsZkSyncLocalhost from '../deployedContracts/deployedContracts.zksync-localhost.json';
import contractsZkSyncMainnet from '../deployedContracts/deployedContracts.zksync-mainnet.json';
import contractsZkSyncTestnet from '../deployedContracts/deployedContracts.zksync-testnet.json';
import { Config, Environments, IContractsConfig } from '../types/types';

import configZkSyncLocalhost from '../config/zksync-localhost.json';
import configZkSyncMainnet from '../config/zksync-mainnet.json';
import configZkSyncTestnet from '../config/zksync-testnet.json';

import { getConfigFromNetworkName, getContractsConfigFromNetworkName } from '../filesManager';

export const getZkSyncContractsConfigStatic = (
  environment: Environments,
  runTime = false
): IContractsConfig => {
  if (runTime) {
    return getContractsConfigFromNetworkName(`zksync-${environment}`);
  }
  switch (environment) {
    case 'mainnet':
      return contractsZkSyncMainnet as IContractsConfig;
    case 'testnet':
      return contractsZkSyncTestnet as IContractsConfig;
    case 'localhost':
      return contractsZkSyncLocalhost as IContractsConfig;
    default:
      throw Error(`wrong environment for getZkSyncContractsConfigStatic: ${environment}`);
  }
};

export const getZkSyncConfigStatic = (environment: Environments, runTime = false): Config => {
  if (runTime) {
    return getConfigFromNetworkName(`zksync-${environment}`, process.env.CLI_DEPLOYER);
  }

  switch (environment) {
    case 'mainnet':
      return configZkSyncMainnet as Config;
    case 'testnet':
      return configZkSyncTestnet as Config;
    case 'localhost':
      return configZkSyncLocalhost as Config;
    default:
      throw Error(`wrong environment for getZkSyncConfigStatic: ${environment}`);
  }
};
