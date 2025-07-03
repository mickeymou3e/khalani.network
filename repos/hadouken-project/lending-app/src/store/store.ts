import createSagaMiddleware from 'redux-saga'

import { NodeEnv } from '@constants/NodeEnv'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { rootReducer } from './root.reducer'

export const sagaMiddleware = createSagaMiddleware()

export const getStore = (): typeof store => {
  const store = configureStore({
    devTools: process.env.NODE_ENV === NodeEnv.Development,
    middleware: [
      ...getDefaultMiddleware({ serializableCheck: false, thunk: false }),
      sagaMiddleware,
    ],
    reducer: rootReducer,
  })

  return store
}

export const store = getStore()
