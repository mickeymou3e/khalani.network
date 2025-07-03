import { ApolloQueryResult } from '@apollo/client'
import { ApolloRequest } from '@dataSource/graph/types'

import { ISwap } from '../poolsSwaps/types'

export enum LiquidityProvisionType {
  Join = 'Join',
  Exit = 'Exit',
}

export type IQueryPoolJoinsExits = {
  poolId: string
  userId: string | null
  limit: number
  skip: { joins: number; exits: number }
}

export interface IJoinExit {
  id: string
  amounts: string[]
  timestamp: string
  tx: string
  type: LiquidityProvisionType
  symbols?: string[]
}

export interface IJoinExitQueryResult {
  joinExits: IJoinExit[]
}

export interface IJoinExitQueryResultComposableStable {
  joins: ISwap[]
  exits: ISwap[]
}

export type IApollPoolJoinsExitsQueryResult<T> = ApolloRequest<
  ApolloQueryResult<T>
>
