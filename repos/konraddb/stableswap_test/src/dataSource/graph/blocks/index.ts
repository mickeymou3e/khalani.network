import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { subgraphClient } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { BLOCKS_QUERY } from './queries'
import {
  IApolloBlocksQueryResult,
  IBlock,
  IBlocksQueryResultData,
} from './types'

export function* queryBlocks({
  timestamp,
}: {
  timestamp: number
}): Generator<StrictEffect, IBlocksQueryResultData> {
  const queryResult = yield* call<IApolloBlocksQueryResult>(
    subgraphClient.query,
    {
      context: {
        type: Subgraph.Blocks,
      },
      query: BLOCKS_QUERY,
      variables: {
        timestamp,
      },
    },
  )

  return queryResult.data
}

export function* fetchBlock(
  timestamp: number,
): Generator<StrictEffect, IBlock> {
  const data = yield* queryBlocks({ timestamp })
  const blockQuery = data.blocksQuery[0]

  return {
    id: blockQuery?.id,
    number: Number(blockQuery?.number),
    timestamp: Number(blockQuery?.timestamp),
  } as IBlock
}
