import { ApolloQueryResult } from '@apollo/client'
import { ApolloRequest } from '@graph/types'

type ISubgraphMeta = {
  block: {
    number: number
  }
}

export type IApolloSubgraphMetaQueryResult = ApolloRequest<
  ApolloQueryResult<{
    _meta: ISubgraphMeta
  }>
>
