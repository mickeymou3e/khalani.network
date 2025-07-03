import { StrictEffect } from 'redux-saga/effects'
import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { withdrawActions } from '@store/withdraw/withdraw.slice'
import { CalculateComposablePoolProportionalWithdrawPayload } from '@store/withdraw/withdraw.types'

import { calculateComposablePoolProportional } from './calculateComposablePoolProportional.saga'

export function* calculateComposablePoolProportionalWithdrawSaga(
  action: PayloadAction<CalculateComposablePoolProportionalWithdrawPayload>,
): Generator<StrictEffect, void> {
  try {
    const balances = yield* call(
      calculateComposablePoolProportional,
      action.payload.poolId,
      action.payload.percentage,
    )

    yield* put(
      withdrawActions.calculateComposablePoolProportionalWithdrawSuccess({
        balances: balances,
        percentage: action.payload.percentage,
      }),
    )
  } catch (e) {
    console.error(e)
    yield* put(
      withdrawActions.calculateComposablePoolProportionalWithdrawFailure(),
    )
  }
}
