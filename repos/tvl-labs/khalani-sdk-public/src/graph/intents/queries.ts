import { gql } from '@apollo/client/core'

export const SWAP_INTENT_FILLED_QUERY = gql`
  query swapIntentFilledEntitiesQuery($intentId: Bytes!) {
    swapIntentFilledEntities(where: { intentId: $intentId }) {
      id
      transactionHash
      blockNumber
      blockTimestamp
      gasLimit
      gasPrice
      callData
      intentId
      author
      fillAmount
      fillTimeStamp
      filler
    }
  }
`
