import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as StoreProvider } from 'react-redux'
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from 'react-router-dom'

import Layout from '@components/Layout'
import { SelectNetwork } from '@components/modals/SelectNetwork'
import { SUPPORTED_PATHS, createRouteForChains } from '@constants/routes'
import HistoryContainer from '@containers/HistoryContainer'
import HistoryProgressContainer from '@containers/HistoryProgressContainer'
import UserDataContainer from '@containers/UserDataContainer'
import { NotFoundPage } from '@hadouken-project/ui'
import { rootSaga } from '@store/root.saga'
import { sagaMiddleware, store } from '@store/store'
import { isTestnetEnv } from '@utils/network'
import { initSentry } from '@utils/sentry'

import BorrowPage from './pages/Borrow/Borrow.component'
import DashboardPage from './pages/Dashboard/Dashboard.component'
import DepositPage from './pages/Deposit/Deposit.component'
import FaucetPage from './pages/Faucet/Faucet.component'
import LandingPage from './pages/Landing'
import BorrowAssetPage from './pages/assets/BorrowAsset/BorrowAsset.component'
import CollateralSwitchPage from './pages/assets/CollateralSwitch/CollateralSwitch.component'
import DepositAssetPage from './pages/assets/DepositAsset/DepositAsset.component'
import InterestSwapPage from './pages/assets/InterestSwap/InterestSwap.component'
import RepayAssetPage from './pages/assets/RepayAsset/RepayAsset.component'
import WithdrawAssetPage from './pages/assets/WithdrawAsset/WithdrawAsset.component'
import { ThemeProvider } from './styles/theme'

initSentry()

sagaMiddleware.run(rootSaga)

const InnerApp = () => {
  const history = useHistory()

  const onNavigateToChainSelect = () => {
    history.push('/')
  }

  return (
    <StoreProvider store={store}>
      <Layout>
        <Switch>
          <Route exact path={createRouteForChains('dashboard')}>
            <DashboardPage />
          </Route>
          <Route exact path={createRouteForChains('deposit')}>
            <DepositPage />
          </Route>
          <Route exact path={createRouteForChains('borrow')}>
            <BorrowPage />
          </Route>
          {/* <Route exact path="/backstop">
            <BackstopPage />
          </Route>
          <Route exact path="/backstop/deposit/:id">
            <DepositBackstopAssetPage />
          </Route>
          <Route exact path="/backstop/withdraw/:id">
            <WithdrawBackstopAssetPage />
          </Route> */}
          <Route exact path={createRouteForChains('deposit/:id')}>
            <DepositAssetPage />
          </Route>
          <Route exact path={createRouteForChains('withdraw/:id')}>
            <WithdrawAssetPage />
          </Route>
          <Route exact path={createRouteForChains('collateral-switch/:id')}>
            <CollateralSwitchPage />
          </Route>
          <Route exact path={createRouteForChains('borrow/:id')}>
            <BorrowAssetPage />
          </Route>
          <Route exact path={createRouteForChains('repay/:id')}>
            <RepayAssetPage />
          </Route>
          <Route exact path={createRouteForChains('interest-swap/:id')}>
            <InterestSwapPage />
          </Route>
          <Route exact path={createRouteForChains('/', true)}>
            <LandingPage />
          </Route>

          <Route
            exact
            path={
              isTestnetEnv ? [...SUPPORTED_PATHS, '/faucet'] : SUPPORTED_PATHS
            }
          >
            <SelectNetwork shouldBeAlwaysOpen />
          </Route>

          {isTestnetEnv && [
            <Route exact path={createRouteForChains('faucet')} key="faucet">
              <FaucetPage />
            </Route>,
          ]}

          <Route path="*">
            <NotFoundPage onRedirect={onNavigateToChainSelect} />
          </Route>
        </Switch>
      </Layout>
      <HistoryProgressContainer />
      <UserDataContainer />
      <HistoryContainer />
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
