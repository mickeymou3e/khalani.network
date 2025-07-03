import config from '@config'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { TokenModelBalanceWithChain } from './tokens.types'

export const tokensAdapter = createEntityAdapter<TokenModelBalanceWithChain>()
const initialState = tokensAdapter.addMany(
  tokensAdapter.getInitialState({}),
  [...config.tokens, ...config.mTokens].map((i) => ({
    ...i,
    id: i.id.toLowerCase(),
    balance: BigInt(0),
  })) as TokenModelBalanceWithChain[],
)

export const tokensSlice = createSlice({
  initialState,
  name: StoreKeys.Tokens,
  reducers: {},
})

export const tokensReducer = tokensSlice.reducer
