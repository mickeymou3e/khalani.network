import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Layout from '@components/Layout'
import { Page } from '@constants/Page'
import HistoryContainer from '@containers/HistoryContainer'
import HistoryProgressContainer from '@containers/HistoryProgressContainer'
import TxConfirmationContainer from '@containers/TxConfirmationContainer'
import Deposit from '@pages/Deposit'
import Liquidity from '@pages/Liquidity'
import LiquidityAdd from '@pages/LiquidityAdd'
import LiquidityRemove from '@pages/LiquidityRemove'
import Lock from '@pages/Lock'
import Mint from '@pages/Mint'
import Pool from '@pages/Pool'
import Pools from '@pages/Pools'
import Redeem from '@pages/Redeem'
import Swap from '@pages/Swap'
import SwapPreview from '@pages/SwapPreview'
import Withdraw from '@pages/Withdraw'

export const PAGES_PATH = {
  [Page.Home]: '/',
  [Page.Swap]: '/',
  [Page.SwapPreview]: '/trade',
  [Page.Pools]: '/pools',
  [Page.Pool]: '/pools/:poolId',
  [Page.Deposit]: '/pools/:poolId/invest',
  [Page.Withdraw]: '/pools/:poolId/withdraw',
  [Page.Lock]: '/lock',
  [Page.Liquidity]: '/liquidity',
  [Page.LiquidityAdd]: '/liquidity/add/:id',
  [Page.LiquidityRemove]: '/liquidity/remove/:id',
  [Page.Mint]: '/mint',
  [Page.Redeem]: '/redeem',
}

const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Switch>
          <Route exact path={PAGES_PATH[Page.Home]}>
            <Swap />
          </Route>
          <Route path={PAGES_PATH[Page.SwapPreview]}>
            <SwapPreview />
          </Route>

          <Route exact path={PAGES_PATH[Page.Pools]}>
            <Pools />
          </Route>
          <Route path={PAGES_PATH[Page.Pool]}>
            <Switch>
              <Route exact path={PAGES_PATH[Page.Pool]}>
                <Pool />
              </Route>
              <Route exact path={PAGES_PATH[Page.Deposit]}>
                <Deposit />
              </Route>
              <Route exact path={PAGES_PATH[Page.Withdraw]}>
                <Withdraw />
              </Route>
            </Switch>
          </Route>
          <Route path={PAGES_PATH[Page.Lock]}>
            <Lock />
          </Route>
          <Route path={PAGES_PATH[Page.Liquidity]}>
            <Switch>
              <Route exact path={PAGES_PATH[Page.Liquidity]}>
                <Liquidity />
              </Route>
              <Route exact path={PAGES_PATH[Page.LiquidityAdd]}>
                <LiquidityAdd />
              </Route>
              <Route exact path={PAGES_PATH[Page.LiquidityRemove]}>
                <LiquidityRemove />
              </Route>
            </Switch>
          </Route>
          <Route path={PAGES_PATH[Page.Mint]}>
            <Mint />
          </Route>
          <Route path={PAGES_PATH[Page.Redeem]}>
            <Redeem />
          </Route>
          <Route path="*">
            <Swap />
          </Route>
        </Switch>
      </Layout>

      <HistoryProgressContainer />
      <TxConfirmationContainer />
      <HistoryContainer />
    </>
  )
}

export default App
