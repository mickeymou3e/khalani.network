import fetch from 'cross-fetch'

import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

import config from '../../../config'
import { Network } from '../../../constants/Networks'
import {
  DISPATCHED_MESSAGE_QUERY,
  GET_BALANCER_SWAPS_BY_TX_HASH,
  GET_BALANCER_SWAPS_BY_TX_HASHES,
  GET_DISPATCHED_MESSAGES_BY_TX_HASHES_QUERY,
  GET_PROCESSED_MESSAGES_IDS_QUERY,
  PROCESSED_MESSAGE_QUERY,
  BRIDGE_REQUESTS_QUERY_BY_TX_HASHES,
  BRIDGE_REQUESTS_QUERY_BY_TX_HASH,
  MESSAGES_PROCESSED_QUERY_BY_TX_HASH,
  BRIDGE_REQUESTS_QUERY,
} from './queries'
import {
  BridgeProcessedMessage,
  IApolloBalancerSwapsQueryResult,
  IApolloBridgeRequestsQueryResult,
  IApolloIMessagesProcessedQueryResult,
  ISwapGraphEntity,
} from './types'

const cachedKhalaniSubgraphClients = new Map<
  Network,
  ApolloClient<NormalizedCacheObject>
>()

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const balancerSubgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: config.subgraphs.balancer.httpUri,
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions,
})

function getKhalaniSubgraphClient(network: Network) {
  const cachedSubgraphClient = cachedKhalaniSubgraphClients.get(network)
  if (cachedSubgraphClient) {
    return cachedSubgraphClient
  }

  const client = new ApolloClient({
    link: new HttpLink({
      uri: (config.explorer.subgraph as {
        [key: string]: string | undefined
      })[network] as string,
      fetch,
    }),
    cache: new InMemoryCache(),
    defaultOptions,
  })

  cachedKhalaniSubgraphClients.set(network, client)

  return client
}

export async function getProcessedMailboxMessage(
  id: string,
  network: Network,
): Promise<BridgeProcessedMessage> {
  const client = getKhalaniSubgraphClient(network)
  const queryResult = await client.query({
    query: PROCESSED_MESSAGE_QUERY,
    variables: {
      id,
    },
  })

  return queryResult.data.messagesQuery[0]
}

export async function getProcessedMailboxMessagesByIds(
  ids: string[],
  network: Network,
): Promise<BridgeProcessedMessage[]> {
  const client = getKhalaniSubgraphClient(network)
  const queryResult = await client.query({
    query: GET_PROCESSED_MESSAGES_IDS_QUERY,
    variables: {
      ids,
    },
  })

  return queryResult.data.processedMessageIds
}

export async function getDispatchedMailboxMessage(
  transactionHash: string,
  network: Network,
): Promise<BridgeProcessedMessage> {
  const client = getKhalaniSubgraphClient(network)
  const queryResult = await client.query({
    query: DISPATCHED_MESSAGE_QUERY,
    variables: {
      transactionHash,
    },
  })

  return queryResult.data.messagesQuery[0]
}

export async function getDispatchedMailboxMessages(
  transactionHashes: string[],
  network: Network,
): Promise<BridgeProcessedMessage[]> {
  const client = getKhalaniSubgraphClient(network)
  const queryResult = await client.query({
    query: GET_DISPATCHED_MESSAGES_BY_TX_HASHES_QUERY,
    variables: {
      transactionHashes,
    },
  })

  return queryResult.data.dispatchedMessageIds
}

export async function getBalancerSwapsTransactionByHash(
  transactionHash: string,
) {
  const queryResult: IApolloBalancerSwapsQueryResult = await balancerSubgraphClient.query(
    {
      query: GET_BALANCER_SWAPS_BY_TX_HASH,
      variables: {
        transactionHash,
      },
    },
  )

  return queryResult.data.swaps
}

const MAX_FIRST_SIZE = 1000
export async function getBalancerSwapsByTransactionHashes(
  transactionHashes: string[],
) {
  const swaps: ISwapGraphEntity[] = []
  let lastCount: number | null = null

  while (lastCount === null || lastCount === MAX_FIRST_SIZE) {
    const queryResult: IApolloBalancerSwapsQueryResult = await balancerSubgraphClient.query(
      {
        query: GET_BALANCER_SWAPS_BY_TX_HASHES,
        variables: {
          transactionHashes,
          first: MAX_FIRST_SIZE,
          skip: swaps.length,
        },
      },
    )

    swaps.push(...queryResult.data.swaps)
    lastCount = queryResult.data.swaps.length
  }

  return swaps
}

export async function getMessageProcessedByTransactionHash(
  transactionHash: string,
  network: Network,
) {
  const client = getKhalaniSubgraphClient(network)
  const queryResult: IApolloIMessagesProcessedQueryResult = await client.query({
    query: MESSAGES_PROCESSED_QUERY_BY_TX_HASH,
    variables: {
      transactionHash,
    },
  })

  return queryResult.data.messageProcessedEntities[0]
}

export async function getBridgeRequests(network: Network, isRemote: boolean) {
  const client = getKhalaniSubgraphClient(network)
  const queryResult: IApolloBridgeRequestsQueryResult = await client.query({
    query: BRIDGE_REQUESTS_QUERY,
    variables: {
      isRemote,
    },
  })

  return queryResult.data.bridgeRequestEntities
}

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

export async function getBridgeRequestsByTransactionHashes(
  transactionHashes: string[],
  network: Network,
  isRemote: boolean,
) {
  const client = getKhalaniSubgraphClient(network)
  const queryResult: IApolloBridgeRequestsQueryResult = await client.query({
    query: BRIDGE_REQUESTS_QUERY_BY_TX_HASHES,
    variables: {
      isRemote,
      transactionHashes,
    },
  })

  return queryResult.data.bridgeRequestEntities
}
