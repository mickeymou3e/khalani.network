import ExternalGodwokenMainnet from './godwoken.mainnet.json';
import ExternalGodwokenTestnet from './godwoken.testnet.json';
import ExternalMantleTestnet from './mantle-testnet.json';
import ExternalSchema from './external.schema.json';
import { ChainId, Network } from '../networks';

export const external = (chainId: ChainId): typeof ExternalSchema => {
  if (chainId === Network.GodwokenMainnet) {
    return ExternalGodwokenMainnet;
  } else if (chainId === Network.GodwokenTestnet) {
    return ExternalGodwokenTestnet;
  } else if (chainId === Network.MantleTestnet) {
    return ExternalMantleTestnet;
  }

  return ExternalGodwokenMainnet;
};
