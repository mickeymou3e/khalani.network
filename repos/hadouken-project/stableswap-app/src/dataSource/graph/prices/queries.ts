import { gql } from '@apollo/client'

export const TOKENS_PRICES_QUERY = gql`
  query prices {
    tokens {
      address
      latestUSDPrice
    }
  }
`
