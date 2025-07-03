import { ApolloQueryResult } from '@apollo/client'
import { ApolloRequest } from '@dataSource/graph/types'

export interface ISwap {
  id: string
  tokenIn: string
  tokenInSym: string
  tokenOut: string
  tokenOutSym: string
  tokenAmountIn: string
  tokenAmountOut: string
  timestamp: string
  tx: string
  valueUSD?: string
}

export type IQueryPoolSwaps = {
  poolId: string
  userId: string | null
  limit: number
  skip: number
}

export interface ISwapsQueryResult {
  swaps: ISwap[]
}

export type IApolloPoolSwapsQuery = ApolloRequest<
  ApolloQueryResult<ISwapsQueryResult>
>
