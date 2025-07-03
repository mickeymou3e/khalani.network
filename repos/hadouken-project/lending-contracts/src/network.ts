import { Environments, Network } from './types/types';

export const NetworkNames = {
  '0x1': 'Mainnet',
  '0x2a': 'Kovan',
  '0x4': 'Rinkeby',
  '0x5': 'Goerli',
  '0x3': 'Ropsten',
  '0x539': 'Dev',
  '0x144': 'ZkSyncMainnet',
  '0x118': 'ZkSyncTestnet',
  '0x1388': 'MantleMainnet',
  '0x1389': 'MantleTestnet',
};

export const getNetworkName = (chainId: string): string => {
  switch (chainId.toString().toLowerCase()) {
    case Network.Mainnet:
      return 'Mainnet';
    case Network.Ropsten:
      return 'Ropsten';
    case Network.Rinkeby:
      return 'Rinkeby';
    case Network.Goerli:
      return 'Goerli';
    case Network.Dev:
      return 'Local';
    case Network.Godwoken:
      return 'Godwoken';
    case Network.GodwokenTestnetV1:
      return 'Godwoken Testnet V1';
    case Network.GodwokenTestnetV1_1:
      return 'Godwoken Testnet V1_1';
    case Network.GodwokenTestnet:
      return 'Godwoken Testnet V0';
    case Network.GodwokenDevnetV1:
      return 'Godwoken Devnet V1';
    case Network.GodwokenMainnetV1:
      return 'Godwoken Mainnet V1';
    case Network.ZkSyncMainnet:
      return 'zksync';
    case Network.ZkSyncTestnet:
      return 'zkSync Testnet';
    case Network.MantleMainnet:
      return 'Mantle';
    case Network.MantleTestnet:
      return 'Mantle Testnet';
  }

  return 'unknown';
};

export const isZkSyncNetwork = (chainId?: Network | string): boolean => {
  return (
    chainId == Network.ZkSyncMainnet ||
    chainId == Network.ZkSyncTestnet ||
    chainId === Network.ZkSyncLocalhost
  );
};

export const isGodwokenNetwork = (chainId?: Network | string): boolean => {
  return chainId == Network.GodwokenMainnetV1 || chainId == Network.GodwokenTestnetV1_1;
};

export const isMantleNetwork = (chainId?: Network | string): boolean => {
  return chainId == Network.MantleMainnet || chainId == Network.MantleTestnet;
};

export const getSupportedNetworks = (environment: Environments): Network[] | null => {
  switch (environment) {
    case 'mainnet':
      return [Network.GodwokenMainnetV1, Network.ZkSyncMainnet, Network.MantleMainnet];
    case 'testnet':
      return [Network.GodwokenTestnetV1_1, Network.ZkSyncTestnet, Network.MantleTestnet];
    case 'localhost':
      return [Network.ZkSyncLocalhost];
    default:
      return null;
  }
};
