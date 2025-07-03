import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import {
  PoolSnapshotHadoukenRegistry as PoolSnapshotRegistry,
  PoolSnapshotHadouken as PoolSnapshot,
  Pool,
} from '../../types/schema'
import { StablePool } from '../../types/templates/StablePool/StablePool'
import { ERC20 } from '../../types/Vault/ERC20'
import { calculateAnnualizedAPY } from './helpers/apy'

export function setVirtualPrice(pool: Pool, poolSnapshot: PoolSnapshot): void {
  if (pool && poolSnapshot) {
    const poolAddress = Address.fromString(pool.address.toHexString())
    let poolContract = StablePool.bind(poolAddress)
    let lpTokenContract = ERC20.bind(poolAddress)

    let totalSupplyCall = lpTokenContract.try_totalSupply()
    let totalSupply = BigInt.fromI32(0)
    if (!totalSupplyCall.reverted) {
      totalSupply = totalSupplyCall.value
    }

    if (totalSupply && totalSupply.notEqual(BigInt.fromI32(0))) {
      let virtualPriceCall = poolContract.try_getRate()
      if (!virtualPriceCall.reverted) {
        poolSnapshot.virtualPrice = virtualPriceCall.value
      }
    } else {
      poolSnapshot.virtualPrice = BigInt.fromI32(10).pow(18)
    }
  }
}

export function setApy(
  poolSnapshot: PoolSnapshot,
  poolSnapshotRegistry: PoolSnapshotRegistry
): PoolSnapshot {
  let DAY_TIMEFRAME = BigInt.fromI32(86400)
  let dailyAPY = calculateAnnualizedAPY(
    DAY_TIMEFRAME,
    poolSnapshotRegistry,
    poolSnapshot
  )

  let WEEK_TIMEFRAME = BigInt.fromI32(86400).times(BigInt.fromI32(7))
  let weeklyAPY = calculateAnnualizedAPY(
    WEEK_TIMEFRAME,
    poolSnapshotRegistry,
    poolSnapshot
  )

  poolSnapshot.apy = [dailyAPY, weeklyAPY]

  return poolSnapshot
}

export function updatePoolSnapshot(
  pool: Pool,
  poolSnapshot: PoolSnapshot,
  poolSnapshotRegistry: PoolSnapshotRegistry,
  timestamp: BigInt,
  blockNumber: BigInt
): PoolSnapshot {
  poolSnapshot.blockNumber = blockNumber
  poolSnapshot.timestamp = timestamp

  setVirtualPrice(pool, poolSnapshot)
  setApy(poolSnapshot, poolSnapshotRegistry)

  poolSnapshot.save()

  return poolSnapshot
}

