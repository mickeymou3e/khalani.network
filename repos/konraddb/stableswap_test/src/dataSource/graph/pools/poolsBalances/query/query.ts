import { gql } from '@apollo/client'

export const POOL_TOKEN_BALANCES_QUERY = gql`
  query poolTokensBalances($poolId: String!) {
    poolTokens(where: { poolId: $poolId }) {
      id
      balance
      decimals
      address
      poolId {
        id
      }
    }
    pools(where: { id: $poolId }) {
      id
      address
    }
  }
`
