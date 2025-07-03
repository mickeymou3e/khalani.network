import { combineReducers } from '@reduxjs/toolkit'

import { historyReducer } from './history/history.slice'
import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { networkReducer } from './network/network.slice'
import { providerReducer } from './provider/provider.slice'
import { StoreKeys } from './store.keys'
import { walletReducer } from './wallet/wallet.slice'

export const rootReducer = combineReducers({
  [StoreKeys.Wallet]: walletReducer,
  [StoreKeys.Network]: networkReducer,
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.History]: historyReducer,
})
