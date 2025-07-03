import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { EnvironmentType } from '@shared/constants/EnvironmentType'

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
    devTools: process.env.NODE_ENV === EnvironmentType.Staging,
    middleware: [
      ...getDefaultMiddleware({ serializableCheck: false, thunk: false }),
      sagaMiddleware,
    ],
    reducer: persistedReducer,
  })

  return store
}

export const store = getStore()
