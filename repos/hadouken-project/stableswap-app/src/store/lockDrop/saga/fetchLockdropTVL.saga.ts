import axios from 'axios'
import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import { LockdropTVL, LockdropTVLResponse } from '../lockDrop.types'

const fetchLockdropTVL = async (): Promise<LockdropTVL> => {
  try {
    const { data } = await axios.get<LockdropTVLResponse>(
      `${config.lockdropBackend}/tvl`,
    )

    return {
      totalValueLocked: BigDecimal.from(data.totalValueLocked),
      totalValueLockedWithWeights: BigDecimal.from(
        data.totalValueLockedWithWeights,
      ),
    }
  } catch {
    return {
      totalValueLocked: BigDecimal.from(0),
      totalValueLockedWithWeights: BigDecimal.from(0),
    }
  }
}

export function* getLockdropTVL(): Generator<StrictEffect, LockdropTVL> {
  const { totalValueLocked, totalValueLockedWithWeights } = yield* call(
    fetchLockdropTVL,
  )

  return {
    totalValueLocked,
    totalValueLockedWithWeights,
  }
}
