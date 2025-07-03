import { RequestStatus } from '@constants/Request'
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { User, IUsersSagaState } from './users.types'

export const usersAdapter = createEntityAdapter<User>()

const initUsersSliceState = usersAdapter.getInitialState<IUsersSagaState>({
  status: RequestStatus.Idle,
})

export const UsersSlice = createSlice({
  initialState: initUsersSliceState,
  name: StoreKeys.Tokens,
  reducers: {
    fetchUsersRequest: (state) => {
      state.status = RequestStatus.Pending
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.status = RequestStatus.Resolved
      usersAdapter.upsertMany(state, action.payload)
      return state
    },
    fetchUsersFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const usersActions = UsersSlice.actions
export const usersReducer = UsersSlice.reducer
