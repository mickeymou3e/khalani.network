import { LiquidateUserEvent } from 'src/lambdaTypes'
import {
  CollateralReserve,
  DebtReserve,
  MaxCollateral,
} from 'src/lending-math/lending-math.types'

export interface UserToLiquidate {
  id: string
  debtToken: DebtReserve
  collateralToken: CollateralReserve
  maxCollateral: MaxCollateral
}

export type LiquidationDetails = Omit<
  LiquidateUserEvent,
  'stateName' | 'chainId'
>
