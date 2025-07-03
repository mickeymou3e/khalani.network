import { BigNumber, ContractTransaction, providers } from 'ethers';
import path from 'path';
import { connectGodwoken, connectMantle, connectZkSync } from './connect';

import { getConfigStatic, getContractsConfigStatic } from './connect/base/utils';
import { isGodwokenNetwork, isMantleNetwork, isZkSyncNetwork } from './network';
import { BaseChain } from './types';
import { Config, Environments, IContractsConfig, Network } from './types/types';

import {
  getZkSyncConfigStatic,
  getZkSyncContractsConfigStatic,
  getProvider as getZksyncProvider,
  getWebsocketProvider as getZksyncWebsocketProvider,
} from './zksync';

const CHAIN_ID_TO_NETWORK_NAME: { [key: string]: BaseChain | undefined } = {
  [Network.MantleMainnet]: 'mantle',
  [Network.MantleTestnet]: 'mantle',

  [Network.Godwoken]: 'godwoken',
  [Network.GodwokenTestnet]: 'godwoken',
  [Network.GodwokenMainnetV1]: 'godwoken',
  [Network.GodwokenDevnetV1]: 'godwoken',
  [Network.GodwokenTestnetV1]: 'godwoken',
  [Network.GodwokenTestnetV1_1]: 'godwoken',
};

export const waitForTx = async (tx: ContractTransaction) => await tx.wait();

export enum LendingContracts {
  ERC20Mint = 'ERC20_test',
  Registry = 'LendingPoolAddressesProviderRegistry',
  AddressProvider = 'LendingPoolAddressesProvider',
  LendingPool = 'LendingPool',
  Configurator = 'LendingPoolConfigurator',
  LibraryReserveLogic = 'ReserveLogic',
  LibraryGenericLogic = 'GenericLogic',
  LibraryValidationLogic = 'ValidationLogic',
  AToken = 'AToken',
  ATokensAndRatesHelper = 'ATokensAndRatesHelper',
  StableAndVariableTokensHelper = 'StableAndVariableTokensHelper',
  StableDebtToken = 'StableDebtToken',
  VariableDebtToken = 'VariableDebtToken',
  StdReference = 'StdReference',
  DIAOracleV2 = 'DIAOracleV2',
  OracleBandProvider = 'BandOracleProvider',
  DIAOracleProvider = 'DIAOracleProvider',
  HadoukenOracle = 'HadoukenOracle',
  LendingRateOracle = 'LendingRateOracle',
  DataProvider = 'AaveProtocolDataProvider',
  RateStrategy = 'DefaultReserveInterestRateStrategy',
  CollateralManager = 'LendingPoolCollateralManager',
  HadoukenCollector = 'HadoukenCollector',
  HadoukenCollectorV2 = 'HadoukenCollectorV2',
  UserBalances = 'UserBalances',
  UiPoolDataProvider = 'UiPoolDataProvider',
  InitializableAdminUpgradeabilityProxy = 'InitializableAdminUpgradeabilityProxy',
  TestBProtocol = 'TestBProtocol',
  WETHGateway = 'WETHGateway',
}

export const getDeploymentDataPath = (contractPath: string, network: string) => {
  const deploymentDataPath = path.join(contractPath, `deployment.${network}.json`);

  return deploymentDataPath;
};

export const chunk = <T>(arr: Array<T>, chunkSize: number): Array<Array<T>> => {
  return arr.reduce(
    (prevVal: any, _currVal: any, currIndx: number, array: Array<T>) =>
      !(currIndx % chunkSize)
        ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)])
        : prevVal,
    []
  );
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const addSlippageToValue = (value: BigNumber, slippage: number): BigNumber => {
  if (slippage === 0) return value;

  if (slippage < 0.01) return value;

  return value.mul(10000 + slippage * 100).div(10000);
};

export const getConnect = (chainId?: Network | string) => {
  if (isZkSyncNetwork(chainId)) {
    return connectZkSync;
  } else if (isGodwokenNetwork(chainId)) {
    return connectGodwoken;
  } else if (isMantleNetwork(chainId)) {
    return connectMantle;
  }

  return null;
};

export const getConfig = (
  chainId?: Network | string
): ((environment: Environments) => Config) | null => {
  if (isZkSyncNetwork(chainId)) {
    return getZkSyncConfigStatic;
  } else if (isGodwokenNetwork(chainId)) {
    return (environment: Environments, runTime?: boolean) =>
      getConfigStatic(environment, 'godwoken', runTime);
  } else if (isMantleNetwork(chainId)) {
    return (environment: Environments, runTime?: boolean) =>
      getConfigStatic(environment, 'mantle', runTime);
  }

  return null;
};

export const getConfigInstant = (
  chainId: Network | string,
  environment: Environments,
  runTime = false
): Config | null => {
  if (isZkSyncNetwork(chainId)) {
    return getZkSyncConfigStatic(environment, runTime);
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId];

  if (network) {
    return getConfigStatic(environment, network, runTime);
  }

  return null;
};

export const getContractsConfig = (
  chainId?: Network | string
): ((environment: Environments) => IContractsConfig) | null => {
  if (isZkSyncNetwork(chainId)) {
    return getZkSyncContractsConfigStatic;
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId as string];

  if (network) {
    return (environment: Environments, runTime?: boolean) =>
      getContractsConfigStatic(environment, network, runTime);
  }

  return null;
};

export const getContractsConfigInstant = (
  chainId: Network | string,
  environment: Environments,
  runTime = false
): IContractsConfig | null => {
  if (isZkSyncNetwork(chainId)) {
    return getZkSyncContractsConfigStatic(environment, runTime);
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId as string];

  if (network) {
    return getContractsConfigStatic(environment, network, runTime);
  }

  return null;
};

export const getProvider = (
  chainId?: Network | string
): ((environment: Environments, readOnly: boolean) => providers.JsonRpcProvider) => {
  if (isZkSyncNetwork(chainId)) {
    return getZksyncProvider;
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId as string];

  if (network) {
    return (environment: Environments, readOnly: boolean) => {
      /** DEV network shouldn't be in prod bundle */
      const config = getConfigStatic(environment, network);
      const provider = new providers.JsonRpcProvider(
        readOnly ? config.readOnlyRpcUrl : config.rpcUrl,
        Number(config.chainId)
      );

      return provider;
    };
  }

  throw Error('getProvider wrong network');
};

export const getWebsocketProvider = (
  chainId?: Network | string
): ((environment: Environments) => providers.WebSocketProvider) => {
  if (isZkSyncNetwork(chainId)) {
    return getZksyncWebsocketProvider;
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId as string];

  if (network) {
    return (environment: Environments) => {
      const config = getConfigStatic(environment, network);
      const provider = new providers.WebSocketProvider(config.wsUrl, Number(config.chainId));

      return provider;
    };
  }

  throw Error('getWebsocketProvider wrong network');
};
