import React from 'react'

import { AssetsList } from '@hadouken-project/ui'
import { Paper } from '@mui/material'

import { useUserBorrowBalancesOverTime } from './BorrowBalanceContainer.hooks'

const BorrowBalanceContainer: React.FC = () => {
  const { assets } = useUserBorrowBalancesOverTime()

  return (
    <Paper elevation={3}>
      <AssetsList assets={assets} />
    </Paper>
  )
}

export default BorrowBalanceContainer
