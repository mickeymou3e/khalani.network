import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './root.reducer'

export const sagaMiddleware = createSagaMiddleware()

export const getStore = (): typeof store => {
  const persistedReducer = persistReducer(
    {
      key: 'persistedReducer',
      storage: storage,
    },
    rootReducer,
  )

  const store = configureStore({
    devTools: process.env.NODE_ENV === 'development',
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  })

  return store
}

export const store = getStore()
