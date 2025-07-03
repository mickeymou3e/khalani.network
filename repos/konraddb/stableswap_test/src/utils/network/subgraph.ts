/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import config from '@config'

import { Subgraph } from './subgraph.types'

const balancerSubgraphHttpLink = new HttpLink({
  uri: config.subgraphs.balancer.httpUri,
})
const blocksSubgraphHttpLink = new HttpLink({
  uri: config.subgraphs.blocks.httpUri,
})

const subgraphHttpLink = split(
  ({ getContext }) => {
    const context = getContext()

    return context?.type === Subgraph.Balancer
  },
  balancerSubgraphHttpLink,
  blocksSubgraphHttpLink,
)

const balancerSubgraphWebSocketLink = new WebSocketLink({
  uri: config.subgraphs.balancer.webSocketUri,
  options: {
    reconnect: true,
  },
})
const blocksSubgraphWebSocketLink = new WebSocketLink({
  uri: config.subgraphs.blocks.webSocketUri,
  options: {
    reconnect: true,
  },
})

const subgraphWebSocketLink = split(
  ({ getContext }) => {
    const context = getContext()

    return context?.type === Subgraph.Balancer
  },
  balancerSubgraphWebSocketLink,
  blocksSubgraphWebSocketLink,
)

const subgraphLinks = split(
  ({ query }) => {
    const definition = getMainDefinition(query)

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  subgraphWebSocketLink,
  subgraphHttpLink,
)

export const subgraphClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    link: subgraphLinks,
    cache: new InMemoryCache(),
  },
)
