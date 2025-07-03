export enum OrderStatus {
  OPEN = "Open",
  FILLED = "Filled",
  REJECTED = "Rejected",
  CANCELLED = "Canceled",
  INITIATED = "Initiated",
  TOCANCEL = "ToCancel",
  CANCELLED_PARTIALLY_FILLED = "CanceledPartiallyFilled",
}

export enum TxStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export enum BridgeStatus {
  READY_TO_BRIDGE = "readyToBridge",
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
}

export const SettledOrderStatuses = [
  OrderStatus.FILLED,
  OrderStatus.REJECTED,
  OrderStatus.CANCELLED,
  OrderStatus.CANCELLED_PARTIALLY_FILLED,
];

export enum ExecutionSide {
  BUY = "Buy",
  SELL = "Sell",
}

export enum OrderType {
  LIMIT = "RFQ_Limit",
  MARKET = "RFQ_Market",
}

export enum FiatCurrencies {
  USD = "USD",
  EUR = "EUR",
}

export const Tokens = {
  STRATEGY_MATIC: process.env.NEXT_PUBLIC_POOL_STRATEGY_TX_FEE_TOKEN as string,
  STRATEGY_JLT_CODE: process.env.NEXT_PUBLIC_POOL_STRATEGY_TOKEN as string,
  MATIC: process.env.NEXT_PUBLIC_POOL_TX_FEE_TOKEN as string,
  JLT: process.env.NEXT_PUBLIC_POOL_TOKEN as string,
};

export enum EcoAssets {
  Recs = "recs",
  CarbonCredits = "carbonCredits",
  Forwards = "forwards",
}
