import { Network } from '@constants/Networks'
import { getIntentsSubgraphClient } from '@graph/init'
import { LIQUIDITY_ENTITIES_QUERY } from './queries'
import { IntentEntity } from '../types'

export async function getLiquidityHistory(
  userAddress: string,
): Promise<IntentEntity[]> {
  const client = getIntentsSubgraphClient(Network.Khalani)
  const queryResult = await client.query({
    query: LIQUIDITY_ENTITIES_QUERY,
    variables: {
      author: userAddress,
    },
  })

  return queryResult.data.liquidityHistories as IntentEntity[]
}
