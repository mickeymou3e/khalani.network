import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts';

import { DailyVolume } from '../../types/schema';

export function updateDailyVolume(
  poolAddress: Address,
  tokenAmount: BigDecimal,
  timestamp: BigInt
): void {
  let utcDay = timestamp.div(BigInt.fromI32(86400))

  let dailyVolume = DailyVolume.load(poolAddress.toHexString() + utcDay.toString())

  if (!dailyVolume) {
    dailyVolume = new DailyVolume(poolAddress.toHexString() + utcDay.toString())
    dailyVolume.poolId = poolAddress
    dailyVolume.utcDay = utcDay
    dailyVolume.timeStamp = timestamp
    dailyVolume.volume = BigDecimal.fromString("0")
  }


  dailyVolume.volume = dailyVolume.volume.plus(tokenAmount)
  dailyVolume.save()
}