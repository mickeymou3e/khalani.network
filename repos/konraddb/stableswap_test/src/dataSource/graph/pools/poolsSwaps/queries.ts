import { gql } from '@apollo/client'

export const POOL_SWAPS_QUERY = gql`
  query poolSwapsQuery(
    $poolId: String!
    $userAddress: String!
    $timestamp: Int!
  ) {
    latest10Swaps: swaps(
      orderDirection: desc
      orderBy: timestamp
      first: 10
      where: { poolId: $poolId }
    ) {
      tokenIn
      tokenAmountIn
      tokenOut
      tokenAmountOut
      timestamp
      userAddress {
        id
      }
      poolId {
        id
      }
    }
    last24hSwaps: swaps(where: { poolId: $poolId, timestamp_gt: $timestamp }) {
      tokenIn
      tokenAmountIn
      tokenOut
      tokenAmountOut
      timestamp
      userAddress {
        id
      }
      poolId {
        id
      }
    }
    userLatest10Swaps: swaps(
      orderDirection: desc
      orderBy: timestamp
      first: 10
      where: { userAddress: $userAddress }
    ) {
      tokenIn
      tokenAmountIn
      tokenOut
      tokenAmountOut
      timestamp
      userAddress {
        id
      }
      poolId {
        id
      }
    }
  }
`
