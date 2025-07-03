import { ApolloQueryResult } from '@apollo/client'

import { ApolloRequest } from '../../types'

export interface IPoolTokenQueryResult {
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
  balance: string
  priceRate: string
  weight: string
}

export interface IPoolQueryResult {
  id: string
  name: string
  address: string
  symbol: string
  poolType: string
  tokens: IPoolTokenQueryResult[]
  amp: string
  swapFee: string
  totalShares: string
  totalLiquidity: string
  totalSwapFee: string
  totalSwapVolume: string
  owner: string
  createTime: number
}

export interface IPoolsQueryResultData {
  pools: IPoolQueryResult[]
}

export type IApolloPoolQueryResult = ApolloRequest<
  ApolloQueryResult<IPoolsQueryResultData>
>
