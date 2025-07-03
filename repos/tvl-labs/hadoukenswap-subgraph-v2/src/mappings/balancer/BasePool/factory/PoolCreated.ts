import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'

import { PoolCreated } from '../../../../types/WeightedPoolFactory/WeightedPoolFactory'
import { Pool, Balancer } from '../../../../types/schema'
import { ERC20 } from '../../../../types/Vault/ERC20'

import {
  getBalancerSnapshot,
  newPoolEntity,
  scaleDown
} from '../../helpers/misc'
import { createPoolSnapshotRegistry } from '../../poolSnapshot'
import { ZERO, ZERO_BD } from '../../../constants'

export function handlePoolCreated(
  event: PoolCreated,
  poolId: Bytes,
  swapFee: BigInt
): Pool {
  let poolAddress: Address = event.params.pool

  let pool = Pool.load(poolId.toHexString())
  if (pool == null) {
    pool = newPoolEntity(poolId.toHexString())

    pool.swapFee = scaleDown(swapFee, 18)
    pool.createTime = event.block.timestamp.toI32()
    pool.address = poolAddress
    pool.tx = event.transaction.hash
    pool.swapEnabled = true

    let bpt = ERC20.bind(poolAddress)

    let nameCall = bpt.try_name()
    if (!nameCall.reverted) {
      pool.name = nameCall.value
    }

    let symbolCall = bpt.try_symbol()
    if (!symbolCall.reverted) {
      pool.symbol = symbolCall.value
    }
    pool.save()

    let vault = findOrInitializeVault()
    vault.poolCount += 1
    vault.save()

    let vaultSnapshot = getBalancerSnapshot(
      vault.id,
      event.block.timestamp.toI32()
    )

    vaultSnapshot.poolCount += 1

    vaultSnapshot.save()
  }

  return pool
}
export function findOrInitializeVault(): Balancer {
  let vault: Balancer | null = Balancer.load('2')
  if (vault != null) return vault

  // if no vault yet, set up blank initial
  vault = new Balancer('2')
  vault.poolCount = 0
  vault.totalLiquidity = ZERO_BD
  vault.totalSwapVolume = ZERO_BD
  vault.totalSwapFee = ZERO_BD
  vault.totalSwapCount = ZERO
  return vault
}
