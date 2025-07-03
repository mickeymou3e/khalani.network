import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

export enum PoolType {
  Unknown = 'Unknown',
  Stable = 'Stable',
  Weighted = 'Weighted',
  WeightedBoosted = 'WeightedBoosted',
  Linear = 'Linear',
  AaveLinear = 'AaveLinear',
  StablePhantom = 'StablePhantom',
  ComposableStable = 'ComposableStable',
}

export interface IPoolToken extends IToken {
  balance: BigDecimal
  priceRate?: BigDecimal
  weight?: BigDecimal
}

export interface IPool extends IToken {
  id: string
  address: string
  name: string
  poolType: PoolType
  tokens: IPoolToken[]
  amp: string
  swapFee: BigDecimal
  owner: string
  createTime: Date
  totalShares: BigDecimal
  totalLiquidity: BigDecimal
  totalSwapFee: BigDecimal
  totalSwapVolume: BigDecimal
}

export type IPoolConfig = {
  name: string
  symbol: string
  address: string
  displayName: string
  depositTokens: string[] | null
  poolType: string
  wrappedDepositTokens: string[] | null
}
