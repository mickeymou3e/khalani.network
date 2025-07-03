import { Overrides, providers, Signer } from "ethers";

export interface TokenData {
  name: string
  decimals: number
  underlying_address: string
  bridged_address?: string
  sudt_id?: number
}

export interface TokensByAddress {
  [key: string]: TokenData
}


export interface CallParams {
  timeout: number
}
export interface ScriptRunParameters {
  network: string,
  admin: string,
  deployer: Signer,
  provider: providers.JsonRpcProvider,
  transactionOverrides: Overrides,
}