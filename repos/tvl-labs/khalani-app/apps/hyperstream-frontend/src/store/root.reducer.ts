import { combineReducers } from '@reduxjs/toolkit'
import { historyReducer, walletReducer } from '@shared/store'
import { sdkReducers } from '@tvl-labs/sdk'

import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { notificationReducer } from './notification/notification.slice'
import { StoreKeys } from './store.keys'

export const rootReducer = combineReducers({
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.Wallet]: walletReducer,
  [StoreKeys.History]: historyReducer,
  [StoreKeys.Notification]: notificationReducer,
  ...sdkReducers,
})
