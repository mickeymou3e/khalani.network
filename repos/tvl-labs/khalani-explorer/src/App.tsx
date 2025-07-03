import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Layout from './components/Layout'
import { Page } from './constants/Page'
import Explorer from './pages/Explorer'
import ExplorerDetails from './pages/Explorer/ExplorerDetails.component'

export const PAGES_PATH = {
  [Page.ExplorerList]: '/explorer',
  [Page.ExplorerDetails]: '/explorer/:id',
}

const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Switch>
          <Route path={PAGES_PATH[Page.ExplorerList]}>
            <Switch>
              <Route exact path={PAGES_PATH[Page.ExplorerList]}>
                <Explorer />
              </Route>
              <Route exact path={PAGES_PATH[Page.ExplorerDetails]}>
                <ExplorerDetails />
              </Route>
            </Switch>
          </Route>
          <Route path="*">
            <Redirect to={PAGES_PATH[Page.ExplorerList]} />
          </Route>
        </Switch>
      </Layout>
    </>
  )
}

export default App
