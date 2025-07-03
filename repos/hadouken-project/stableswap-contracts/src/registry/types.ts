import { EthereumNetwork, GodwokenNetwork } from "../types";

export type IRegistryDataByNetwork = {
  [key in EthereumNetwork | GodwokenNetwork]?: Partial<IRegistryData>
}

export interface IRegistryData {
  AddressProvider: string
  PoolInfo: string
  Registry: string
  Swaps: string
  UserBalances: string
}