import { Network } from '@constants/Networks'
import { getKhalaniSubgraphClient } from '@graph/init'
import {
  BRIDGE_REQUESTS_QUERY,
  BRIDGE_REQUESTS_QUERY_BY_TX_HASH,
  LIQUIDITY_WITHDRAWN_QUERY,
} from './query'
import {
  IApolloBridgeRequestsQueryResult,
  IApolloLiquidityWithdrawnQueryResult,
} from './types'

export async function getBridgeRequestByTransactionHash(
  transactionHash: string,
  network: Network,
  isRemote: boolean,
) {
  const client = getKhalaniSubgraphClient(network)
  const queryResult: IApolloBridgeRequestsQueryResult = await client.query({
    query: BRIDGE_REQUESTS_QUERY_BY_TX_HASH,
    variables: {
      isRemote,
      transactionHash,
    },
  })

  return queryResult.data.bridgeRequestEntities[0]
}

export async function getBridgeRequests(
  network: Network,
  isRemote: boolean,
  userAddress?: string,
  first?: number,
) {
  const client = getKhalaniSubgraphClient(network)
  const queryResult: IApolloBridgeRequestsQueryResult = await client.query({
    query: BRIDGE_REQUESTS_QUERY,
    variables: {
      isRemote,
      userAddress,
      first,
    },
  })

  return queryResult.data.bridgeRequestEntities
}

export async function getWithdrawnRequests(
  userAddress?: string,
  first?: number,
) {
  const client = getKhalaniSubgraphClient(Network.Khalani)
  const queryResult: IApolloLiquidityWithdrawnQueryResult = await client.query({
    query: LIQUIDITY_WITHDRAWN_QUERY,
    variables: {
      userAddress,
      first,
    },
  })

  return queryResult.data.liquidityWithdrawnEntities
}
