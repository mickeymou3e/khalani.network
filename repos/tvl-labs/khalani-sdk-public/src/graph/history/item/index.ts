import { Network } from '@constants/Networks'
import { getIntentsSubgraphClient } from '@graph/init'
import { INTENT_ENTITY_BY_ID_QUERY } from './queries'
import { IntentEntity } from '../types'

export async function getIntentById(
  intentId: string,
): Promise<IntentEntity | null> {
  const client = getIntentsSubgraphClient(Network.Khalani)
  const queryResult = await client.query({
    query: INTENT_ENTITY_BY_ID_QUERY,
    variables: {
      intentId,
    },
  })

  const entities = queryResult.data.intentEntities

  if (entities.length > 0) {
    return entities[0]
  }

  return null
}
