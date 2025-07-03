export enum AncillaryFeature {
  Pool = "pool",
  Redeem = "redeem",
  BridgeIn = "bridgeIn",
  BridgeOut = "bridgeOut",
  Retire = "retire",
  RetirePool = "retirePool",
}

export type TxSettings = {
  gas_limit: string;
  gas_price: string;
  max_fee_per_gas: string;
  max_priority_fee_per_gas: string;
};
