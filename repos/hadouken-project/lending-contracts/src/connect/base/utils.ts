import contractsGodwokenMainnet from '../../deployedContracts/deployedContracts.godwoken-mainnet.json';
import contractsGodwokenTestnet from '../../deployedContracts/deployedContracts.godwoken-testnet.json';
import contractsMantleMainnet from '../../deployedContracts/deployedContracts.mantle-mainnet.json';
import contractsMantleTestnet from '../../deployedContracts/deployedContracts.mantle-testnet.json';
import { BaseChain } from '../../types';
import { Config, Environments, IContractsConfig } from '../../types/types';

import contractsZksyncMainnet from '../../deployedContracts/deployedContracts.zksync-mainnet.json';
import contractsZksyncTestnet from '../../deployedContracts/deployedContracts.zksync-testnet.json';

import configGodwokenMainnet from '../../config/godwoken-mainnet.json';
import configGodwokenTestnet from '../../config/godwoken-testnet.json';

import configMantleMainnet from '../../config/mantle-mainnet.json';
import configMantleTestnet from '../../config/mantle-testnet.json';
import configZksyncMainnet from '../../config/zksync-mainnet.json';
import configZksyncTestnet from '../../config/zksync-testnet.json';

import { getConfigFromNetworkName, getContractsConfigFromNetworkName } from '../../filesManager';

export const getContractsConfigStatic = (
  environment: Environments,
  network: BaseChain | 'zksync',
  runTime = false
): IContractsConfig => {
  if (runTime) {
    return getContractsConfigFromNetworkName(`${network}-${environment}`);
  }

  if (network === 'godwoken') {
    switch (environment) {
      case 'mainnet':
        return contractsGodwokenMainnet as IContractsConfig;
      case 'testnet':
        return contractsGodwokenTestnet as IContractsConfig;

      default:
        console.log(
          `(getContractsConfigStatic) - Unknown environment: ${environment} - Using local contracts config file`
        );
        return contractsGodwokenMainnet as IContractsConfig;
    }
  } else if (network === 'mantle') {
    switch (environment) {
      case 'mainnet':
        return contractsMantleMainnet as IContractsConfig;
      case 'testnet':
        return contractsMantleTestnet as IContractsConfig;

      default:
        console.log(
          `(getContractsConfigStatic) - Unknown environment: ${environment} - Using local contracts config file`
        );
        return contractsMantleMainnet as IContractsConfig;
    }
  } else if (network === 'zksync') {
    switch (environment) {
      case 'mainnet':
        return contractsZksyncMainnet as IContractsConfig;
      case 'testnet':
        return contractsZksyncTestnet as IContractsConfig;
      default:
        console.log(
          `(getConfigStatic) - Unknown environment: ${environment} - Using local config file`
        );
        return contractsZksyncMainnet as IContractsConfig;
    }
  }

  throw Error(`wrong network for getContractsConfigStatic: ${network}`);
};

export const getConfigStatic = (
  environment: Environments,
  network: BaseChain,
  runTime = false
): Config => {
  if (runTime) {
    return getConfigFromNetworkName(`${network}-${environment}`, process.env.CLI_DEPLOYER);
  }

  if (network === 'godwoken') {
    switch (environment) {
      case 'mainnet':
        return configGodwokenMainnet as Config;
      case 'testnet':
        return configGodwokenTestnet as Config;
      default:
        console.log(
          `(getConfigStatic) - Unknown environment: ${environment} - Using local config file`
        );
        return configGodwokenMainnet as Config;
    }
  } else if (network === 'mantle') {
    switch (environment) {
      case 'mainnet':
        return configMantleMainnet as Config;
      case 'testnet':
        return configMantleTestnet as Config;
      default:
        console.log(
          `(getConfigStatic) - Unknown environment: ${environment} - Using local config file`
        );
        return configMantleMainnet as Config;
    }
  } else if (network === 'zksync') {
    switch (environment) {
      case 'mainnet':
        return configZksyncMainnet as Config;
      case 'testnet':
        return configZksyncTestnet as Config;
      default:
        console.log(
          `(getConfigStatic) - Unknown environment: ${environment} - Using local config file`
        );
        return configZksyncMainnet as Config;
    }
  }

  throw Error(`wrong network for getConfigStatic: ${network}`);
};
