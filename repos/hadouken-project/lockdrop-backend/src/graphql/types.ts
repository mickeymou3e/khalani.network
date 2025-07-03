export type Lockdrop = {
  id: string;
  tokenAddress: string;
  timestamp: number;
  owner: string;
  lockId: string;
  amount: number;
  lockLength: number;
  weight: number;
  isLocked: boolean;
  transaction: string;
  isClaimed: boolean;
};

export type TokenBalance = {
  id: string;
  symbol: string;
  address: string;
  latestUSDPrice: number;
};

export type ClaimedHDK = {
  id: string;
  user: string;
  amount: number;
};

export type DepositedHDK = {
  id: string;
  user: string;
  amount: number;
  timestamp: number;
};

export interface LockdropsResponseQuery {
  lockdrops: Lockdrop[];
}

export interface DepositHDKResponseQuery {
  depositedHDKs: DepositedHDK[];
}

export interface ClaimedHDKResponseQuery {
  claimedHDKTokens: ClaimedHDK[];
}

export interface TokenBalanceResponseQuery {
  tokens: TokenBalance[];
}

export interface TokenPricesResponseQuery {
  lockdropTokens: {
    price: number;
    id: string;
  }[];
}
