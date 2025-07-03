import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Layout from '@components/Layout'
import HistoryProgressContainer from '@containers/HistoryProgressContainer'
import { rootSaga } from '@store/root.saga'
import { sagaMiddleware, store } from '@store/store'
import { initSentry } from '@utils/sentry'

import InitializeSagaWrapper from './containers/InitializeSagaWrapper'
import HomePage from './pages/homePage'
import { ThemeProvider } from './styles/theme'

sagaMiddleware.run(rootSaga)

initSentry()

const InnerApp = () => {
  return (
    <StoreProvider store={store}>
      <InitializeSagaWrapper>
        <Layout>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
          </Switch>
        </Layout>
      </InitializeSagaWrapper>
      <HistoryProgressContainer />
    </StoreProvider>
  )
}

const Index = () => (
  <ThemeProvider>
    <Router basename={process.env.BASENAME ?? undefined}>
      <InnerApp></InnerApp>
    </Router>
  </ThemeProvider>
)
ReactDOM.render(<Index />, document.querySelector('#root'))
