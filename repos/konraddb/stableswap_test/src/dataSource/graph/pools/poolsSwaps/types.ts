import { ApolloQueryResult } from '@apollo/client'

import { ApolloRequest } from '../../types'

export interface IPoolVolume {
  id: string
  timeStamp: string
  poolId: string
  utcDay: string
  volume: string
}

export interface IPoolSwapQueryResult {
  tokenIn: string
  tokenAmountIn: string
  tokenOut: string
  tokenAmountOut: string
  timestamp: number
  poolId: {
    id: string
  }
  userAddress: {
    id: string
  }
}

export interface IPoolSwapsQueryResult {
  latest10Swaps: IPoolSwapQueryResult[]
  last24hSwaps: IPoolSwapQueryResult[]
  userLatest10Swaps: IPoolSwapQueryResult[]
}

export type IApolloPoolSwapsQueryResult = ApolloRequest<
  ApolloQueryResult<IPoolSwapsQueryResult>
>
