import { gql } from '@apollo/client'

export const POOLS_QUERY = gql`
  query poolsQuery($where: Pool_filter, $block: Block_height) {
    pools(where: $where, block: $block) {
      id
      name
      symbol
      address
      poolType
      tokens {
        id
        address
        symbol
        decimals
        name
        balance
        priceRate
        weight
      }
      amp
      swapFee
      totalShares
      totalLiquidity
      totalSwapFee
      totalSwapVolume
    }
  }
`
