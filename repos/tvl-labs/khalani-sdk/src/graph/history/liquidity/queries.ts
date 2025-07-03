import { gql } from '@apollo/client/core'

export const LIQUIDITY_ENTITIES_QUERY = gql`
  query liquidityHistoriesQuery($author: Bytes!) {
    liquidityHistories(where: { author: $author }) {
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
