import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
  HistoryContainer,
  HistoryProgressContainer,
  TxConfirmationContainer,
} from '@shared/containers'

import { Layout } from './components'
import { Page } from './constants'
import { Bridge, History } from './pages'

export const PAGES_PATH = {
  [Page.Home]: '/',
  [Page.Bridge]: '/bridge',
  [Page.History]: '/history',
}

const App: React.FC = () => (
  <>
    <Layout>
      <Routes>
        <Route
          path={PAGES_PATH[Page.Home]}
          element={<Navigate to="/bridge" />}
        />

        <Route path={PAGES_PATH[Page.Bridge]} element={<Bridge />} />
        <Route path={PAGES_PATH[Page.History]} element={<History />} />
        <Route path="*" element={<Navigate to="/bridge" />} />
      </Routes>
    </Layout>

    <HistoryProgressContainer />
    <TxConfirmationContainer />
    <HistoryContainer />
  </>
)

export default App
