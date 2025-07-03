import { TxSettings } from "@/definitions/types";

export type PoolStrategyAsset = {
  address: string;
  code: string;
  created_at: string;
  currency: string;
  tag: string;
  updated_at: string;
};

export type PoolStrategy = {
  client_code: string;
  code: string;
  created_at: string;
  customer_code: string;
  name: string;
  status: string;
  updated_at: string;
  assets: PoolStrategyAsset[];
};

export type PoolStrategiesResponse = {
  strategies: PoolStrategy[];
};

export type CreateStrategyRequestParams = {
  customerCode: string;
  name: string;
};

export type CreateStrategyAssetRequestParams = {
  strategyCode: string;
  asset: string;
};

export type RedeemRequestParams = {
  strategyCode: string;
  tokenIds: string;
  amounts: string;
  txSettings: TxSettings;
};

export type PoolRequestParams = {
  strategyCode: string;
  ids: string;
  amounts: string;
  txSettings: TxSettings;
};

export type RedeemResponse = {
  tx_hash: string;
};

export type PoolResponse = {
  tx_hash: string;
};

export enum PoolRedeemHistoryStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
}

export type PoolRedeemHistoryEntry = {
  id: string;
  date: string;
  time: string;
  creditPooled: string;
  redeemedFrom: string;
  amountPooled: string;
  amountRedeemed: string;
  pooledInto: string;
  redeemedInto: string;
  amountReceived: string;
  status: string;
  fee: string;
  from: string;
  to: string;
  timestamp: string;
  isPooling: boolean;
};

export type PoolRedemptionList = {
  pooling: PoolRedeemHistoryEntry[];
  redemption: PoolRedeemHistoryEntry[];
};
