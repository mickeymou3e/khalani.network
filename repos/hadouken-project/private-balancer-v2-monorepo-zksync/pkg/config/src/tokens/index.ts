import { Environment } from '../types';
import TokensZksyncMainnet from './tokens.zksync-mainnet.json';
import TokensZksyncTestnet from './tokens.zksync-testnet.json';

type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  source: 'eth' | 'bsc' | 'gw' | 'ce' | 'multi';
  unwrappedAddress?: string;
};

export const tokens = (environment: Environment): Token[] => {
  if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return (TokensZksyncMainnet.tokens as unknown) as Token[];
  } else if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return (TokensZksyncTestnet.tokens as unknown) as Token[];
  }

  return (TokensZksyncTestnet.tokens as unknown) as Token[];
};
