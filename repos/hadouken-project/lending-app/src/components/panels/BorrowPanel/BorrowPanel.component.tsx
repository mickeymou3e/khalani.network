import React from 'react'

import numbro from 'numbro'

import { Box, Paper } from '@mui/material'

import { PanelRow } from '../PanelRow.component'
import { messages } from './BorrowPanel.messages'
import { BorrowPanelProps } from './BorrowPanel.types'

const BorrowPanel: React.FC<BorrowPanelProps> = ({
  borrowed,
  borrowingPowerUsed,
  healthFactor,
  collateral,
  LTV,
  maxLTV,
  liqThreshold,
}) => (
  <Paper
    elevation={3}
    sx={{ paddingY: { xs: 2, md: 3 }, paddingX: { xs: 2, md: 3 } }}
  >
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      flexWrap={{ xs: 'wrap', lg: 'nowrap' }}
      justifyContent={{ xs: 'flex-start', lg: 'space-between' }}
      gap={{ xs: 2, md: 4 }}
    >
      <PanelRow
        factor={messages.BORROWED}
        value={numbro(borrowed).format('$0.00a')}
      />

      <PanelRow
        factor={messages.BORROW_POWER}
        value={numbro(borrowingPowerUsed).format('0.00%')}
      />

      <PanelRow factor={messages.HEALTH_FACTOR} value={healthFactor} />

      <PanelRow
        factor={messages.COLLATERAL}
        value={numbro(collateral).format('$0.00a')}
      />

      <PanelRow factor={messages.LTV} value={numbro(LTV).format('0.00%')} />

      <PanelRow
        factor={messages.MAX_LTV}
        value={numbro(maxLTV).format('0.00%')}
      />

      <PanelRow
        factor={messages.LIQUIDATION_THRESHOLD}
        value={numbro(liqThreshold).format('0.00%')}
      />
    </Box>
  </Paper>
)

export default BorrowPanel
