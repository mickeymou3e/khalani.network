import { RequestStatus } from '@constants/Request'
import { IPool } from '@interfaces/pool'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { IPoolsHistorySagaState } from '@store/pool/pool.types'
import { StoreKeys } from '@store/store.keys'

export const poolsHistoryAdapter = createEntityAdapter<IPool>()

const initPoolsHistorySliceState = poolsHistoryAdapter.getInitialState<IPoolsHistorySagaState>(
  {
    status: RequestStatus.Idle,
  },
)

export const poolsHistorySlice = createSlice({
  initialState: initPoolsHistorySliceState,
  name: StoreKeys.PoolsHistory,
  reducers: {
    update: (state) => {
      state.status = RequestStatus.Pending
      return state
    },
    updateSuccess: (state, action: PayloadAction<IPool[]>) => {
      const pools = action.payload

      state.status = RequestStatus.Resolved
      poolsHistoryAdapter.upsertMany(state, pools)

      return state
    },
    updateError: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const poolsHistoryActions = poolsHistorySlice.actions
export const poolsHistoryReducer = poolsHistorySlice.reducer
