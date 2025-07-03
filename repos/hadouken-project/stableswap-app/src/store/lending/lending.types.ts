import { BigDecimal } from '@utils/math'

export interface ILendingReserve {
  id: string
  underlyingAsset: string
  aTokenAddress: string
  wrappedATokenAddress: string
  APY: BigDecimal
}
