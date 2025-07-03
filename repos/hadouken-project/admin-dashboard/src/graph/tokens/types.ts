import { ApolloQueryResult } from '@apollo/client'
import { ITokenBalance } from '@interfaces/tokens'
import { SwapToken } from '@store/swapTokens/swapTokens.types'

import { ApolloRequest } from '../types'

export interface IToken {
  decimals: number
  symbol: string
  address: string
}

export interface IApplicationToken extends IToken {
  isAToken: boolean
  isStableDebt: boolean
  isVariableDebt: boolean
}

export interface IApplicationTokenQueryResult {
  poolTokens: IApplicationToken[]
}

export type IApolloApplicationTokenQueryResult = ApolloRequest<
  ApolloQueryResult<IApplicationTokenQueryResult>
>

export interface ITokenBalancesQueryResult {
  tokenBalances: ITokenBalance[]
}

export type IApolloTokenBalanceQueryResult = ApolloRequest<
  ApolloQueryResult<ITokenBalancesQueryResult>
>

export type IApolloTokenBalancesQueryResult = ApolloRequest<
  ApolloQueryResult<{ tokenBalances: ITokenBalance[] }>
>

export type IApplicationSwapTokenQueryResult = {
  tokens: SwapToken[]
}

export type IApolloSwapTokensQueryResult = ApolloRequest<
  ApolloQueryResult<IApplicationSwapTokenQueryResult>
>
