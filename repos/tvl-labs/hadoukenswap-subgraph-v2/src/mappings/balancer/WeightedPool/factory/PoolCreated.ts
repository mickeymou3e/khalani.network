import { Address } from '@graphprotocol/graph-ts'

import { PoolCreated } from '../../../../types/WeightedPoolFactory/WeightedPoolFactory'
import { WeightedPool as WeightedPoolTemplate } from '../../../../types/templates'
import { WeightedPool } from '../../../../types/templates/WeightedPool/WeightedPool'

import { getPoolTokens, PoolType } from '../../helpers/pools'
import { handleNewPoolTokens } from '../../helpers/misc'
import { updatePoolWeights } from '../../helpers/weighted'

import { handlePoolCreated } from '../../BasePool/factory/PoolCreated'

function createWeightedLikePool(
  event: PoolCreated,
  poolType: string
): string | null {
  let poolAddress: Address = event.params.pool
  let poolContract = WeightedPool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let ownerCall = poolContract.try_getOwner()

  if (poolIdCall.reverted && swapFeeCall.reverted && ownerCall.reverted) {
    return null
  }

  let poolId = poolIdCall.value
  let swapFee = swapFeeCall.value
  let owner = ownerCall.value

  let pool = handlePoolCreated(event, poolId, swapFee)
  pool.poolType = poolType
  pool.owner = owner

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return null
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(poolId, tokens)

  // Load pool with initial weights
  updatePoolWeights(poolId.toHexString())

  return poolId.toHexString()
}

export function handleWeightedPoolCreated(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.Weighted)
  if (pool == null) return
  WeightedPoolTemplate.create(event.params.pool)
}
