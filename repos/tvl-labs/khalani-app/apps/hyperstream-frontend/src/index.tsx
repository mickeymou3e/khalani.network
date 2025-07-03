import React, { useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { SelectWalletModalProvider } from '@shared/components'
import { InitializeSagaWrapper } from '@shared/containers'
import { WalletProvider } from '@shared/contexts'
import { ThemeProvider } from '@shared/styles'
import { history } from '@shared/utils'
import { rootSaga } from '@store/root.saga'
import { sagaMiddleware, store } from '@store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'

const Index = () => {
  const persistor = persistStore(store)
  const location = useLocation()

  useEffect(() => {
    history.push(location)
  }, [location])

  useEffect(() => {
    sagaMiddleware.run(rootSaga, history)
  }, [])

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
    [],
  )

  if (process.env.NODE_ENV === 'development') {
    loadErrorMessages()
    loadDevMessages()
  }

  return (
    <ThemeProvider>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <InitializeSagaWrapper>
              <WalletProvider>
                <SelectWalletModalProvider>
                  <App />
                </SelectWalletModalProvider>
              </WalletProvider>
            </InitializeSagaWrapper>
          </QueryClientProvider>
        </PersistGate>
      </StoreProvider>
    </ThemeProvider>
  )
}

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <Router>
    <Index />
  </Router>,
)
