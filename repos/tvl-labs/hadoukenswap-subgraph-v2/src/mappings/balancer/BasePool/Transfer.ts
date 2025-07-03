import { BigInt } from '@graphprotocol/graph-ts'
import { Transfer } from '../../../types/templates/StablePool/BalancerPoolToken'
import { WeightedPool } from '../../../types/templates/WeightedPool/WeightedPool'

import { Pool } from '../../../types/schema'

import { tokenToDecimal, getPoolShare } from './../helpers/misc'
import { ZERO_ADDRESS, ZERO_BD } from './../helpers/constants'

export function handleTransfer(event: Transfer): void {
    let poolAddress = event.address

    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = WeightedPool.bind(poolAddress)

    let poolIdCall = poolContract.try_getPoolId()
    let poolId = poolIdCall.value

    let isMint = event.params.from == ZERO_ADDRESS
    let isBurn = event.params.to == ZERO_ADDRESS

    let poolShareFrom = getPoolShare(poolId.toHexString(), event.params.from)
    let poolShareFromBalance =
        poolShareFrom == null ? ZERO_BD : poolShareFrom.balance

    let poolShareTo = getPoolShare(poolId.toHexString(), event.params.to)
    let poolShareToBalance = poolShareTo == null ? ZERO_BD : poolShareTo.balance

    let pool = Pool.load(poolId.toHexString()) as Pool

    let BPT_DECIMALS = 18

    if (isMint) {
        poolShareTo.balance = poolShareTo.balance.plus(
            tokenToDecimal(event.params.value, BPT_DECIMALS)
        )
        poolShareTo.save()
        pool.totalShares = pool.totalShares.plus(
            tokenToDecimal(event.params.value, BPT_DECIMALS)
        )
    } else if (isBurn) {
        poolShareFrom.balance = poolShareFrom.balance.minus(
            tokenToDecimal(event.params.value, BPT_DECIMALS)
        )
        poolShareFrom.save()
        pool.totalShares = pool.totalShares.minus(
            tokenToDecimal(event.params.value, BPT_DECIMALS)
        )
    } else {
        poolShareTo.balance = poolShareTo.balance.plus(
            tokenToDecimal(event.params.value, BPT_DECIMALS)
        )
        poolShareTo.save()

        poolShareFrom.balance = poolShareFrom.balance.minus(
            tokenToDecimal(event.params.value, BPT_DECIMALS)
        )
        poolShareFrom.save()
    }

    if (
        poolShareTo !== null &&
        poolShareTo.balance.notEqual(ZERO_BD) &&
        poolShareToBalance.equals(ZERO_BD)
    ) {
        pool.holdersCount = pool.holdersCount.plus(BigInt.fromI32(1))
    }

    if (
        poolShareFrom !== null &&
        poolShareFrom.balance.equals(ZERO_BD) &&
        poolShareFromBalance.notEqual(ZERO_BD)
    ) {
        pool.holdersCount = pool.holdersCount.minus(BigInt.fromI32(1))
    }

    pool.save()
}
