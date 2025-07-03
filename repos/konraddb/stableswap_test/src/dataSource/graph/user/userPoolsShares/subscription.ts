import { gql } from '@apollo/client'

export const POOL_SHARES_SUBSCRIPTION = gql`
  subscription userPoolTokensBalances($userAddress: String!) {
    users(where: { id: $userAddress }) {
      id
      sharesOwned {
        id
        balance
        poolId {
          id
          address
        }
      }
    }
  }
`
