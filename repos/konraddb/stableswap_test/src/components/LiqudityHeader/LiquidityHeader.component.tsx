import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { useDepositTokens } from '@hooks/liquidity/useDepositTokens'
import { Typography } from '@mui/material'
import InternalTabsSelector from '@ui/InternalTabsSelector'
import { findPANToken, findUSDCToken } from '@utils/token'

import { messages, tabs } from './LiquidityHeader.constants'

const LiquidityHeader: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>()
  const [originTokenSymbol, setOriginTokenSymbol] = useState<string>()
  const [sourceTokenSymbol, setSourceTokenSymbol] = useState<string>()

  const params = useParams<{ id: string }>()
  const history = useHistory()
  const depositTokens = useDepositTokens()

  useEffect(() => {
    const foundTab = tabs.find((tab) =>
      history.location.pathname.includes(tab.route),
    )
    setSelectedTab(foundTab?.value)
  }, [history])

  useEffect(() => {
    if (depositTokens) {
      const foundBasePoolToken = findUSDCToken(depositTokens)
      const foundAdditionalPoolToken = findPANToken(depositTokens)
      setOriginTokenSymbol(foundBasePoolToken?.symbol)
      setSourceTokenSymbol(foundAdditionalPoolToken?.symbol)
    }
  }, [depositTokens])

  const navigate = (path: string) => {
    history.push(`/liquidity/${path}/${params.id}`)
  }

  return (
    <>
      <Typography>
        {messages.TITLE} / {originTokenSymbol} + {sourceTokenSymbol}
      </Typography>
      {(selectedTab || selectedTab === 0) && (
        <InternalTabsSelector
          tabs={tabs}
          onChange={navigate}
          selectedTab={selectedTab}
        />
      )}
    </>
  )
}

export default LiquidityHeader
