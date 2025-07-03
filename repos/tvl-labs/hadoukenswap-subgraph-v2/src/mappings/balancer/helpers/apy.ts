import { BigInt } from '@graphprotocol/graph-ts'
import {
  PoolSnapshotHadouken as PoolSnapshot,
  PoolSnapshotHadoukenRegistry as PoolSnapshotRegistry
} from '../../../types/schema'

export function calculateAnnualizedAPY(
  calculationTimeframe: BigInt,
  snapshotRegistry: PoolSnapshotRegistry,
  snapshot: PoolSnapshot
): BigInt {
  let latestSnapshotId = snapshot.id
  let latestSnapshotTimestamp = snapshot.timestamp

  let snapshotsIds = snapshotRegistry.snapshots
  let snapshotsTimestamps = snapshotRegistry.snapshotsTimestamps

  let snapshotIdOneDayOld = latestSnapshotId
  let snapshotTimestampOneDayOld = latestSnapshotTimestamp

  for (let index = 0; index < snapshotsTimestamps.length; index++) {
    snapshotIdOneDayOld = snapshotsIds[index]
    snapshotTimestampOneDayOld = snapshotsTimestamps[index]

    if (
      snapshotTimestampOneDayOld
        .plus(calculationTimeframe)
        .gt(latestSnapshotTimestamp)
    ) {
      break
    }
  }

  let snpashotOneDayOld = PoolSnapshot.load(snapshotIdOneDayOld)

  let apyAnualized = BigInt.fromI32(0)

  if (snpashotOneDayOld) {
    let virtualPrice = snapshot.virtualPrice
    let virtualPriceOneDayOld = snpashotOneDayOld.virtualPrice

    apyAnualized = virtualPrice
      .minus(virtualPriceOneDayOld)
      .times(BigInt.fromI32(10).pow(18))
      .div(virtualPriceOneDayOld)
      .times(BigInt.fromI32(100))
      .times(BigInt.fromI32(365))
  }

  return apyAnualized
}
