import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'

import Layout from '@components/Layout'
import { SelectNetwork } from '@components/SelectNetwork'
import { isTestOrLocalEnv } from '@constants/NodeEnv'
import HistoryContainer from '@containers/HistoryContainer'
import HistoryProgressContainer from '@containers/HistoryProgressContainer'
import { NotFoundPage } from '@hadouken-project/ui'
import BackstopPage from '@pages/Backstop'
import Deposit from '@pages/Deposit'
import FaucetPage from '@pages/Faucet'
import LockdropPage from '@pages/Lockdrop/Lockdrop.page'
import MyPools from '@pages/MyPools'
import Pool from '@pages/Pool'
import Pools from '@pages/Pools'
import Swap from '@pages/Swap'
import SwapPreview from '@pages/SwapPreview'
import Withdraw from '@pages/Withdraw'
import { networkSelectors } from '@store/network/network.selector'
import { createRouteForChains } from '@utils/network'
import { initSentry } from '@utils/sentry'

import { subgraphClients } from './utils/network/subgraph'

export enum Page {
  Home = 'home',
  Swap = 'swap',
  SwapPreview = 'trade',
  Pool = 'pool',
  Invest = 'invest',
  Withdraw = 'withdraw',
  Pools = 'pools',
  MyPools = 'myPools',
  Faucet = 'faucet',
  Backstop = 'backstop',
  Lockdrop = 'lockdrop',
}

export const PAGES_PATH = {
  [Page.Home]: '/',
  [Page.Swap]: '/swap',
  [Page.SwapPreview]: '/trade',
  [Page.Pools]: '/pools',
  [Page.MyPools]: '/my-pools',
  [Page.Pool]: '/pools/:poolId',
  [Page.Invest]: '/pools/:poolId/invest',
  [Page.Withdraw]: '/pools/:poolId/withdraw',
  [Page.Faucet]: '/faucet',
  [Page.Backstop]: '/backstop',
  [Page.Lockdrop]: '/lockdrop',
}

export const getSupportedPaths = (): string[] => {
  const paths = [
    PAGES_PATH[Page.Home],
    PAGES_PATH[Page.Swap],
    PAGES_PATH[Page.Pools],
    PAGES_PATH[Page.MyPools],
    PAGES_PATH[Page.Backstop],
  ]

  if (isTestOrLocalEnv) {
    paths.push(PAGES_PATH[Page.Faucet])
    paths.push(PAGES_PATH[Page.Lockdrop])
  }

  return paths
}

initSentry()

const App: React.FC = () => {
  const chainId = useSelector(networkSelectors.applicationChainId)
  const history = useHistory()
  const SUPPORTED_PATHS = getSupportedPaths()

  useEffect(() => {
    async function clearStore() {
      if (chainId) {
        subgraphClients[chainId].clearStore()
      }
    }
    clearStore()
  }, [chainId])

  const onNavigateToChainSelect = () => {
    history.push('/')
  }

  return (
    <>
      <Layout>
        <Switch>
          <Route exact path={createRouteForChains(PAGES_PATH[Page.Home], true)}>
            <Swap />
          </Route>
          <Route path={createRouteForChains(PAGES_PATH[Page.SwapPreview])}>
            <SwapPreview />
          </Route>

          <Route exact path={createRouteForChains(PAGES_PATH[Page.Pools])}>
            <Pools />
          </Route>

          <Route path={createRouteForChains(PAGES_PATH[Page.Pool])}>
            <Switch>
              <Route exact path={createRouteForChains(PAGES_PATH[Page.Pool])}>
                <Pool />
              </Route>
              <Route exact path={createRouteForChains(PAGES_PATH[Page.Invest])}>
                <Deposit />
              </Route>
              <Route
                exact
                path={createRouteForChains(PAGES_PATH[Page.Withdraw])}
              >
                <Withdraw />
              </Route>
            </Switch>
          </Route>

          <Route exact path={createRouteForChains(PAGES_PATH[Page.MyPools])}>
            <MyPools />
          </Route>

          <Route exact path={getSupportedPaths()}>
            <SelectNetwork shouldBeAlwaysOpen />
          </Route>

          {SUPPORTED_PATHS.includes(PAGES_PATH[Page.Backstop]) && (
            <Route exact path={createRouteForChains(PAGES_PATH[Page.Backstop])}>
              <BackstopPage />
            </Route>
          )}

          {SUPPORTED_PATHS.includes(PAGES_PATH[Page.Lockdrop]) && (
            <Route exact path={createRouteForChains(PAGES_PATH[Page.Lockdrop])}>
              <LockdropPage />
            </Route>
          )}

          {SUPPORTED_PATHS.includes(PAGES_PATH[Page.Faucet]) && (
            <Route
              exact
              path={createRouteForChains(PAGES_PATH[Page.Faucet])}
              key="faucet"
            >
              <FaucetPage />
            </Route>
          )}

          <Route path="*">
            <NotFoundPage onRedirect={onNavigateToChainSelect} />
          </Route>
        </Switch>
      </Layout>

      <HistoryProgressContainer />
      <HistoryContainer />
    </>
  )
}

export default App
