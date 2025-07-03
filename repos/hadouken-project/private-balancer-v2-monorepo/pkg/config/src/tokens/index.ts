import { ChainId, Network } from '../networks';
import TokensGodwokenMainnet from './godwoken.mainnet.json';
import TokensGodwokenTestnet from './godwoken.testnet.json';
import TokensMantleTestnet from './mantle.testnet.json';

type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  source: 'eth' | 'bsc' | 'gw' | 'ce' | 'multi';
  unwrappedAddress?: string;
};

export const tokens = (chainId: ChainId): Token[] => {
  if (chainId === Network.GodwokenMainnet) {
    return TokensGodwokenMainnet.tokens as unknown as Token[];
  } else if (chainId === Network.GodwokenTestnet) {
    return TokensGodwokenTestnet.tokens as unknown as Token[];
  } else if (chainId === Network.MantleTestnet) {
    return TokensMantleTestnet.tokens as unknown as Token[];
  }

  return TokensGodwokenMainnet.tokens as unknown as Token[];
};
