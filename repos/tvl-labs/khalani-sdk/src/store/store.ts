import createSagaMiddleware from 'redux-saga'

import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './root.reducer'
import * as process from 'process';

export const sagaMiddleware = createSagaMiddleware()

/*
  TODO: enable this later?
  const persistedReducer = persistReducer(
    {
      key: 'persistedReducer',
      storage: storage,
    },
    rootReducer,
  )
*/

export const getStore = (): typeof store => {
  const store = configureStore({
    devTools: process.env.NODE_ENV === 'development',
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        // TODO: research on how to avoid storing non-serializable data (like RPC provider and Contracts) in the store.
        //  https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
        serializableCheck: false
      }).concat(sagaMiddleware),
  })

  return store
}

export const store = getStore()