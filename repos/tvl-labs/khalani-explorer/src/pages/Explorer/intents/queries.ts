import { gql } from '@apollo/client/core'

export const SWAP_INTENT_BOOK_QUERY = gql`
  query swapIntentBookEntitiesQuery {
    swapIntentBookEntities {
      id
      blockNumber
      blockTimestamp
      callData
      gasLimit
      gasPrice
      intent
      intentId
      signature
      transactionHash
      status
    }
  }
`

export const SWAP_INTENT_BOOK_BY_TX_HASH_QUERY = gql`
  query swapIntentBookEntitiesQuery($transactionHash: Bytes!) {
    swapIntentBookEntities(where: { transactionHash: $transactionHash }) {
      id
      blockNumber
      blockTimestamp
      callData
      gasLimit
      gasPrice
      intent
      intentId
      signature
      transactionHash
      status
    }
  }
`
