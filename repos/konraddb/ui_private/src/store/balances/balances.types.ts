export type BalanceValues = {
  availableToTrade: string;
  availableToTradeValue: number;
  availableToAux: string;
  availableToAuxValue: number;
  locked: string;
  lockedValue: number;
  inOrders: string;
  inOrdersValue: number;
  total: string;
  totalValue: number;
};

export type BalanceData = {
  id: string;
  asset: string;
  assetName: string;
  description?: string;
  icon?: string;
  isFiat: boolean;
  base: BalanceValues;
  quote: BalanceValues;
};
