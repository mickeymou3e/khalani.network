import { Network } from './lib/constants/network';
import type { BigNumberish } from '@ethersproject/bignumber';
import type { Contract } from '@ethersproject/contracts';
import type { PoolDataService, TokenPriceService } from '@balancer-labs/sor';
import type {
  ExitPoolAttributes,
  JoinPoolAttributes,
} from './modules/pools/pool-types/concerns/types';
import type {
  Findable,
  Searchable,
  LiquidityGauge,
  PoolAttribute,
  TokenAttribute,
} from '@/modules/data/types';
import type { BaseFeeDistributor, ProtocolFeesProvider } from './modules/data';
import type { GraphQLArgs } from './lib/graphql';

import type { AprBreakdown } from '@/modules/pools/apr/apr';
export * from '@/modules/data/types';
export { Network, AprBreakdown };

export type Address = string;

export interface BalancerSdkConfig {
  //use a known network or provide an entirely custom config
  network: Network | BalancerNetworkConfig;
  rpcUrl: string;
  //overwrite the subgraph url if you don't want to use the balancer labs maintained version
  customSubgraphUrl?: string;
  //optionally overwrite parts of the standard SOR config
  sor?: Partial<BalancerSdkSorConfig>;
}

export interface BalancerSdkSorConfig {
  //use a built-in service or provide a custom implementation of a TokenPriceService
  //defaults to coingecko
  tokenPriceService: 'coingecko' | 'subgraph' | TokenPriceService;
  //use a built-in service or provide a custom implementation of a PoolDataService
  //defaults to subgraph
  poolDataService: 'subgraph' | PoolDataService;
  //if a custom PoolDataService is provided, on chain balance fetching needs to be handled externally
  //default to true.
  fetchOnChainBalances: boolean;
}

export interface ContractAddresses {
  vault: string;
  multicall: string;
  lidoRelayer?: string;
  gaugeController?: string;
  feeDistributor?: string;
  protocolFeePercentagesProvider?: string;
}

export interface BalancerNetworkConfig {
  chainId: Network;
  addresses: {
    contracts: ContractAddresses;
    tokens: {
      wrappedNativeAsset: string;
      lbpRaisingTokens?: string[];
      stETH?: string;
      wstETH?: string;
      bal?: string;
      veBal?: string;
      bbaUsd?: string;
    };
  };
  urls: {
    subgraph: string;
    gaugesSubgraph?: string;
    blockNumberSubgraph?: string;
  };
  thirdParty: {
    coingecko: {
      nativeAssetId: string;
      platformId: string;
    };
  };
  averageBlockTime?: number; // In seconds, used if blockNumberSubgraph not set
  pools: {
    wETHwstETH?: PoolReference;
  };
  poolsToIgnore?: string[];
  sorConnectingTokens?: { symbol: string; address: string }[];
  sorTriPathMidPoolIds?: string[];
}

export interface BalancerDataRepositories {
  pools: Findable<Pool, PoolAttribute> & Searchable<Pool>;
  yesterdaysPools?: Findable<Pool, PoolAttribute> & Searchable<Pool>;
  tokenPrices: Findable<Price>;
  tokenMeta: Findable<Token, TokenAttribute>;
  liquidityGauges?: Findable<LiquidityGauge>;
  feeDistributor?: BaseFeeDistributor;
  feeCollector: Findable<number>;
  protocolFees?: ProtocolFeesProvider;
  tokenYields: Findable<number>;
}

export type PoolReference = {
  id: string;
  address: string;
};

export enum PoolSpecialization {
  GeneralPool = 0,
  MinimalSwapInfoPool,
  TwoTokenPool,
}

// Joins

export type JoinPoolRequest = {
  assets: string[];
  maxAmountsIn: BigNumberish[];
  userData: string;
  fromInternalBalance: boolean;
};

// Exit

export type ExitPoolRequest = {
  assets: string[];
  minAmountsOut: string[];
  userData: string;
  toInternalBalance: boolean;
};

