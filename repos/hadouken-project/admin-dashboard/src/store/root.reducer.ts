import { combineReducers } from '@reduxjs/toolkit'

import { balancesReducer } from './balances/balances.slice'
import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { liquidationsReducer } from './liquidation/liquidation.slice'
import { pricesReducer } from './prices/prices.slice'
import { providerReducer } from './provider/provider.slice'
import { reservesReducer } from './reserves/reserves.slice'
import { StoreKeys } from './store.keys'
import { swapTokensReducer } from './swapTokens/swapTokens.slice'
import { tokensReducer } from './tokens/tokens.slice'
import { usersReducer } from './users/users.slice'

export const rootReducer = combineReducers({
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.Tokens]: tokensReducer,
  [StoreKeys.Reserves]: reservesReducer,
  [StoreKeys.Prices]: pricesReducer,
  [StoreKeys.Users]: usersReducer,
  [StoreKeys.Liquidation]: liquidationsReducer,
  [StoreKeys.Balances]: balancesReducer,
  [StoreKeys.SwapTokens]: swapTokensReducer,
})
