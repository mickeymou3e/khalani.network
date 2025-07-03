import { RequestStatus } from '@constants/Request'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { IToken } from '@interfaces/token'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ITokensSagaState, MintTokenPayload } from './tokens.types'

export const tokensAdapter = createEntityAdapter<IPoolToken>()

const initTokensSliceState = tokensAdapter.getInitialState<ITokensSagaState>({
  status: RequestStatus.Idle,
  isFetching: false,
  isMintingToken: false,
})

export const TokensSlice = createSlice({
  initialState: initTokensSliceState,
  name: StoreKeys.Tokens,
  reducers: {
    initializeTokensRequest: (state) => {
      state.isFetching = true
      return state
    },
    initializeTokensSuccess: (state) => {
      state.status = RequestStatus.Resolved
      state.isFetching = false
      return state
    },
    initializeTokensFailure: (state) => {
      state.status = RequestStatus.Rejected
      state.isFetching = false
      return state
    },
    updateTokensRequest: (state) => {
      state.isFetching = true
    },
    updateTokensSuccess: (state, action: PayloadAction<IToken[]>) => {
      const tokenInfos = action.payload
      state.isFetching = false
      tokensAdapter.setAll(state, tokenInfos)
    },
    updateTokensFailure: (state) => {
      state.isFetching = false
    },

    mintTokenRequest: (state, _action: PayloadAction<MintTokenPayload>) => {
      state.isMintingToken = true
    },
    mintTokenSuccess: (state) => {
      state.isMintingToken = false
    },
    mintTokenFailure: (state) => {
      state.isMintingToken = false
    },
  },
})

export const tokensActions = TokensSlice.actions
export const tokensReducer = TokensSlice.reducer
