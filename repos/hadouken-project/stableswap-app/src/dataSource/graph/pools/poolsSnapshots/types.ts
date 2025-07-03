import { BigNumber } from 'ethers'

import { ApolloQueryResult } from '@apollo/client'
import { IPool } from '@interfaces/pool'
import { BigDecimal } from '@utils/math'

import { ApolloRequest } from '../../types'

// GRAPH
export interface IPoolSnapshotRegistry {
  id: string
  latestSnapshot: {
    id: string
    apy: string[]
    virtualPrice: string
  }
}

export interface IPoolSnapshotRegistryQueryResult {
  poolSnapshotRegistries: IPoolSnapshotRegistry[]
}

export type IApolloPoolSnapshotRegistryQueryResult = ApolloRequest<
  ApolloQueryResult<IPoolSnapshotRegistryQueryResult>
>

export enum MeasureTimeframe {
  DAY = 'DAY',
  WEEK = 'WEEK',
}

// APPLICATION MODEL
export interface IPoolSnapshotHadouken {
  poolId: string
  apy: {
    [MeasureTimeframe.DAY]: BigNumber
    [MeasureTimeframe.WEEK]: BigNumber
  }
  virtualPrice: BigNumber
}

// GRAPH
export interface IPoolSnapshotQueryResult {
  id: string
  totalLiquidity: string
  totalSwapFee: string
  totalSwapVolume: string
  totalShares: string
}

export interface IPoolSnapshotQueryResultData {
  poolSnapshotQueryResult: IPoolSnapshotQueryResult[]
}

export type IApolloPoolSnapshotsQueryResult = ApolloRequest<
  ApolloQueryResult<IPoolSnapshotQueryResultData>
>

export interface IPoolSnapshot {
  id: IPool['id']
  totalLiquidity: BigDecimal
  totalSwapFee: BigDecimal
  totalSwapVolume: BigDecimal
  totalShares: BigDecimal
}
