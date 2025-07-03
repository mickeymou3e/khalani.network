import { gql } from '@apollo/client/core'

export const BRIDGE_ENTITIES_QUERY = gql`
  query bridgeHistoriesQuery($author: Bytes!) {
    bridgeHistories(where: { author: $author }) {
      id
      transactionHash
      blockNumber
      blockTimestamp
      gasLimit
      gasPrice
      callData
      author
      srcMToken
      srcAmount
      mTokens
      mAmounts
      status
      outcomeAssetStructure
      fillStructure
    }
  }
`
