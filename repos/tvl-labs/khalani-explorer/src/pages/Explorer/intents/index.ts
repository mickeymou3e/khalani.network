import { Network } from '@constants/Networks'

import { getIntentsSubgraphClient } from './init'
import { transferSwapIntentResponse } from './mappers'
import {
  SWAP_INTENT_BOOK_BY_TX_HASH_QUERY,
  SWAP_INTENT_BOOK_QUERY,
} from './queries'
import { SwapIntentBook } from './types'

export async function getSwapIntentBooks(): Promise<SwapIntentBook[]> {
  const client = getIntentsSubgraphClient(Network.Khalani)
  const queryResult = await client.query({
    query: SWAP_INTENT_BOOK_QUERY,
  })

  return queryResult.data.swapIntentBookEntities.map(transferSwapIntentResponse)
}

export async function getSwapIntentBookByTxHash(
  transactionHash: string,
): Promise<SwapIntentBook> {
  const client = getIntentsSubgraphClient(Network.Khalani)
  const queryResult = await client.query({
    query: SWAP_INTENT_BOOK_BY_TX_HASH_QUERY,
    variables: {
      transactionHash,
    },
  })

  return queryResult.data.swapIntentBookEntities.map(
    transferSwapIntentResponse,
  )[0]
}
