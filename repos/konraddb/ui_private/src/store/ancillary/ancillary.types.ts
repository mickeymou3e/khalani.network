export type TokenMetadataAttributes = {
  trait_type: string;
  value: string;
};

export type TokenMetadataResponse = {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: TokenMetadataAttributes[];
};

export type PoolDeposit = {
  id: string;
  tokenId: string;
  balance: number;
  token: {
    id: string;
    vintage: string;
    generator: {
      id: string;
      techType: string;
    };
  };
};

export type JasminePoolDeposit = {
  id: string;
  tokenId: string;
  balance: number;
  token: {
    id: string;
    vintage: string;
    generator: {
      id: string;
      techType: string;
    };
  };
  metadata: {
    id: string;
    tokenId: string;
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: TokenMetadataAttributes[];
  };
};

export type PoolDepositsResult = {
  deposits: PoolDeposit[];
  count: number;
};

export type SingleHistoryItem = {
  id: string;
  blockTimestamp: string;
  from: string;
  to: string;
  transactionHash: string;
  value: string;
  metadata?: TokenMetadataResponse;
};

export type BatchHistoryItem = {
  ids: string[];
  values: string[];
  from: string;
  to: string;
  transactionHash: string;
  blockTimestamp: string;
  metadata?: TokenMetadataResponse[];
};

export type PoolHistory = {
  transferSingles: SingleHistoryItem[];
  transferBatches: BatchHistoryItem[];
};

export type PoolHistoryResponse = {
  data: PoolHistory;
};

export enum Attribute {
  Generator = "Generator",
  Vintage = "Vintage",
  Region = "Location",
  TechType = "Tech Type",
  Registry = "Registry",
}

export type EnergyAttributeTokenProps = {
  id: string;
  generator: string;
  vintage: string;
  region: string;
  techType: string;
  registry: string;
  balance: string;
  balanceValue: number;
  strategyBalance: string;
  strategyBalanceValue: number;
  icon: string;
  eligibleForPooling?: boolean;
};

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

export type GenericResponse = {
  [key: string]: any;
};

export type PoolStrategiesResponse = {
  strategies: PoolStrategy[];
};

export type StrategyAsset = {
  address: string;
  balance: string;
  code: string;
  contract_address: string;
  created_at: string;
  currency: string;
  metadata: {
    token_id?: string;
  };
  tag: string;
  type: string;
  updated_at: string;
  meta?: TokenMetadataResponse;
  eligibleForPooling?: boolean;
};

export type StrategyAssetsResponse = {
  assets: StrategyAsset[];
};

export type CreateStrategyRequestParams = {
  customerCode: string;
  name: string;
};

export type CreateStrategyAssetRequestParams = {
  strategyCode: string;
  asset: string;
};

export type EligibilityRequestProps = {
  strategyCode: string;
  tokenId: string;
};

export type EligibilityResponse = {
  result: string;
};

export type EligibilityDetails = {
  tokenId: string;
  eligible: boolean;
};

export type StrategyBalance = {
  currency: string;
  balance: string;
};

export type StrategyBalancesResponse = {
  balances: StrategyBalance[];
};

export enum TransferFundsDirection {
  CustodyToDefi = "custody_to_defi",
  DefiToCustody = "defi_to_custody",
}

export type TransferFundsRequestParams = {
  asset: string;
  amount: string;
  source: string;
  destination: string;
  direction: TransferFundsDirection;
};

export type SelectionAsset = {
  assetKey: string;
  poolKey: string;
  amount: number;
};

export type TransactionStatusResponse = {
  status: number;
};
