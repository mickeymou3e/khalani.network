import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
  HistoryContainer,
  HistoryProgressContainer,
  TxConfirmationContainer,
} from '@shared/containers'

import { Layout } from './components'
import { Page } from './constants'
import { SubPage } from './constants/Page'
import { DepositTokensContainer, ProvideLiquidityContainer } from './containers'
import { LiquidityModule, MTokensModule } from './modules'
import { Liquidity, MTokens } from './pages'

export const PAGES_PATH = {
  [Page.Home]: '/',
  [Page.Liquidity]: '/liquidity',
  [Page.MTokens]: '/mTokens',
}

export const SUB_PAGES_PATH = {
  [SubPage.Provide]: 'provide',
  [SubPage.Deposit]: 'deposit',
}
const App: React.FC = () => (
  <>
    <Layout>
      <Routes>
        <Route
          path={PAGES_PATH[Page.Home]}
          element={<Navigate to={PAGES_PATH[Page.MTokens]} />}
        />
        <Route path={PAGES_PATH[Page.MTokens]} element={<MTokens />}>
          <Route index element={<MTokensModule />} />
          <Route
            path={SUB_PAGES_PATH[SubPage.Deposit]}
            element={<DepositTokensContainer />}
          />
        </Route>
        <Route path={PAGES_PATH[Page.Liquidity]} element={<Liquidity />}>
          <Route index element={<LiquidityModule />} />
          <Route
            path={SUB_PAGES_PATH[SubPage.Provide]}
            element={<ProvideLiquidityContainer />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to={PAGES_PATH[Page.Liquidity]} />}
        />
      </Routes>
    </Layout>

    <HistoryProgressContainer />
    <TxConfirmationContainer />
    <HistoryContainer />
  </>
)

export default App
