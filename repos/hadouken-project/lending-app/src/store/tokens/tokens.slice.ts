import { RequestStatus } from '@constants/Request'
import { TokenModel } from '@interfaces/tokens'
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ITokensSagaState } from './tokens.types'

export const tokensAdapter = createEntityAdapter<TokenModel>()

const initTokensSliceState = tokensAdapter.getInitialState<ITokensSagaState>({
  status: RequestStatus.Idle,
})

export const TokensSlice = createSlice({
  initialState: initTokensSliceState,
  name: StoreKeys.Tokens,
  reducers: {
    fetchApplicationsTokensRequest: (state) => state,
    fetchApplicationsTokensSuccess: (
      state,
      action: PayloadAction<TokenModel[]>,
    ) => {
      state.status = RequestStatus.Resolved
      tokensAdapter.setAll(state, action.payload)
      return state
    },
    fetchApplicationsTokensFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    resetTokens: (state) => {
      state.status = RequestStatus.Idle

      tokensAdapter.removeAll(state)

      return state
    },
  },
})

export const tokensActions = TokensSlice.actions
export const tokensReducer = TokensSlice.reducer
