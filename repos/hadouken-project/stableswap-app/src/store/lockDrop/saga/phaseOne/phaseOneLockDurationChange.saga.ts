import { put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { lockdropSelectors } from '../../lockDrop.selector'
import { lockDropActions } from '../../lockDrop.slice'

export function* phaseOneLockDurationChange(
  action: PayloadAction<string>,
): Generator {
  const lockAmount = yield* select(lockdropSelectors.phaseOneLockAmount)
  yield* put(
    lockDropActions.phaseOneLockLockDurationChangeSuccess(
      Number(action.payload),
    ),
  )

  if (lockAmount.gt(BigDecimal.from(0))) {
    yield* put(lockDropActions.phaseOneCalculateEstimatedRewardRequest())
  }
}
