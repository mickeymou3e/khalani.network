import { gql } from '@apollo/client/core'

export const INTENT_ENTITY_BY_ID_QUERY = gql`
  query intentEntityByIdQuery($intentId: Bytes!) {
    intentEntities(where: { id: $intentId }) {
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
    }
  }
`
