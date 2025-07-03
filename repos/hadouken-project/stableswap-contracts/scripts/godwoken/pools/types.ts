import { ethers } from "ethers"

export type TokenName = string
export type Address = string

export interface LpToken {
  name: string
  symbol: string
}

export interface PoolData {
    lpToken: LpToken,
    amplification: number,
    fee: number,
    adminFee: number,
    tokens: TokenName[],
    gauges: Address[]
}

export interface ContractCompiled { 
  abi: ethers.ContractInterface,
  bytecode: ethers.utils.BytesLike
}

/**
 * {
 *   [ContractName]: contractAddress
 * }
 */
export interface PoolDeploymentData {
  [key: string]: Address
}