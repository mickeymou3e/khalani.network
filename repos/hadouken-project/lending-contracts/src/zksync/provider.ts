import { providers } from 'ethers';

import { Environments } from '../types/types';
import { getZkSyncConfigStatic } from './config';

export const getProvider = (
  environment: Environments,
  readOnly: boolean = false
): providers.JsonRpcProvider => {
  /** DEV network shouldn't be in prod bundle */
  const config = getZkSyncConfigStatic(environment);
  const provider = new providers.JsonRpcProvider(
    readOnly ? config.readOnlyRpcUrl : config.rpcUrl,
    Number(config.chainId)
  );

  return provider;
};

export const getWebsocketProvider = (environment: Environments): providers.WebSocketProvider => {
  const config = getZkSyncConfigStatic(environment);
  const provider = new providers.WebSocketProvider(config.wsUrl, Number(config.chainId));

  return provider;
};
