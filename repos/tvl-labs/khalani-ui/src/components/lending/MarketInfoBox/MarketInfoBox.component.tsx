import React from 'react'

import LinearProgress from '@components/LinearProgress'
import { IconBackground, InformationIcon, KaiIcon } from '@components/icons'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { formatPercentValue, formatWithCommas } from '@utils/text'

import { getStakeTokenIcon } from '../LendingTokenBox/LendingTokenBox.utils'
import { IMarketInfoBoxProps } from './MarketInfoBox.types'

const MarketInfoBox: React.FC<IMarketInfoBoxProps> = (props) => {
  const {
    tokenSymbol,
    collateral,
    currentDebt,
    ltv,
    tokenPrice,
    availableToBorrow,
    decimals,
  } = props

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconBackground position="relative">
            {getStakeTokenIcon(tokenSymbol)}
          </IconBackground>

          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {tokenSymbol}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">Available to borrow </Typography>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={0.5}
            mt={1}
          >
            <KaiIcon />
            <Typography variant="h6">{`$${formatWithCommas(
              availableToBorrow,
              decimals,
            )}`}</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {ltv === 0n && (
        <Paper
          elevation={3}
          sx={{ p: 0.75, display: 'flex', justifyContent: 'center' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <InformationIcon fill="#ffffff" />
            <Typography variant="body2">
              Deposit collateral to start borrowing.
            </Typography>
          </Box>
        </Paper>
      )}

      <Box display="flex" justifyContent="space-between" my={2}>
        <Typography variant="body2">LTV</Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="body2">
            {ltv === 0n ? 'No Loan' : `${formatPercentValue(ltv, decimals)}%`}
          </Typography>
        </Box>
      </Box>
      <LinearProgress value={ltv} decimals={decimals} />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="body2">{tokenSymbol} Price</Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="body2">
            {`$${formatWithCommas(tokenPrice, decimals)}`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mt={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Collateral</Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {getStakeTokenIcon(tokenSymbol, { width: 16, height: 16 })}
            <Typography variant="body2">
              {collateral ? `$${formatWithCommas(collateral, decimals)}` : '-'}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          <Typography variant="body2">Current Debt</Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <KaiIcon style={{ width: 16, height: 16 }} />
            <Typography variant="body2">
              {currentDebt
                ? `$${formatWithCommas(currentDebt, decimals)}`
                : '-'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default MarketInfoBox
