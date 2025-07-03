import { gql } from '@apollo/client/core'

export const BRIDGE_REQUESTS_QUERY_BY_TX_HASH = gql`
  query bridgeRequestEntitiesQuery($transactionHash: Bytes!) {
    bridgeRequestEntities(
      where: { transactionHash: $transactionHash }
      first: 1000
    ) {
      id
      destinationChainId
      user
      tokens
      amounts
      transactionHash
      blockNumber
      blockTimestamp
      callData
      gasLimit
      gasPrice
    }
  }
`

export const BRIDGE_REQUESTS_QUERY = gql`
  query bridgeRequestEntitiesQuery(
    $isRemote: Boolean!
    $userAddress: String
    $first: Int
  ) {
    bridgeRequestEntities(
      where: { isRemote: $isRemote, user: $userAddress }
      first: $first
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      destinationChainId
      user
      tokens
      amounts
      transactionHash
      blockNumber
      blockTimestamp
      gasLimit
      gasPrice
    }
  }
`

export const LIQUIDITY_WITHDRAWN_QUERY = gql`
  query liquidityWithdrawnEntitiesQuery($userAddress: String, $first: Int) {
    liquidityWithdrawnEntities(
      where: { user: $userAddress }
      first: $first
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      destinationChainId
      user
      tokens
      amounts
      transactionHash
      blockNumber
      blockTimestamp
      gasLimit
      gasPrice
    }
  }
`
