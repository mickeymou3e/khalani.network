import { Environment } from '../types';
import PoolsZksyncMainnet from './pools.zksync-mainnet.json';
import PoolsZksyncTestnet from './pools.zksync-testnet.json';

export const pools = (
  environment: Environment
): {
  name: string;
  symbol: string;
  address: string;
  displayName: string;
  depositTokens: null | string[];
  poolType: string;
  wrappedDepositTokens: null | string[];
}[] => {
  if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return PoolsZksyncTestnet?.pools;
  } else if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return PoolsZksyncMainnet?.pools;
  }

  return PoolsZksyncTestnet?.pools;
};
