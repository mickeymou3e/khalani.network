import { ApolloQueryResult } from '@apollo/client'
import { ApolloRequest } from '@dataSource/graph/types'

export interface IBlockQueryResult {
  id: string
  number: string
  timestamp: string
}

export type IBlock = {
  id: string
  number: number
  timestamp: number
}

export type IBlocksQueryResultData = {
  blocksQuery: IBlockQueryResult[]
}

export type IApolloBlocksQueryResult = ApolloRequest<
  ApolloQueryResult<IBlocksQueryResultData>
>
