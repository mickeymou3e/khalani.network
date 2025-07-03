import { IntentEntity } from '@graph/index'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

export interface IntentBalancesState {
  loading: boolean
  error: string | null
  intentBalances: IntentEntity[] | null
}

const initialState: IntentBalancesState = {
  loading: false,
  error: null,
  intentBalances: null,
}

const intentBalancesSlice = createSlice({
  name: StoreKeys.IntentBalances,
  initialState,
  reducers: {
    request(state) {
      state.loading = true
      state.error = null
    },
    requestSuccess(state, action: PayloadAction<IntentEntity[]>) {
      state.loading = false
      state.error = null
      state.intentBalances = action.payload
    },
    requestError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.intentBalances = null
    },
  },
})

export const intentBalancesActions = intentBalancesSlice.actions
export const intentBalancesReducer = intentBalancesSlice.reducer
