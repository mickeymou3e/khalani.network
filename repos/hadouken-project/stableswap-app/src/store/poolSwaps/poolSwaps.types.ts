import { ISwap } from '@dataSource/graph/pools/poolsSwaps/types'

export interface IPoolSwapsPayload {
  poolId: string
  isInitializeFetch: boolean
}

export interface IPoolSwaps {
  swaps: ISwap[]
  hasMore: boolean
}

export interface IBaseOptions {
  userId: null
  poolId: string
  limit: number
}
