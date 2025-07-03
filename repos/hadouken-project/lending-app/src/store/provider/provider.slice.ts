import { ActionInProgress } from '@constants/Action'
import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IBackstopDepositPayload } from '@store/actions/backstop/deposit/types'
import { IBorrowPayload } from '@store/actions/borrow/types'
import { ICollateralPayload } from '@store/actions/collateral/types'
import { IDepositPayload } from '@store/actions/deposit/types'
import { IMintPayload } from '@store/actions/mint/types'
import { IRepayPayload } from '@store/actions/repay/types'
import { ISwapBorrowModePayload } from '@store/actions/swapBorrowMode/types'
import { IWithdrawPayload } from '@store/actions/withdraw/types'

import { StoreKeys } from '../store.keys'

const initProviderState: {
  status: RequestStatus
  errorMessage?: string
  actionInProgress?: ActionInProgress
  latestBlock?: number
} = {
  status: RequestStatus.Idle,
  errorMessage: undefined,
  actionInProgress: undefined,
  latestBlock: undefined,
}

export const providerSlice = createSlice({
  initialState: initProviderState,
  name: StoreKeys.Provider,
  reducers: {
    initializeProviderRequest: (state, _action: PayloadAction) => state,
    initializeProviderSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeProviderFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    backstopDepositRequest: (
      state,
      _action: PayloadAction<IBackstopDepositPayload>,
    ) => {
      state.actionInProgress = ActionInProgress.BackstopDeposit
      return state
    },
    backstopDepositSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    backstopDepositFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },

    backstopWithdrawRequest: (
      state,
      _action: PayloadAction<IBackstopDepositPayload>,
    ) => {
      state.actionInProgress = ActionInProgress.BackstopWithdraw
      return state
    },
    backstopWithdrawSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    backstopWithdrawFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },

    depositRequest: (state, _action: PayloadAction<IDepositPayload>) => {
      state.actionInProgress = ActionInProgress.Deposit
      return state
    },
    depositSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    depositFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    withdrawRequest: (state, _action: PayloadAction<IWithdrawPayload>) => {
      state.actionInProgress = ActionInProgress.Withdraw
      return state
    },
    withdrawSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    withdrawFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    borrowRequest: (state, _action: PayloadAction<IBorrowPayload>) => {
      state.actionInProgress = ActionInProgress.Borrow
      return state
    },
    borrowSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    borrowFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    repayRequest: (state, _action: PayloadAction<IRepayPayload>) => {
      state.actionInProgress = ActionInProgress.Repay
      return state
    },
    repaySuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    repayFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    swapBorrowModeRequest: (
      state,
      _action: PayloadAction<ISwapBorrowModePayload>,
    ) => {
      state.actionInProgress = ActionInProgress.SwapBorrowMode
      return state
    },
    swapBorrowModeSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    swapBorrowModeFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    collateralRequest: (state, _action: PayloadAction<ICollateralPayload>) => {
      state.actionInProgress = ActionInProgress.CollateralSwitch
      return state
    },
    collateralSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    collateralFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    mintRequest: (state, _action: PayloadAction<IMintPayload>) => {
      state.actionInProgress = ActionInProgress.Mint
      return state
    },
    mintSuccess: (state) => {
      state.actionInProgress = undefined
      return state
    },
    mintFailure: (state) => {
      state.actionInProgress = undefined
      return state
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
      return state
    },
    clearError: (state) => {
      return { ...state, errorMessage: undefined }
    },
    updateLatestBlock: (state, action: PayloadAction<number>) => {
      const latestBlock = action.payload
      return {
        ...state,
        latestBlock,
      }
    },
  },
})

export const providerActions = providerSlice.actions
export const providerReducer = providerSlice.reducer
