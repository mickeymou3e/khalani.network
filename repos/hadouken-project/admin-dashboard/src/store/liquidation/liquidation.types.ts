import { BigNumber } from 'ethers'

import { IInitializeSaga } from '@interfaces/data'
import { DisplayTokenBalance } from '@store/users/users.types'

export type ILiquidationsSagaState = IInitializeSaga

export interface Liquidation {
  id: string
  user: string
  liquidator: string
  debtAsset: string
  debtToCover: BigNumber
  collateralAsset: string
  liquidatedCollateralAmount: BigNumber
}

export interface LiquidationDisplay {
  id: string
  user: string
  liquidator: string
  debt: DisplayTokenBalance
  collateral: DisplayTokenBalance
}
