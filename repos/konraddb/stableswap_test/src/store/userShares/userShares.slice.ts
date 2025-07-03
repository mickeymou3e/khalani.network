import { RequestStatus } from '@constants/Request'
import { IPool } from '@interfaces/pool'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IUserShares, IUserShareSagaState } from './userShares.types'

export const userSharesAdapter = createEntityAdapter<IUserShares>()
const initUserSharesSliceState = userSharesAdapter.getInitialState<IUserShareSagaState>(
  {
    status: RequestStatus.Idle,
  },
)

export const userSharesSlice = createSlice({
  initialState: initUserSharesSliceState,
  name: StoreKeys.UserShares,
  reducers: {
    updateUserSharesRequest: (state, _action: PayloadAction<IPool['id']>) => {
      state.status = RequestStatus.Pending

      return state
    },
    updateUserSharesSuccess: (state, action: PayloadAction<IUserShares[]>) => {
      const updatedUserShares = action.payload

      userSharesAdapter.upsertMany(state, updatedUserShares)
      state.status = RequestStatus.Resolved

      return state
    },
  },
})

export const userSharesActions = userSharesSlice.actions
export const userSharesReducer = userSharesSlice.reducer
