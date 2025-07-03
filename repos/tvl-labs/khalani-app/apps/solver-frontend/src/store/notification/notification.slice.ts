import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StepStatus } from '@tvl-labs/khalani-ui/dist/components/Stepper/Stepper.types'
import { RequestStatus } from '@tvl-labs/sdk'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

import { StoreKeys } from '../store.keys'
import {
  InitializeNotificationParams,
  NotificationStore,
  Step,
} from './notification.types'

const initialState: NotificationStore = {
  status: RequestStatus.Idle,
  steps: [],
  tokensToApprove: [],
  currentStep: 1,
  type: null,
}

export const NotificationSlice = createSlice({
  initialState,
  name: StoreKeys.InitializeStore,
  reducers: {
    initializeNotificationSuccess: (state, action: PayloadAction<Step[]>) => {
      state.status = RequestStatus.Resolved
      state.steps = action.payload
      return state
    },
    initializeNotificationFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    initializeNotification: (
      state,
      action: PayloadAction<InitializeNotificationParams>,
    ) => {
      state.tokensToApprove = action.payload.tokensToApprove
      state.type = action.payload.type
      return state
    },
    setTokensToApprove: (state, action: PayloadAction<IApprovalToken[]>) => {
      state.tokensToApprove = action.payload
      return state
    },
    setPendingStatus: (state) => {
      state.steps = state.steps.map((step) =>
        step.id === state.currentStep
          ? { ...step, status: StepStatus.PENDING }
          : step,
      )
      return state
    },
    setCompletedStatus: (state) => {
      state.steps = state.steps.map((step) => {
        if (step.id === state.currentStep) {
          return { ...step, status: StepStatus.COMPLETED }
        } else if (step.id === state.currentStep + 1) {
          return { ...step, status: StepStatus.ACTIVE }
        } else {
          return step
        }
      })

      if (state.steps.length !== state.currentStep) {
        state.currentStep += 1
      }
      return state
    },
    resetNotificationFlow: (state) => {
      state = initialState
      return state
    },
    setCurrentStep: (state, action: PayloadAction<number>) => ({
      ...state,
      currentStep: action.payload,
    }),
  },
})

export const notificationActions = NotificationSlice.actions
export const notificationReducer = NotificationSlice.reducer
