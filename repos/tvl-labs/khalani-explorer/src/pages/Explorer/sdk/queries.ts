import { gql } from '@apollo/client'

export const PROCESSED_MESSAGE_QUERY = gql`
  query messageQuery($id: Bytes!) {
    messagesQuery: processedMessageIds(first: 1, where: { id: $id }) {
      id
      transactionHash
      blockNumber
      blockTimestamp
      gasLimit
      gasPrice
    }
  }
`

export const GET_PROCESSED_MESSAGES_IDS_QUERY = gql`
  query messageQuery($ids: [Bytes!]) {
    processedMessageIds(where: { id_in: $ids }, first: 1000) {
      id
      transactionHash
      blockNumber
      blockTimestamp
    }
  }
`

export const DISPATCHED_MESSAGE_QUERY = gql`
  query messageQuery($transactionHash: Bytes!) {
    messagesQuery: dispatchedMessageIds(
      first: 1
      where: { transactionHash: $transactionHash }
    ) {
      id
      transactionHash
      blockNumber
    }
  }
`

export const GET_DISPATCHED_MESSAGES_BY_TX_HASHES_QUERY = gql`
  query messageQuery($transactionHashes: [Bytes!]) {
    dispatchedMessageIds(
      where: { transactionHash_in: $transactionHashes }
      first: 1000
    ) {
      id
      transactionHash
      blockNumber
    }
  }
`

export const MESSAGES_PROCESSED_QUERY_BY_TX_HASH = gql`
  query messageProcessedEntitiesQuery($transactionHash: Bytes!) {
    messageProcessedEntities(where: { transactionHash: $transactionHash }) {
      id
      user
      tokens
      amounts
      transactionHash
      blockNumber
    }
  }
`

export const BRIDGE_REQUESTS_QUERY = gql`
  query bridgeRequestEntitiesQuery($isRemote: Boolean!) {
    bridgeRequestEntities(where: { isRemote: $isRemote }, first: 1000) {
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

export const BRIDGE_REQUESTS_QUERY_BY_TX_HASHES = gql`
  query bridgeRequestEntitiesQuery($transactionHashes: [Bytes!]) {
    bridgeRequestEntities(
      where: { transactionHash_in: $transactionHashes }
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

export const GET_BALANCER_SWAPS_BY_TX_HASH = gql`
  query getSwapsByTransactionHash($transactionHash: Bytes!) {
    swaps(where: { tx: $transactionHash }, first: 1000) {
      id
      tokenAmountIn
      tokenAmountOut
      tokenInSym
      tokenOutSym
      tokenIn
      tokenOut
      poolId {
        id
      }
      tx
    }
  }
`

export const GET_BALANCER_SWAPS_BY_TX_HASHES = gql`
  query getSwapsByTransactionHashes(
    $transactionHashes: [Bytes!]
    $first: Int
    $skip: Int
  ) {
    swaps(where: { tx_in: $transactionHashes }, first: $first, skip: $skip) {
      id
      tokenAmountIn
      tokenAmountOut
      tokenInSym
      tokenOutSym
      tokenIn
      tokenOut
      poolId {
        id
      }
      tx
    }
  }
`
