import { BigDecimal } from '@utils/math'

export interface IWithdrawContainer {
  poolId: string
}

export type LpTokenCalculationResult = {
  userMaxLpTokenBalance: BigDecimal
  isUserShareGreaterThanMaximumShare: boolean
}
