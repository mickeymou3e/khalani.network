import { ApolloQueryResult } from '@apollo/client'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { ApolloRequest } from '@dataSource/graph/types'
import { IPool } from '@interfaces/pool'
import { BigDecimal } from '@utils/math'

export interface ITokenBalance {
  id: string
  walletAddress: string
  tokenAddress: string
  balance: BigDecimal
  updatedAt: number
}

export interface IPoolTokensQueryResult {
  poolTokens: IPoolToken[]
}

export interface IPoolsQueryResult {
  pools: Pick<IPool, 'id' | 'address'>[]
}
export type IPoolTokensBalancesQueryResult = IPoolTokensQueryResult &
  IPoolsQueryResult

export type IApolloPoolTokensBalancesSubscriptionResult = ApolloRequest<
  ApolloQueryResult<IPoolTokensBalancesQueryResult>
>

export type IApolloPoolTokensBalancesQueryResult = ApolloRequest<
  ApolloQueryResult<IPoolTokensBalancesQueryResult>
>
