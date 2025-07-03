import { ChainId } from "@tvl-labs/fund-wallet-script";

export interface IBalances {
  address: string;
  chain: ChainId;
  balance: number;
  rpcUrl: string;
}

export enum EPromiseFulfilledStatus {
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
