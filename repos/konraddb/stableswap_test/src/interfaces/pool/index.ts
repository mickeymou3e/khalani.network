import { Address } from '@interfaces/data'
import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

export const GENERIC_POOL_SYMBOL = '2POOL LP'

export enum PoolType {
  Unknown = 'Unknown',
  Stable = 'Stable',
  Weighted = 'Weighted',
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
  address: Address
  name: string
  poolType: PoolType
  tokens: IPoolToken[]
  amp: string
  swapFee: BigDecimal
  totalShares: BigDecimal
  totalLiquidity: BigDecimal
  totalSwapFee: BigDecimal
  totalSwapVolume: BigDecimal
}
