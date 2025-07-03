import { address } from '@dataSource/graph/utils/formatters'
import { IPool, PoolType } from '@interfaces/pool'

export const getPoolFullName = (pool: IPool): string => {
  const poolName = pool.displayName
    ? `${pool.displayName} Pool`
    : `${pool.name} Pool`

  return poolName
}

export const isPoolVulnerable = (pools: IPool[], pool?: IPool): boolean => {
  const oldLinearPools = pools.filter((p) => p.poolType === PoolType.AaveLinear)

  const nestedPools = pools.filter((p) =>
    pool?.tokens.some((token) => address(token.address) === address(p.address)),
  )
  const isLinearPool = pool?.tokens.some((token) => {
    return oldLinearPools.some(
      (linearPool) => address(linearPool.address) === address(token.address),
    )
  })
  const isNestedLinearPool = nestedPools.some((nestedPool) =>
    nestedPool.tokens.some((nestedToken) =>
      oldLinearPools.some(
        (oldLinear) =>
          address(oldLinear.address) === address(nestedToken.address),
      ),
    ),
  )
  return isLinearPool || isNestedLinearPool
}
