import fetch from 'cross-fetch'

import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core'
import config from '@config'
import { Network } from '@constants/Networks'

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

export function getIntentsSubgraphClient(network: Network) {
  const cachedSubgraphClient = cachedKhalaniSubgraphClients.get(network)
  if (cachedSubgraphClient) {
    return cachedSubgraphClient
  }

  const client = new ApolloClient({
    link: new HttpLink({
      uri: (config.intents.subgraph as {
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
