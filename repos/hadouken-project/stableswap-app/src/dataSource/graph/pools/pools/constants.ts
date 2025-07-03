import { address } from '@dataSource/graph/utils/formatters'
import { pools as poolsConfig } from '@hadouken-project/config'
import { pools as poolsConfigZkSync } from '@hadouken-project/config-zksync'
import { isZkSyncNetwork } from '@hadouken-project/lending-contracts'
import { IPoolConfig } from '@interfaces/pool'

import { env } from '../../../../utils/network'

export const getPoolConfig = (
  poolAddress: string,
  chainId: string,
): IPoolConfig | null => {
  if (isZkSyncNetwork(chainId)) {
    const zksyncPools = poolsConfigZkSync(env)

    const pool = zksyncPools.find(
      (pool) => address(pool.address) === address(poolAddress),
    )

    return pool ?? null
  } else {
    const pools = poolsConfig(chainId)

    const pool = pools.find(
      (pool) => address(pool.address) === address(poolAddress),
    )

    return pool ?? null
  }
}
