import axios from 'axios'
import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga/'

import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import {
  LockDropQueryResultData,
  LockdropDetails,
  LockDrop,
  LockDropQueryResult,
} from '../lockDrop.types'

function mapLockdropQuery(lockdrops: LockDropQueryResult[]): LockDrop[] {
  return lockdrops.map((lockdrop) => mapSingleLockdropQuery(lockdrop))
}

function mapSingleLockdropQuery(lockdrop: LockDropQueryResult): LockDrop {
  return {
    id: lockdrop.id,
    amount: BigDecimal.from(lockdrop.amount, 18),
    owner: lockdrop.owner,
    creationDate: new Date(Number(lockdrop.timestamp) * 1000),
    lockLength: lockdrop.lockLength,
    isLocked: lockdrop.isLocked,
    lockId: lockdrop.lockId,
    transaction: lockdrop.transaction,
    tokenAddress: lockdrop.tokenAddress,
    weight: BigDecimal.from(lockdrop.weight),
    reward: BigDecimal.from(lockdrop.reward),
    lockInUSD: BigDecimal.from(lockdrop.lockInUSD),
    isClaimed: lockdrop.isClaimed,
  }
}

export const fetchUserLocks = async (
  chainId: string,
  user: string | null,
): Promise<LockdropDetails> => {
  try {
    const { data } = await axios.get<LockDropQueryResultData>(
      `${config.lockdropBackend}/lockdrops?chainId=${chainId}&user=${user}`,
    )

    const lockdrops = mapLockdropQuery(data.list)

    return {
      lockdrops: user ? lockdrops : [],
      totalHdkTokens: BigDecimal.from(data.totalHdkTokens),
      totalUserHdkToClaim: user
        ? BigDecimal.from(data.totalUserHdkToClaim)
        : BigDecimal.from(0),
      totalUserValueLocked: user
        ? BigDecimal.from(data.totalUserValueLocked)
        : BigDecimal.from(0),
    }
  } catch {
    return {
      lockdrops: [],
      totalHdkTokens: BigDecimal.from(0),
      totalUserHdkToClaim: BigDecimal.from(0),
      totalUserValueLocked: BigDecimal.from(0),
    }
  }
}

export function* getUserLocksDetails(
  chainId: string,
  user: string | null,
): Generator<StrictEffect, LockdropDetails> {
  const lockdropDetails = yield* call(fetchUserLocks, chainId, user)

  return lockdropDetails
}
