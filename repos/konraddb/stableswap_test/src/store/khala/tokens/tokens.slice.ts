import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import {
  IKhalaTokensSagaState,
  ITokenModelBalanceWithChain,
} from './tokens.types'

export const khalaTokensAdapter = createEntityAdapter<ITokenModelBalanceWithChain>()

const initKhalaTokensSliceState = khalaTokensAdapter.getInitialState<IKhalaTokensSagaState>(
  {
    status: RequestStatus.Idle,
    isFetching: false,
  },
)

export const KhalaTokensSlice = createSlice({
  initialState: initKhalaTokensSliceState,
  name: StoreKeys.KhalaTokens,
  reducers: {
    initializeKhalaTokensRequest: (state) => ({ ...state, isFetching: true }),
    initializeKhalaTokensSuccess: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Resolved,
    }),
    initializeKhalaTokensFailure: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Rejected,
    }),
    updateKhalaTokens: (
      state,
      action: PayloadAction<ITokenModelBalanceWithChain[]>,
    ) => {
      const tokens = action.payload
      khalaTokensAdapter.upsertMany(state, tokens)
    },
  },
})

export const khalaTokensActions = KhalaTokensSlice.actions
export const khalaTokensReducer = KhalaTokensSlice.reducer
