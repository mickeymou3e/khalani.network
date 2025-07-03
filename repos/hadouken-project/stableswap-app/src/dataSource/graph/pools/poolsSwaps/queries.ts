import { gql } from '@apollo/client'

export const POOL_SWAPS_QUERY = gql`
  query poolSwaps($where: Swap_filter, $limit: Int!, $skip: Int!) {
    swaps(
      where: $where
      orderBy: timestamp
      orderDirection: desc
      first: $limit
      skip: $skip
    ) {
      id
      tokenIn
      tokenInSym
      tokenOut
      tokenOutSym
      tokenAmountIn
      tokenAmountOut
      timestamp
      tx
      valueUSD
    }
  }
`
