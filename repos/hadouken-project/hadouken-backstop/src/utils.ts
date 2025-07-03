import { Network } from "./types/types";

import { connectBaseChain, connectZkSync } from "./connect";

export const isZkSyncNetwork = (chainId?: string): boolean => {
  return (
    chainId == Network.ZkSyncMainnet ||
    chainId == Network.ZkSyncTestnet ||
    chainId === Network.ZkSyncLocalhost
  );
};

export const getConnect = (
  chainId?: string
): typeof connectZkSync | typeof connectBaseChain =>
  isZkSyncNetwork(chainId) ? connectZkSync : connectBaseChain;
