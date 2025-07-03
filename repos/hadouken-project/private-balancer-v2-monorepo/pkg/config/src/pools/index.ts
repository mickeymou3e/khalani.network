import { ChainId, Network } from '../networks';
import PoolsGodwokenMainnet from './godwoken.mainnet.json';
import PoolsGodwokenTestnet from './godwoken.testnet.json';
import PoolsMantleTestnet from './mantle.testnet.json';

export const pools = (
  chainId: ChainId
): {
  name: string;
  symbol: string;
  address: string;
  displayName: string;
  depositTokens: null | string[];
  poolType: string;
  wrappedDepositTokens: null | string[];
}[] => {
  if (chainId === Network.GodwokenMainnet) {
    return PoolsGodwokenMainnet?.pools;
  } else if (chainId === Network.GodwokenTestnet) {
    return PoolsGodwokenTestnet?.pools;
  } else if (chainId === Network.MantleTestnet) {
    return PoolsMantleTestnet?.pools;
  }

  return PoolsGodwokenMainnet?.pools;
};
