import { delay, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { lockDropActions } from '../../lockDrop.slice'

export function* phaseOneLockAmountChange(
  action: PayloadAction<BigDecimal | undefined>,
): Generator {
  yield* delay(500)

  yield* put(
    lockDropActions.phaseOneLockAmountChangeSuccess(
      action.payload ?? BigDecimal.from(0),
    ),
  )

  if (action.payload?.gt(BigDecimal.from(0))) {
    yield* put(lockDropActions.phaseOneCalculateEstimatedRewardRequest())
  }
}
