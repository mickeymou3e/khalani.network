import { gql } from '@apollo/client'

export const POOL_TOKENS_BALANCES_SUBSCRIPTION = gql`
  subscription poolTokensBalances($poolsIds: [String]!) {
    poolTokens(where: { poolId_in: $poolsIds }) {
      id
      balance
      decimals
      address
      poolId {
        id
      }
    }
  }
`
