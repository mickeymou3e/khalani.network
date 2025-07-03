import { gql } from "@apollo/client/core"

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