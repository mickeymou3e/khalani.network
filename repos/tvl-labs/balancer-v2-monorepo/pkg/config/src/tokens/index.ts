import TokensMainnet from './tokens.mainnet.json';
import TokensTestnet from './tokens.testnet.json';
import TokensSchema from './tokens.schema.json';
import { Environment } from '../types';

export const tokens = (environment: Environment): typeof TokensSchema => {
  if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return TokensMainnet;
  } else if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return TokensTestnet;
  }

  return TokensMainnet;
};
