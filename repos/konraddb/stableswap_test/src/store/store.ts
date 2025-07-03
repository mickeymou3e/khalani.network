import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { NodeEnv } from '../constants/NodeEnv'
import { rootReducer } from './root.reducer'
import { StoreKeys } from './store.keys'

export const sagaMiddleware = createSagaMiddleware()

export const getStore = (): typeof store => {
  const persistedReducer = persistReducer(
    {
      key: 'persistedReducer',
      storage: storage,
      whitelist: [StoreKeys.History],
    },
    rootReducer,
  )

  const store = configureStore({
    devTools: process.env.NODE_ENV === NodeEnv.Development,
    middleware: [
      ...getDefaultMiddleware({ serializableCheck: false, thunk: false }),
      sagaMiddleware,
    ],
    reducer: persistedReducer,
  })

  return store
}

export const store = getStore()
