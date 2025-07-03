import { POOL_DECIMALS } from '@constants/Pool'
import {
  IPoolQueryResult,
  IPoolTokenQueryResult,
} from '@dataSource/graph/pools/pools/types'
import { mapTokenNames } from '@dataSource/graph/pools/poolsTokens/mapper'
import { address } from '@dataSource/graph/utils/formatters'
import { IPool, IPoolToken, PoolType } from '@interfaces/pool'
import { BigDecimal } from '@utils/math'

export function mapPoolQueryResultToPool(
  poolQueryResult: IPoolQueryResult,
): IPool {
  return {
    id: poolQueryResult.id,
    address: address(poolQueryResult.address),
    name: poolQueryResult.name,
    symbol: poolQueryResult.symbol,
    decimals: POOL_DECIMALS,
    poolType: mapToPoolType(poolQueryResult.poolType),
    tokens: poolQueryResult.tokens
      .map(mapTokenPoolQueryResultToPoolToken)
      .map(mapTokenNames),
    amp: poolQueryResult.amp,
    swapFee: BigDecimal.fromString(poolQueryResult.swapFee),
    totalShares: BigDecimal.fromString(poolQueryResult.totalShares),
    totalLiquidity: BigDecimal.fromString(poolQueryResult.totalLiquidity),
    totalSwapFee: BigDecimal.fromString(poolQueryResult.totalSwapFee),
    totalSwapVolume: BigDecimal.fromString(poolQueryResult.totalSwapVolume),
  } as IPool
}

export function mapTokenPoolQueryResultToPoolToken(
  poolTokenQueryResult: IPoolTokenQueryResult,
): IPoolToken {
  return {
    id: poolTokenQueryResult.id,
    address: address(poolTokenQueryResult.address),
    name: poolTokenQueryResult.name,
    symbol: poolTokenQueryResult.symbol,
    decimals: poolTokenQueryResult.decimals,
    weight: poolTokenQueryResult.weight
      ? BigDecimal.fromString(poolTokenQueryResult.weight)
      : BigDecimal.from(0),
    priceRate: BigDecimal.fromString(poolTokenQueryResult.priceRate),
    balance: BigDecimal.fromString(
      poolTokenQueryResult.balance,
      poolTokenQueryResult.decimals,
    ),
  }
}

export type ByKey<T, K extends keyof T> = {
  [key in K]: T
}

export function reduceByKey<T, K extends keyof T>(key: K) {
  return (acc: ByKey<T, K>, current: T) => {
    const value = (current[key] as unknown) as string
    return {
      ...acc,
      [value]: current,
    }
  }
}

export function mapToPoolType(poolType: string): PoolType {
  switch (poolType) {
    case PoolType.Stable:
      return PoolType.Stable
    case PoolType.StablePhantom:
      return PoolType.StablePhantom
    case PoolType.Weighted:
      return PoolType.Weighted
    case PoolType.Linear:
      return PoolType.Linear
    case PoolType.AaveLinear:
      return PoolType.AaveLinear
    case PoolType.ComposableStable:
      return PoolType.ComposableStable
    default:
      return PoolType.Unknown
  }
}
