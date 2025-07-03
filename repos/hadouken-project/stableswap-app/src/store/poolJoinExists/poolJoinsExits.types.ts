import { LiquidityToggle } from '@containers/pools/PoolLiquidity/PoolLiquidity.types'
import { IJoinExit } from '@dataSource/graph/pools/poolLiquidity/types'

export type IPoolJoinExitsSagaState = { isFetching: boolean }

export interface IPoolJoinsExitsPayload {
  poolId: string
  userId: string | null
  liquidityToggle?: LiquidityToggle
}

export interface ILiquidityProvision {
  allLiquidity: IJoinExit[]
  myLiquidity: IJoinExit[]
}

export interface ILiquidityProvisionSuccess extends ILiquidityProvision {
  hasMore: {
    allLiquidity?: boolean
    myLiquidity?: boolean
  }
}
