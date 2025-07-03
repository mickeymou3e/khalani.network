import { gql } from '@apollo/client'

export const POOLS_HADOUKEN_SNAPSHOTS_QUERY = gql`
  query poolSnapshotQuery($where: PoolSnapshotHadoukenRegistry_filter) {
    poolSnapshotRegistries: poolSnapshotHadoukenRegistries(where: $where) {
      id
      latestSnapshot {
        id
        apy
        virtualPrice
      }
    }
  }
`

export const POOLS_SNAPSHOTS_QUERY = gql`
  query poolSnapshotQuery($where: PoolSnapshot_filter) {
    poolSnapshots(where: $where) {
      id
      pool {
        id
      }
      swapVolume
      swapFees
      swapsCount
      totalShares
      liquidity
      amounts
    }
  }
`

export const POOLS_QUERY = gql`
  query poolSnapshotQuery($where: Pool_filter, $block: Block_height) {
    poolSnapshotQueryResult: pools(where: $where, block: $block) {
      id
      totalLiquidity
      totalSwapFee
      totalSwapVolume
      totalShares
    }
  }
`
