import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as StoreProvider } from 'react-redux'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import Layout from '@components/Layout'
import { rootSaga } from '@store/root.saga'
import { sagaMiddleware, store } from '@store/store'

import LandingPage from './pages/Landing'
import { ThemeProvider } from './styles/theme'

sagaMiddleware.run(rootSaga)

const Index = () => (
  <ThemeProvider>
    <Router>
      <StoreProvider store={store}>
        <Layout>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
          </Switch>
        </Layout>
      </StoreProvider>
    </Router>
  </ThemeProvider>
)
ReactDOM.render(<Index />, document.querySelector('#root'))
