import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'

import { createMemoryHistory } from 'history'

import { configureStore, EnhancedStore, DeepPartial } from '@reduxjs/toolkit'
import { rootReducer } from '@store/root.reducer'
import { StoreState } from '@store/store.types'
import {
  RenderOptions,
  RenderResult,
  render,
  renderHook,
} from '@testing-library/react'

interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialState?: DeepPartial<StoreState>
  store?: EnhancedStore<StoreState>
}

const renderConnected = (
  ui: React.ReactElement,
  {
    initialState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    }),
    ...renderOptions
  }: CustomRenderOptions = {},
): [RenderResult, EnhancedStore<StoreState>] => {
  const history = createMemoryHistory()

  const Wrapper = ({ children }: PropsWithChildren<void>): JSX.Element => (
    <Provider store={store}>
      <Router location={history.location} navigator={history}>
        {children}
      </Router>
    </Provider>
  )

  return [render(ui, { wrapper: Wrapper as never, ...renderOptions }), store]
}

function renderHookWithProviders<Result, Props>(
  render: (initialProps: Props) => Result,
  {
    initialState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    }),
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  const history = createMemoryHistory()

  const Wrapper = ({ children }: PropsWithChildren<void>): JSX.Element => (
    <Provider store={store}>
      <Router location={history.location} navigator={history}>
        {children}
      </Router>
    </Provider>
  )

  return {
    store,
    ...renderHook(render, { wrapper: Wrapper as never, ...renderOptions }),
  }
}

export * from '@testing-library/react'
export { renderConnected, renderHookWithProviders }
