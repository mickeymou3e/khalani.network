import { ApolloQueryResult } from '@apollo/client'
import { IToken } from '@interfaces/token'
import { ILendingReserve } from '@store/lending/lending.types'

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
  lendingReserves: ILendingReserve[]
  chainId: string
}

export type IApolloTokenQueryResult = ApolloRequest<
  ApolloQueryResult<ITokenQueryResult>
>
