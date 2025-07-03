import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import InitializeSagaWrapper from '@containers/InitializeSagaWrapper'
import { rootSaga } from '@store/root.saga'
import { sagaMiddleware, store } from '@store/store'
import { subgraphClient } from '@utils/network/subgraph'

import App from './App'
import { ThemeProvider } from './styles/theme/index'

const Index = () => {
  const persistor = persistStore(store)
  const history = useHistory()

  subgraphClient.clearStore()

  useEffect(() => {
    sagaMiddleware.run(rootSaga, history)
  }, [history])

  return (
    <>
      <ThemeProvider>
        <StoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <InitializeSagaWrapper>
              <App />
            </InitializeSagaWrapper>
          </PersistGate>
        </StoreProvider>
      </ThemeProvider>
    </>
  )
}

ReactDOM.render(
  <Router>
    <Index />
  </Router>,
  document.querySelector('#root'),
)
