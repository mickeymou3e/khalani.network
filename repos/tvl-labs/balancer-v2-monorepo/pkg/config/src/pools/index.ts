import PoolsMainnet from './pools.mainnet.json';
import PoolsTestnet from './pools.testnet.json';
import PoolsSchema from './pools.schema.json';
import { Environment } from '../types';

export const pools = (environment: Environment): typeof PoolsSchema => {
  if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return PoolsMainnet;
  } else if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return PoolsTestnet;
  }

  return PoolsMainnet;
};
