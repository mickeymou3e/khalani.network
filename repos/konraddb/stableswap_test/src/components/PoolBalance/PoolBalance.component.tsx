import React from 'react'

import numeral from 'numeral'

import { Box, Typography } from '@mui/material'

import { messages } from './PoolBalance.messages'
import { IPoolBalanceProps } from './PoolBalance.types'

const PoolBalance: React.FC<IPoolBalanceProps> = (props) => {
  const { poolBalancesWithSymbol } = props

  return (
    <>
      {poolBalancesWithSymbol.map((poolBalance) => (
        <Box key={poolBalance.symbol} display="flex" gap={2} mt={2}>
          <Typography>
            {messages.LABEL_PREFIX} {poolBalance.symbol} {messages.LABEL_SUFFIX}
          </Typography>
          <Typography sx={{ ml: 0.5 }}>
            {numeral(poolBalance.balance).format('0.00a')}
          </Typography>
        </Box>
      ))}
    </>
  )
}

export default PoolBalance
