import { BigNumber } from 'ethers'
import { Reserve } from '../liquidation-fetcher/liquidation-fetcher.types'

export type CollateralReserve = Reserve & {
  totalCollateral: BigNumber
  totalCollateralInDollars: BigNumber
}

export type DebtReserve = Reserve & {
  totalDebt: BigNumber
  totalDebtInDollars: BigNumber
}

export interface HealthFactor {
  healthFactor: BigNumber
  collateralTokens: CollateralReserve[]
  borrowedTokens: DebtReserve[]
}

export type UserTotalCollateral = {
  totalCollateral: BigNumber
  collateralTokens: CollateralReserve[]
}
export type MaxCollateral = {
  maxAmountCollateralToLiquidate: BigNumber
  maxAmountCollateralToLiquidateInDollars: BigNumber
}
