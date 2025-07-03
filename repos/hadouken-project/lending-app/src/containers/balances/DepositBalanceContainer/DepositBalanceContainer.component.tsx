import React from 'react'

import { AssetsList } from '@hadouken-project/ui'
import { Paper } from '@mui/material'

import { useUserDepositBalancesOverTime } from './DepositBalanceContainer.hooks'

const DepositBalanceContainer: React.FC = () => {
  const { assets } = useUserDepositBalancesOverTime()

  return (
    <Paper elevation={3}>
      <AssetsList assets={assets} />
    </Paper>
  )
}

export default DepositBalanceContainer