export function upsertPoolSnapshot(
  pool: Pool,
  blockNumber: BigInt,
  timestamp: BigInt
): PoolSnapshot {
  const currentBlockNumber = blockNumber
  const currentBlockTimestamp = timestamp

  let poolSnapshotId = createPoolSnapshotId(pool, currentBlockNumber)

  let poolSnapshotRegistry = PoolSnapshotRegistry.load(pool.id)

  let poolSnapshot = PoolSnapshot.load(poolSnapshotId)

  if (!poolSnapshot) {
    let createdPoolSnapshot = new PoolSnapshot(poolSnapshotId)

    if (poolSnapshotRegistry) {
      createdPoolSnapshot = updatePoolSnapshot(
        pool,
        createdPoolSnapshot,
        poolSnapshotRegistry,
        currentBlockTimestamp,
        currentBlockNumber
      )

      let latestPoolSnapshotId = poolSnapshotRegistry.latestSnapshot
      if (latestPoolSnapshotId) {
        let latestPoolSnapshot = PoolSnapshot.load(latestPoolSnapshotId)

        if (
          latestPoolSnapshot &&
          latestPoolSnapshot.blockNumber.lt(currentBlockNumber)
        ) {
          let previousLatestSnapshot = poolSnapshotRegistry.latestSnapshot
          let previousLatestTimestamp =
            poolSnapshotRegistry.latestBlockTimestamp

          poolSnapshotRegistry.latestSnapshot = createdPoolSnapshot.id
          poolSnapshotRegistry.latestBlockTimestamp =
            createdPoolSnapshot.timestamp

          let snapshots = poolSnapshotRegistry.snapshots
          let snapshotsTimestamps = poolSnapshotRegistry.snapshotsTimestamps

          if (previousLatestSnapshot && previousLatestTimestamp) {
            snapshots.push(previousLatestSnapshot)
            snapshotsTimestamps.push(previousLatestTimestamp)

            poolSnapshotRegistry.snapshots = snapshots
            poolSnapshotRegistry.snapshotsTimestamps = snapshotsTimestamps
          } else {
            poolSnapshotRegistry.snapshots = []
            poolSnapshotRegistry.snapshotsTimestamps = []
          }
        }
      } else {
        poolSnapshotRegistry.latestSnapshot = createdPoolSnapshot.id
        poolSnapshotRegistry.latestBlockTimestamp =
          createdPoolSnapshot.timestamp
      }

      poolSnapshotRegistry.save()
    }

    return createdPoolSnapshot
  }

  if (poolSnapshotRegistry) {
    let updatedPoolSnapshot = updatePoolSnapshot(
      pool,
      poolSnapshot,
      poolSnapshotRegistry,
      currentBlockTimestamp,
      currentBlockNumber
    )

    let latestPoolSnapshotId = poolSnapshotRegistry.latestSnapshot
    if (latestPoolSnapshotId) {
      let latestPoolSnapshot = PoolSnapshot.load(latestPoolSnapshotId)

      if (latestPoolSnapshot) {
        if (latestPoolSnapshot.blockNumber === currentBlockNumber) {
          poolSnapshotRegistry.latestSnapshot = updatedPoolSnapshot.id
          poolSnapshotRegistry.latestBlockTimestamp =
            updatedPoolSnapshot.timestamp
        }
      } else {
        let latestPoolSnapshot = PoolSnapshot.load(latestPoolSnapshotId)

        if (
          latestPoolSnapshot &&
          latestPoolSnapshot.blockNumber.lt(currentBlockNumber)
        ) {
          let previousLatestSnapshot = poolSnapshotRegistry.latestSnapshot
          let previousLatestTimestamp =
            poolSnapshotRegistry.latestBlockTimestamp

          poolSnapshotRegistry.latestSnapshot = updatedPoolSnapshot.id
          poolSnapshotRegistry.latestBlockTimestamp =
            updatedPoolSnapshot.timestamp

          let snapshots = poolSnapshotRegistry.snapshots
          let snapshotsTimestamps = poolSnapshotRegistry.snapshotsTimestamps

          if (previousLatestSnapshot && previousLatestTimestamp) {
            snapshots.push(previousLatestSnapshot)
            snapshotsTimestamps.push(previousLatestTimestamp)

            poolSnapshotRegistry.snapshots = snapshots
            poolSnapshotRegistry.snapshotsTimestamps = snapshotsTimestamps
          } else {
            poolSnapshotRegistry.snapshots = []
            poolSnapshotRegistry.snapshotsTimestamps = []
          }
        }
      }

      poolSnapshotRegistry.save()
    }

    return updatedPoolSnapshot
  }

  return poolSnapshot
}

export function createPoolSnapshotId(pool: Pool, blockNumber: BigInt): string {
  return pool.id + blockNumber.toString()
}

export function createPoolSnapshotRegistry(
  pool: Pool,
  event: ethereum.Event
): PoolSnapshotRegistry {
  let poolSnapshotRegistry = new PoolSnapshotRegistry(pool.id)

  upsertPoolSnapshot(pool, event.block.number, event.block.timestamp)

  poolSnapshotRegistry.save()

  return poolSnapshotRegistry
}
