import React from 'react'

import { KaiIcon } from '@components/icons'
import { Box, Paper, Typography } from '@mui/material'
import { formatWithCommas } from '@utils/text'

import { ILendingOverviewBoxProps } from './LendingOverviewBox.types'

const LendingOverviewBox: React.FC<ILendingOverviewBoxProps> = (props) => {
  const {
    label,
    value,
    decimals,
    kaiIconVisible = false,
    darkTheme = false,
  } = props

  return (
    <Paper sx={{ p: 2 }} elevation={darkTheme ? 1 : 2}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Box display="flex" alignItems="center" mt={1} gap={1}>
        {kaiIconVisible && <KaiIcon />}

        <Typography variant="subtitle2">
          ${formatWithCommas(value, decimals)}
        </Typography>
      </Box>
    </Paper>
  )
}

export default LendingOverviewBox
