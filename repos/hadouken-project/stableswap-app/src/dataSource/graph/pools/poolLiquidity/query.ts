import { gql } from '@apollo/client'

export const WEIGHTED_POOL_JOIN_EXITS_QUERY = gql`
  query poolJoinExitsQuery($where: JoinExit_filter, $limit: Int!, $skip: Int!) {
    joinExits(
      where: $where
      orderBy: timestamp
      orderDirection: desc
      first: $limit
      skip: $skip
    ) {
      id
      amounts
      timestamp
      tx
      type
    }
  }
`

export const COMPOSABLE_POOL_JOIN_EXITS_QUERY = gql`
  query poolJoinExitsQueryComposable(
    $whereJoins: Swap_filter
    $whereExits: Swap_filter
    $limit: Int!
    $skipJoins: Int!
    $skipExits: Int!
  ) {
    joins: swaps(
      where: $whereJoins
      orderBy: timestamp
      orderDirection: desc
      first: $limit
      skip: $skipJoins
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
    }

    exits: swaps(
      where: $whereExits
      orderBy: timestamp
      orderDirection: desc
      first: $limit
      skip: $skipExits
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
    }
  }
`
