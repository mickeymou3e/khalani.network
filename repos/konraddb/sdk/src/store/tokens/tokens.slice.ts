import { BigNumber } from 'ethers'

import config from '@config'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '../../store/store.keys'

import { TokenModelBalanceWithChain } from './tokens.types'

export const tokensAdapter = createEntityAdapter<TokenModelBalanceWithChain>()

const initialState = tokensAdapter.addMany(
  tokensAdapter.getInitialState({}),
  config.tokens.map((i) => ({
    ...i,
    balance: BigNumber.from(0),
  })) as TokenModelBalanceWithChain[],
)

export const TokensSlice = createSlice({
  initialState,
  name: StoreKeys.Tokens,
  reducers: {
    updateTokens: (
      state,
      action: PayloadAction<TokenModelBalanceWithChain[]>,
    ) => {
      const tokens = action.payload
      tokensAdapter.upsertMany(state, tokens)
    },
  },
})

export const tokensActions = TokensSlice.actions
export const tokensReducer = TokensSlice.reducer
