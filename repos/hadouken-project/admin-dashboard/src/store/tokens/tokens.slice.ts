import { RequestStatus } from '@constants/Request'
import { TokenModel } from '@interfaces/tokens'
import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
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
    fetchApplicationsTokensSuccess: (
      state,
      action: PayloadAction<TokenModel[]>,
    ) => {
      state.status = RequestStatus.Resolved
      tokensAdapter.upsertMany(state, action.payload)
      return state
    },
    fetchApplicationsTokensFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const tokensActions = TokensSlice.actions
export const tokensReducer = TokensSlice.reducer
