import { Network } from '@constants/Networks'
import { getIntentsSubgraphClient } from '@graph/init'
import { SWAP_INTENT_FILLED_QUERY } from './queries'

export async function getSwapIntentFilled(
  intentId: string,
  network: Network,
): Promise<SwapIntentFilled> {
  const client = getIntentsSubgraphClient(network)
  const queryResult = await client.query({
    query: SWAP_INTENT_FILLED_QUERY,
    variables: {
      intentId,
    },
  })

  return queryResult.data.swapIntentFilledEntities[0]
}
