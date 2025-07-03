import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { getChainConfig } from '@config'
import { Network } from '@constants/Networks'

import { Subgraph } from './subgraph.types'

const getBalancerSubgraphHttpLink = (chainId: string) =>
  new HttpLink({
    uri: getChainConfig(chainId).subgraphs.balancer.httpUri,
  })

const getSubgraphHttpLink = (chainId: string) =>
  split(({ getContext }) => {
    const context = getContext()

    return context?.type === Subgraph.Balancer
  }, getBalancerSubgraphHttpLink(chainId))

const getBalancerSubgraphWebSocketLink = (chainId: string) =>
  new WebSocketLink({
    uri: getChainConfig(chainId).subgraphs.balancer.webSocketUri,
    options: {
      reconnect: true,
    },
  })

const getSubgraphWebSocketLink = (chainId: string) =>
  split(({ getContext }) => {
    const context = getContext()

    return context?.type === Subgraph.Balancer
  }, getBalancerSubgraphWebSocketLink(chainId))

const getSubgraphLinks = (chainId: string) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    getSubgraphWebSocketLink(chainId),
    getSubgraphHttpLink(chainId),
  )

export const subgraphClients: {
  [key: string]: ApolloClient<NormalizedCacheObject>
} =
  process.env.CONFIG === 'testnet'
    ? {
        [Network.GodwokenTestnet]: new ApolloClient({
          link: getSubgraphLinks(Network.GodwokenTestnet),
          cache: new InMemoryCache(),
        }),
        [Network.ZksyncTestnet]: new ApolloClient({
          link: getSubgraphLinks(Network.ZksyncTestnet),
          cache: new InMemoryCache(),
        }),
        [Network.MantleTestnet]: new ApolloClient({
          link: getSubgraphLinks(Network.MantleTestnet),
          cache: new InMemoryCache(),
        }),
      }
    : {
        [Network.GodwokenMainnet]: new ApolloClient({
          link: getSubgraphLinks(Network.GodwokenMainnet),
          cache: new InMemoryCache(),
        }),
        [Network.ZksyncMainnet]: new ApolloClient({
          link: getSubgraphLinks(Network.ZksyncMainnet),
          cache: new InMemoryCache(),
        }),
      }
