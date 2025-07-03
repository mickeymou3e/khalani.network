import { ApolloQueryResult } from '@apollo/client'
import { IToken } from '@interfaces/token'

import { ApolloRequest } from '../../types'

export interface ILpToken {
  id: string
  symbol: string
  address: string
  name: string
}

export interface IPoolToken extends IToken {
  isLpToken?: boolean
  balance?: string
  poolId?: {
    id: string
  }
}

export interface ITokenQueryResult {
  poolTokens: IToken[]
  poolLpTokens: ILpToken[]
}

export type IApolloTokenQueryResult = ApolloRequest<
  ApolloQueryResult<ITokenQueryResult>
>
