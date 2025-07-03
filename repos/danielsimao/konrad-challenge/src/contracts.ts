import { Address } from 'viem';
import { MARKETPLACE_ABI, FAUCET_ABI } from './abis';

const CONTRACTS = {
  MARKETPLACE: {
    address: '0xE0Fd942cEa2f2e56f26AAC279F8D0F280bF52d7C' as Address,
    abi: MARKETPLACE_ABI
  },
  FAUCET: {
    address: '0x7884560F14c62E0a83420F17832988cC1a775df1' as Address,
    abi: FAUCET_ABI
  }
};

type Erc20 = {
  symbol: ERC20Symbols;
  address: Address;
  decimals: number;
  name: string;
  logoUrl: string;
};

type ERC20Symbols = 'WBTC' | 'USDC';

const ERC20: Record<ERC20Symbols, Erc20> = {
  WBTC: {
    symbol: 'WBTC',
    address: '0x2868d708e442A6a940670d26100036d426F1e16b',
    decimals: 8,
    name: 'wBTC',
    logoUrl: 'https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png'
  },
  USDC: {
    symbol: 'USDC',
    address: '0x27c3321E40f039d10D5FF831F528C9CEAE601B1d',
    decimals: 18,
    name: 'USDC',
    logoUrl: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png'
  }
} satisfies Record<ERC20Symbols, Erc20>;

const ERC20List = Object.values(ERC20);

export { CONTRACTS, ERC20, ERC20List };
export type { Erc20, ERC20Symbols };
