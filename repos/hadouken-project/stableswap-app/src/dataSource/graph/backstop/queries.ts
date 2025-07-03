import { gql } from '@apollo/client'

export const LIQUIDATIONS_QUERY = gql`
  query liquidations($block: Block_height, $skip: Int, $limit: Int) {
    liquidations(
      block: $block
      skip: $skip
      first: $limit
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      user
      timestamp
      repayAmount
      profit
      debtToken
      collateralToken
    }
  }
`
