import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { TokenExchange } from '../../generated/Swaps/Swaps'
import * as Schemas from '../../generated/schema'
import { updateUsedBlock } from '../utils/block'

export function calculateDailyVolume(
  poolAddress: Address,
  tokenAddress: Address,
  tokenAmount: BigInt,
  timestamp: BigInt
): void {
  let utcDay = timestamp.div(BigInt.fromI32(86400))

  let dailyVolume = Schemas.DailyVolume.load(poolAddress.toHexString() + utcDay.toString())

  if (!dailyVolume) {
    dailyVolume = new Schemas.DailyVolume(poolAddress.toHexString() + utcDay.toString())
    dailyVolume.poolId = poolAddress
    dailyVolume.utcDay = utcDay
    dailyVolume.timeStamp = timestamp
    dailyVolume.volume = BigInt.fromI32(0)
  }

  let token = Schemas.PoolToken.load(tokenAddress.toHexString())
  if (token) {
    let product = BigInt.fromI32(1)

    for (let i = BigInt.fromI32(0); i.lt(token.decimals); i = i.plus(BigInt.fromI32(1))) {
      product = product.times(BigInt.fromI32(10))
    }

    dailyVolume.volume = dailyVolume.volume.plus(tokenAmount.div(product))
  }
  dailyVolume.save()
}

export function dailyAPY(): void {
  return
}

export function tokenExchangeHandler(event: TokenExchange): void {
  let timestamp = event.block.timestamp

  let poolAddress = event.params.pool
  let tokenAddress = event.params.token_sold
  let tokenAmount = event.params.amount_sold

  calculateDailyVolume(poolAddress, tokenAddress, tokenAmount, timestamp)
  updateUsedBlock(event.block.number, event.block.hash)
}
