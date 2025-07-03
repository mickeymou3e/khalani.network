import { gql } from '@apollo/client'

export const TOKENS_QUERY = gql`
  query tokens {
    poolTokens {
      id
      address
      decimals
      symbol
      name
    }
    poolLpTokens: pools {
      id
      address
      symbol
      name
    }
  }
`
