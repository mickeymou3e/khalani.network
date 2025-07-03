export { getConfigFromNetworkName, getContractsConfigFromNetworkName } from './filesManager';

export {
  NetworkNames,
  getNetworkName,
  getSupportedNetworks,
  isGodwokenNetwork,
  isMantleNetwork,
  isZkSyncNetwork,
} from './network';

export type { Environments, IContractsConfig, Network } from './types/types';

export { getConfig, getContractsConfig } from './utils/utils';
