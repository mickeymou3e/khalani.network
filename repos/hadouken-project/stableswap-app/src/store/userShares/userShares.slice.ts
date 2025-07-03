import { IPool } from '@interfaces/pool'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import {
  DepositTokenBalances,
  IUserShares,
  IUserShareSagaState,
} from './userShares.types'

export const userSharesAdapter = createEntityAdapter<IUserShares>()
const initUserSharesSliceState = userSharesAdapter.getInitialState<IUserShareSagaState>(
  {
    depositTokenBalances: {},
    initialized: false,
    isFetching: false,
  },
)

export const userSharesSlice = createSlice({
  initialState: initUserSharesSliceState,
  name: StoreKeys.UserShares,
  reducers: {
    updateUserSharesRequest: (state, _action: PayloadAction<IPool['id']>) => {
      state.isFetching = true

      return state
    },
    updateUserSharesSuccess: (
      state,
      action: PayloadAction<{
        lpTokenShares: IUserShares[]
        depositBalances: DepositTokenBalances['depositTokenBalances']
      }>,
    ) => {
      const { lpTokenShares, depositBalances } = action.payload

      userSharesAdapter.setAll(state, lpTokenShares)
      state.depositTokenBalances = depositBalances
      state.initialized = true
      state.isFetching = false
      return state
    },
  },
})

export const userSharesActions = userSharesSlice.actions
export const userSharesReducer = userSharesSlice.reducer