// Balance Operations

export enum UserBalanceOpKind {
  DepositInternal = 0,
  WithdrawInternal,
  TransferInternal,
  TransferExternal,
}

export type UserBalanceOp = {
  kind: UserBalanceOpKind;
  asset: string;
  amount: BigNumberish;
  sender: string;
  recipient: string;
};

export enum PoolBalanceOpKind {
  Withdraw = 0,
  Deposit = 1,
  Update = 2,
}

export type PoolBalanceOp = {
  kind: PoolBalanceOpKind;
  poolId: string;
  token: string;
  amount: BigNumberish;
};

export interface TransactionData {
  contract?: Contract;
  function: string;
  params: string[];
  outputs?: {
    amountsIn?: string[];
    amountsOut?: string[];
  };
}

export type Currency = 'eth' | 'usd';

export type Price = { [currency in Currency]?: string };
export type TokenPrices = { [address: string]: Price };

export interface Token {
  address: string;
  decimals?: number;
  symbol?: string;
  price?: Price;
}

export interface PoolToken extends Token {
  balance: string;
  priceRate?: string;
  weight?: string | null;
  token?: { pool: { poolType: null | PoolType } | null };
}

export interface OnchainTokenData {
  balance: string;
  weight: number;
  decimals: number;
  logoURI: string | undefined;
  name: string;
  symbol: string;
}

export interface OnchainPoolData {
  tokens: Record<Address, OnchainTokenData>;
  totalSupply: string;
  decimals: number;
  swapFee: string;
  amp?: string;
  swapEnabled: boolean;
  tokenRates?: string[];
}

export enum PoolType {
  Weighted = 'Weighted',
  Investment = 'Investment',
  Stable = 'Stable',
  ComposableStable = 'ComposableStable',
  MetaStable = 'MetaStable',
  StablePhantom = 'StablePhantom',
  LiquidityBootstrapping = 'LiquidityBootstrapping',
  AaveLinear = 'AaveLinear',
  ERC4626Linear = 'ERC4626Linear',
  Element = 'Element',
  Gyro2 = 'Gyro2',
  Gyro3 = 'Gyro3',
}

export interface Pool {
  id: string;
  name: string;
  address: string;
  chainId: number;
  poolType: PoolType;
  swapFee: string;
  owner?: string;
  factory?: string;
  tokens: PoolToken[];
  tokensList: string[];
  tokenAddresses?: string[];
  totalLiquidity: string;
  totalShares: string;
  totalSwapFee?: string;
  totalSwapVolume?: string;
  onchain?: OnchainPoolData;
  createTime?: number;
  mainTokens?: string[];
  wrappedTokens?: string[];
  unwrappedTokens?: string[];
  isNew?: boolean;
  volumeSnapshot?: string;
  feesSnapshot?: string;
  boost?: string;
  symbol?: string;
  swapEnabled: boolean;
  amp?: string;
  apr?: AprBreakdown;
  liquidity?: string;
  totalWeight: string;
  mainIndex?: number;
  wrappedIndex?: number;
}

/**
 * Pool use-cases / controller layer
 */
export interface PoolWithMethods extends Pool {
  buildJoin: (
    joiner: string,
    tokensIn: string[],
    amountsIn: string[],
    slippage: string
  ) => JoinPoolAttributes;
  calcPriceImpact: (amountsIn: string[], minBPTOut: string) => Promise<string>;
  buildExitExactBPTIn: (
    exiter: string,
    bptIn: string,
    slippage: string,
    shouldUnwrapNativeAsset?: boolean,
    singleTokenMaxOut?: string
  ) => ExitPoolAttributes;
  buildExitExactTokensOut: (
    exiter: string,
    tokensOut: string[],
    amountsOut: string[],
    slippage: string
  ) => ExitPoolAttributes;
  calcSpotPrice: (tokenIn: string, tokenOut: string) => string;
}

export interface GraphQLQuery {
  args: GraphQLArgs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attrs: any;
}
