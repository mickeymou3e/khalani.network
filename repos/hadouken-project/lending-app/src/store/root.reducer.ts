import { combineReducers } from '@reduxjs/toolkit'

import { backstopReducer } from './backstop/backstop.slice'
import { balancesReducer } from './balances/balances.slice'
import { historyReducer } from './history/history.slice'
import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { pricesReducer } from './prices/prices.slice'
import { providerReducer } from './provider/provider.slice'
import { reservesReducer } from './reserves/reserves.slice'
import { StoreKeys } from './store.keys'
import { tokensReducer } from './tokens/tokens.slice'
import { userDataReducer } from './userData/userData.slice'
import { walletReducer } from './wallet/wallet.slice'

export const rootReducer = combineReducers({
  [StoreKeys.Wallet]: walletReducer,
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.History]: historyReducer,
  [StoreKeys.Balances]: balancesReducer,
  [StoreKeys.Tokens]: tokensReducer,
  [StoreKeys.Reserves]: reservesReducer,
  [StoreKeys.UserData]: userDataReducer,
  [StoreKeys.Prices]: pricesReducer,
  [StoreKeys.Backstop]: backstopReducer,
})
