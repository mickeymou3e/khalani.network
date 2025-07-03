import { ApolloQueryResult } from '@apollo/client'
import { BigDecimal } from '@utils/math'

import { IPoolToken } from '../pools/poolsTokens/types'
import { ApolloRequest } from '../types'

export type Liquidation = {
  id: string
  user: string
  timestamp: number
  repayAmount: BigDecimal
  profit: BigDecimal
  debtToken: IPoolToken | undefined
  collateralToken: IPoolToken | undefined
}

export interface ILiquidationQueryResult {
  id: string
  user: string
  timestamp: number
  repayAmount: string
  profit: string

  debtToken: string
  collateralToken: string
}

export interface ILiquidationsQueryResultData {
  liquidations: ILiquidationQueryResult[]
}

export type IApolloLiquidationQueryResult = ApolloRequest<
  ApolloQueryResult<ILiquidationsQueryResultData>
>
