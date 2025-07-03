import { PoolCreated } from '../../../../types/WeightedPoolFactory/WeightedPoolFactory'
import { Address } from '@graphprotocol/graph-ts'
import { StablePool } from '../../../../types/templates/StablePool/StablePool'
import { handleNewPoolTokens } from '../../helpers/misc'
import { getPoolTokens, PoolType } from '../../helpers/pools'
import { StablePool as StablePoolTemplate } from '../../../../types/templates'
import { handlePoolCreated } from '../../BasePool/factory/PoolCreated'

export function createStableLikePool(
  event: PoolCreated,
  poolType: string
): string | null {
  let poolAddress: Address = event.params.pool
  let poolContract = StablePool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let ownerCall = poolContract.try_getOwner()
  let owner = ownerCall.value

  let pool = handlePoolCreated(event, poolId, swapFee)
  pool.poolType = poolType
  pool.owner = owner

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return null
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(poolId, tokens)

  return poolId.toHexString()
}

export function handleStablePoolCreated(event: PoolCreated): void {
  const pool = createStableLikePool(event, PoolType.Stable)
  if (pool == null) return
  StablePoolTemplate.create(event.params.pool)
}
