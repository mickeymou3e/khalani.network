import godwokenMainnet from "../config/godwoken-mainnet.json";
import godwokenTestnet from "../config/godwoken-testnet.json";
import mantleTestnet from "../config/mantle-testnet.json";
import zksyncTestnet from "../config/zksync-testnet.json";

import {
  ChainEnvironment,
  ContractsConfig,
  Environment,
  Network,
} from "../types/types";

export const getContractsConfigStatic = (
  environment: ChainEnvironment
): ContractsConfig => {
  switch (environment) {
    case "godwoken-mainnet":
      return godwokenMainnet as ContractsConfig;
    case "godwoken-testnet":
      return godwokenTestnet as ContractsConfig;
    case "zksync-testnet":
      return zksyncTestnet as ContractsConfig;
    case "mantle-testnet":
      return mantleTestnet as ContractsConfig;
    default:
      throw Error("wrong network");
  }
};

const chainsMainnet = [
  Network.GodwokenMainnet.toLowerCase(),
  Network.MantleMainnet.toLowerCase(),
  Network.ZkSyncMainnet.toLowerCase(),
];

const chainsTestnet = [
  Network.GodwokenTestnet.toLowerCase(),
  Network.MantleTestnet.toLowerCase(),
  Network.ZkSyncTestnet.toLowerCase(),
];

const godwokenNetworks = [
  Network.GodwokenMainnet.toLowerCase(),
  Network.GodwokenTestnet.toLowerCase(),
];

const mantleNetworks = [
  Network.MantleMainnet.toLowerCase(),
  Network.MantleTestnet.toLowerCase(),
];

const zksyncNetworks = [
  Network.ZkSyncMainnet.toLowerCase(),
  Network.ZkSyncTestnet.toLowerCase(),
];

const resolveEnvironmentByChainId = (chainId: string): Environment => {
  if (chainsMainnet.includes(chainId.toString().toLowerCase())) {
    return "mainnet";
  }

  if (chainsTestnet.includes(chainId.toString().toLowerCase())) {
    return "testnet";
  }

  throw Error("Invalid chainId");
};

const resolveNetworkNameByChainId = (
  chainId: string
): "godwoken" | "mantle" | "zksync" => {
  if (godwokenNetworks.includes(chainId.toString().toLowerCase())) {
    return "godwoken";
  }

  if (mantleNetworks.includes(chainId.toString().toLowerCase())) {
    return "mantle";
  }

  if (zksyncNetworks.includes(chainId.toString().toLowerCase())) {
    return "zksync";
  }

  throw Error("Invalid chainId");
};

export const resolveChainEnvironmentByChainId = (
  chainId: string
): ChainEnvironment => {
  const environment = resolveEnvironmentByChainId(chainId);
  const networkName = resolveNetworkNameByChainId(chainId);

  return `${networkName}-${environment}`;
};
