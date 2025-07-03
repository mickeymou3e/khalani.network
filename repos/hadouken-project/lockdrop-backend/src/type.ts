export type ChainMapping = { [key: string]: 'zksync' | 'godwoken' | 'mantle' };

export type LockDropData = {
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
  reward: string;
  lockInUSD: string;
};

export type LockDropInfo = {
  list: LockDropData[];
  totalHdkTokens: string;
  totalUserValueLocked: string;
  totalUserHdkToClaim: string;
};

export type TokenBalances = {
  [key: string]: bigint;
};

export type TokenPrices = {
  [key: string]: bigint;
};

export type TokenPricesDto = {
  [key: string]: string;
};
