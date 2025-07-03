import { POOL_DECIMALS } from '@constants/Pool'
import {
  IPoolQueryResult,
  IPoolTokenQueryResult,
} from '@dataSource/graph/pools/pools/types'
import { mapTokenNames } from '@dataSource/graph/pools/poolsTokens/mapper'
import { address } from '@dataSource/graph/utils/formatters'
import { IPool, IPoolToken, PoolType } from '@interfaces/pool'
import { ILendingReserve } from '@store/lending/lending.types'
import { BigDecimal } from '@utils/math'

import { getPoolConfig } from './constants'

export function mapPoolsQuery(
  pools: IPoolQueryResult[],
  lendingReserves: ILendingReserve[],
  chainId: string,
): IPool[] {
  return pools.map((pool) =>
    mapPoolQueryResultToPool(pool, lendingReserves, chainId),
  )
}

export function mapPoolQueryResultToPool(
  poolQueryResult: IPoolQueryResult,
  lendingReserves: ILendingReserve[],
  chainId: string,
): IPool {
  const poolConfig = getPoolConfig(address(poolQueryResult.address), chainId)

  return {
    id: poolQueryResult.id,
    address: address(poolQueryResult.address),
    name: mapPoolName(poolQueryResult.name, poolQueryResult.poolType),
    symbol: poolQueryResult.symbol,
    decimals: POOL_DECIMALS,
    poolType: poolConfig?.poolType ?? poolQueryResult.poolType,
    tokens: poolQueryResult.tokens
      .map((token) =>
        mapTokenPoolQueryResultToPoolToken(
          token,
          address(poolQueryResult.address),
          lendingReserves,
          chainId,
        ),
      )
      .map((token) => mapTokenNames(token, chainId)),

    amp: poolQueryResult.amp,
    owner: poolQueryResult.owner,
    createTime: new Date(poolQueryResult.createTime * 1000),
    swapFee: BigDecimal.fromString(poolQueryResult.swapFee),
    totalShares: BigDecimal.fromString(poolQueryResult.totalShares),
    totalLiquidity: BigDecimal.fromString(poolQueryResult.totalLiquidity),
    totalSwapFee: BigDecimal.fromString(poolQueryResult.totalSwapFee),
    totalSwapVolume: BigDecimal.fromString(poolQueryResult.totalSwapVolume),
    displayName: poolConfig?.displayName ?? poolQueryResult.name,
  } as IPool
}

export function mapTokenPoolQueryResultToPoolToken(
  poolTokenQueryResult: IPoolTokenQueryResult,
  poolAddress: string,
  lendingReserves: ILendingReserve[],
  chainId: string,
): IPoolToken {
  const poolConfig = getPoolConfig(poolTokenQueryResult.address, chainId)

  const displayName = poolConfig
    ? poolConfig.displayName
    : poolTokenQueryResult.name

  const poolTokenAddress = address(poolTokenQueryResult.address)
  const reserve = lendingReserves.find(
    (reserve) =>
      address(reserve.wrappedATokenAddress) === address(poolTokenAddress),
  )
  const isLendingToken = Boolean(reserve)

  return {
    id: poolTokenQueryResult.id,
    address: poolTokenAddress,
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
    isLpToken: address(poolAddress) === address(poolTokenQueryResult.address),
    displayName,
    isLendingToken: isLendingToken,
    unwrappedAddress: isLendingToken
      ? address(reserve?.aTokenAddress ?? '')
      : undefined,
  }
}

export type ByKey<T, K extends keyof T> = {
  [key in K]: T
}

export function reduceByKey<T, K extends keyof T>(key: K) {
  return (acc: ByKey<T, K>, current: T): ByKey<T, K> => {
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

export function mapPoolName(poolName: string, poolType: string): string {
  if (poolType === PoolType.Weighted || poolType === PoolType.WeightedBoosted)
    return `${poolName} Weighted Pool`

  return poolName
}
