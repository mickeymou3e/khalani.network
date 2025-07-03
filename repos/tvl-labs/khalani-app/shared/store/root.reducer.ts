import { combineReducers } from '@reduxjs/toolkit'
import { sdkReducers } from '@tvl-labs/sdk'

import { historyReducer } from './history/history.slice'
import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { notificationReducer } from './notification/notification.slice'
import { StoreKeys } from './store.keys'
import { walletReducer } from './wallet/wallet.slice'

export const rootReducer = combineReducers({
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.Wallet]: walletReducer,
  [StoreKeys.History]: historyReducer,
  [StoreKeys.Notification]: notificationReducer,
  ...sdkReducers,
})
