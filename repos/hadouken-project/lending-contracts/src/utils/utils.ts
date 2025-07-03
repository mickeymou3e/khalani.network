import { getConfigStatic, getContractsConfigStatic } from '../connect/base/utils';
import { getContractsConfigFromNetworkName } from '../filesManager';
import { isZkSyncNetwork } from '../network';
import { BaseChain } from '../types';
import { Config, Environments, IContractsConfig, Network } from '../types/types';
import { getZkSyncConfigStatic, getZkSyncContractsConfigStatic } from '../zksync/config';

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

export const getContractsConfig = (chainId?: Network | string): IContractsConfig | null => {
  const environment = resolveEnvironmentByChainId(chainId as string);

  if (isZkSyncNetwork(chainId)) {
    return getZkSyncContractsConfigStatic(environment, false);
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId as string];

  if (network) {
    return getContractsConfigStatic(environment, network, false);
  }

  return null;
};

export const getConfig = (chainId?: Network | string): Config | null => {
  const environment = resolveEnvironmentByChainId(chainId as string);

  if (isZkSyncNetwork(chainId)) {
    return getZkSyncConfigStatic(environment, false);
  }

  const network = CHAIN_ID_TO_NETWORK_NAME[chainId as string];

  if (network) {
    return getConfigStatic(environment, network, false);
  }

  return null;
};

const chainsMainnet = [
  Network.GodwokenMainnetV1.toLowerCase(),
  Network.MantleMainnet.toLowerCase(),
  Network.ZkSyncMainnet.toLowerCase(),
];

const chainsTestnet = [
  Network.GodwokenTestnetV1_1.toLowerCase(),
  Network.MantleTestnet.toLowerCase(),
  Network.ZkSyncTestnet.toLowerCase(),
];

const godwokenNetworks = [
  Network.GodwokenMainnetV1.toLowerCase(),
  Network.GodwokenTestnetV1_1.toLowerCase(),
];

const mantleNetworks = [Network.MantleMainnet.toLowerCase(), Network.MantleTestnet.toLowerCase()];

const zksyncNetworks = [Network.ZkSyncMainnet.toLowerCase(), Network.ZkSyncTestnet.toLowerCase()];

export const resolveEnvironmentByChainId = (chainId: string): Environments => {
  if (chainsMainnet.includes(chainId.toString().toLowerCase())) {
    return 'mainnet';
  }

  if (chainsTestnet.includes(chainId.toString().toLowerCase())) {
    return 'testnet';
  }

  throw Error('Invalid chainId');
};

export const resolveNetworkNameByChainId = (chainId: string): BaseChain | 'zksync' => {
  if (godwokenNetworks.includes(chainId.toString().toLowerCase())) {
    return 'godwoken';
  }

  if (mantleNetworks.includes(chainId.toString().toLowerCase())) {
    return 'mantle';
  }

  if (zksyncNetworks.includes(chainId.toString().toLowerCase())) {
    return 'zksync';
  }

  throw Error('Invalid chainId');
};

export const getConnectConfig = (chainId: string, runTime: boolean = false): IContractsConfig => {
  const environment = resolveEnvironmentByChainId(chainId);
  const networkName = resolveNetworkNameByChainId(chainId);

  let contractsConfig: IContractsConfig | null = null;

  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${networkName}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, networkName);
  }

  if (!contractsConfig) throw Error('contractsConfig is null');

  return contractsConfig;
};
