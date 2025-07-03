import React from 'react'

import numbro from 'numbro'

import { Box, Paper } from '@mui/material'

import { PanelRow } from '../PanelRow.component'
import { messages } from './DepositPanel.messages'
import { DepositPanelProps } from './DepositPanel.types'

const DepositPanel: React.FC<DepositPanelProps> = ({ balance }) => {
  return (
    <Paper
      elevation={3}
      sx={{ paddingY: { xs: 2, md: 3 }, paddingX: { xs: 2, md: 3 } }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        flexWrap={{ xs: 'wrap', lg: 'nowrap' }}
        justifyContent={{ xs: 'flex-start', lg: 'space-between' }}
      >
        <PanelRow
          factor={messages.DEPOSITED}
          value={numbro(balance).format('$0.00a')}
        />
      </Box>
    </Paper>
  )
}

export default DepositPanel
