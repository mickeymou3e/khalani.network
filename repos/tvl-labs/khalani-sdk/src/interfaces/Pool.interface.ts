import { PoolOwnType, PoolType } from '@enums/PoolType.enum'
import { Address, TokenModel } from '@store/tokens/tokens.types'
import { BigDecimal } from '@utils/math'

export interface IPoolToken extends TokenModel {
  balance: BigDecimal
  priceRate?: BigDecimal
  weight?: BigDecimal
}

export interface IPool extends TokenModel {
  id: string
  address: Address
  name: string
  poolType: PoolType
  poolOwnType: PoolOwnType
  tokens: IPoolToken[]
  amp: string
  swapFee: BigDecimal
  totalShares: BigDecimal
  totalLiquidity: BigDecimal
  totalSwapFee: BigDecimal
  totalSwapVolume: BigDecimal
}
