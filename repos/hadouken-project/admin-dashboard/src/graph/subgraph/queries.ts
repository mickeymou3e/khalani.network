import { call } from 'typed-redux-saga'

import { gql } from '@apollo/client'
import { subgraphClients } from '@graph/subgraph'
import { APP_ENVIRONMENT } from '@utils/stringOperations'

import { IApolloSubgraphMetaQueryResult } from './types'

const BLOCK_QUERY = gql`
  query block {
    _meta {
      block {
        number
      }
    }
  }
`

export function* shouldUseSubgraph(blockNumber: number): Generator {
  // disable subgraph for now
  // return true
  try {
    const subgraphClient = subgraphClients[APP_ENVIRONMENT]

    const block = yield* call<IApolloSubgraphMetaQueryResult>(
      subgraphClient.query,
      {
        query: BLOCK_QUERY,
        fetchPolicy: 'network-only',
      },
    )

    return blockNumber - block.data._meta.block.number < 50
  } catch (e) {
    console.error(e)
    return false
  }
}
