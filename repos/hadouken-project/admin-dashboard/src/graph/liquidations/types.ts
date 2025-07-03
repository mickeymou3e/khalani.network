import { BigNumber } from 'ethers'

import { ApolloQueryResult } from '@apollo/client'
import { IUser } from '@graph/users/types'

import { ApolloRequest } from '../types'

export interface ILiquidation {
  id: string
  user: IUser
  liquidator: string
  debtAsset: string
  debtToCover: BigNumber
  collateralAsset: string
  liquidatedCollateralAmount: BigNumber
}

export interface ILiquidationsQueryResult {
  liquidations: ILiquidation[]
}

export type IApolloLiquidationsQueryResult = ApolloRequest<
  ApolloQueryResult<ILiquidationsQueryResult>
>
