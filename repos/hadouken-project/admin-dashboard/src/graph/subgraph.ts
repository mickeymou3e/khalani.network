import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { AppConfig } from '@interfaces/config'
import { getEnvConfig } from '@utils/config'

const getSubgraphHttpLink = (config: AppConfig) => {
  return new HttpLink({
    uri: config.subgraph.httpUri,
  })
}

const getSubgraphWebSocketLink = (config: AppConfig) => {
  return new WebSocketLink({
    uri: config.subgraph.webSocketUri,
    options: {
      reconnect: true,
    },
  })
}

export const getSubgraphLinks = (config: AppConfig): ApolloLink => {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    getSubgraphWebSocketLink(config),
    getSubgraphHttpLink(config),
  )
}

export const subgraphClients: {
  [key: string]: ApolloClient<NormalizedCacheObject>
} = {
  ['godwoken-mainnet']: new ApolloClient({
    link: getSubgraphLinks(getEnvConfig('godwoken-mainnet')),
    cache: new InMemoryCache(),
  }),
  ['godwoken-testnet']: new ApolloClient({
    link: getSubgraphLinks(getEnvConfig('godwoken-testnet')),
    cache: new InMemoryCache(),
  }),

  ['zksync-testnet']: new ApolloClient({
    link: getSubgraphLinks(getEnvConfig('zksync-testnet')),
    cache: new InMemoryCache(),
  }),
  ['mantle-testnet']: new ApolloClient({
    link: getSubgraphLinks(getEnvConfig('mantle-testnet')),
    cache: new InMemoryCache(),
  }),
}
