import { combineReducers } from '@reduxjs/toolkit'

import { StoreKeys } from './store.keys'
import { providerReducer } from './provider/provider.slice'
import { contractsReducer } from './contracts/contracts.slice'
import { sdkReducer } from './sdk/sdk.slice'
import { tokensReducer } from './tokens/tokens.slice'
import { allowanceReducer } from './allowance/allowance.slice'

export const reducers = {
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.Contracts]: contractsReducer,
  [StoreKeys.SDK]: sdkReducer,
  [StoreKeys.Tokens]: tokensReducer,
  [StoreKeys.Allowance]: allowanceReducer,
}

export const rootReducer = combineReducers(reducers)
