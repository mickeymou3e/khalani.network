import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { configureStore, EnhancedStore, DeepPartial } from '@reduxjs/toolkit'
import { rootReducer } from '@store/root.reducer'
import { StoreState } from '@store/store.types'
import { RenderOptions, RenderResult, render } from '@testing-library/react'

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
  const Wrapper = ({ children }: PropsWithChildren<void>): JSX.Element => (
    <Provider store={store}>{children}</Provider>
  )

  return [render(ui, { wrapper: Wrapper as never, ...renderOptions }), store]
}

export * from '@testing-library/react'
export { renderConnected }
