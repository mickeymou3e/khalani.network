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

export const PoolModes = {
  Deposit: "deposit",
  Redeem: "redeem",
} as const;

export type PoolMode = typeof PoolModes[keyof typeof PoolModes];

export type SelectionAsset = {
  assetKey: string;
  poolKey: string;
  amount: number;
};

export type PoolPageChangePayload = {
  assetKey: string;
  poolKey: string;
};

export type PoolState = {
  mode: PoolMode;
  selectedAssetKey: string | null;
  selectedPoolKey: string | null;
  selectionList: SelectionAsset[];
};

export type RenewableEnergyCertificate = {
  id: string;
  generator: string;
  vintage: string;
  region: string;
  techType: string;
  registry: string;
  balance: string;
  balanceValue: number;
  icon: string;
};

export type SelectionItem = {
  id: string;
  name: string;
  icon: string;
  amount: string;
  amountValue: number;
};

export type TechTypeProps = {
  name: string;
  value: number;
};

export type VintageProps = {
  name: string;
  [key: string]: string | number;
};
