import { call, select, take } from 'typed-redux-saga'

import { ApolloQueryResult, gql } from '@apollo/client'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { ApolloRequest } from '../types'

type BlockResult = {
  _meta: {
    block: {
      number: number
    }
  }
}

const BLOCK_QUERY = gql`
  query block {
    _meta {
      block {
        number
      }
    }
  }
`

function* fetchSubgraphLatestBlock() {
  const chainId = yield* select(networkSelectors.applicationChainId)
  try {
    const queryResult = yield* call<
      ApolloRequest<ApolloQueryResult<BlockResult>>
    >(subgraphClients[chainId].query, {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: BLOCK_QUERY,
    })

    return queryResult.data._meta.block.number
  } catch {
    return undefined
  }
}

export function* waitForSubgraphToBeUpToDate(
  blockNumber: number | undefined,
): Generator {
  if (!blockNumber) return false

  let blockUpToDate = false

  while (!blockUpToDate) {
    yield* take(networkActions.updateLatestBlock)

    const latestSubgraphBlockNumber = yield* call(fetchSubgraphLatestBlock)

    if (latestSubgraphBlockNumber) {
      blockUpToDate = blockNumber <= latestSubgraphBlockNumber
    }
  }
}
