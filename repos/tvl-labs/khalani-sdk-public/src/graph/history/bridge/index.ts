import { Network } from '@constants/Networks'
import { getIntentsSubgraphClient } from '@graph/init'
import { BRIDGE_ENTITIES_QUERY } from './queries'
import { IntentEntity } from '../types'

export async function getBridgeHistory(
  userAddress: string,
): Promise<IntentEntity[]> {
  const client = getIntentsSubgraphClient(Network.Khalani)
  const queryResult = await client.query({
    query: BRIDGE_ENTITIES_QUERY,
    variables: {
      author: userAddress,
    },
  })

  return queryResult.data.bridgeHistories as IntentEntity[]
}
