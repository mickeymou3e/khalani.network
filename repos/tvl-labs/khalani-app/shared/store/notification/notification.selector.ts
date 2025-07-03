import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const steps = createSelector(
  [selectReducer(StoreKeys.Notification)],
  (reducerState) => reducerState.steps,
)

const tokensToApprove = createSelector(
  [selectReducer(StoreKeys.Notification)],
  (reducerState) => reducerState.tokensToApprove,
)

const currentStep = createSelector(
  [selectReducer(StoreKeys.Notification)],
  (reducerState) => reducerState.currentStep,
)

export const notificationSelectors = {
  steps,
  tokensToApprove,
  currentStep,
}
