import React from 'react'

import LinearProgress from '@components/LinearProgress'
import { IconBackground, KaiIcon } from '@components/icons'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { formatPercentValue, formatWithCommas } from '@utils/text'

import { TokenBox } from './LendingTokenBox.styled'
import { ILendingTokenBoxProps } from './LendingTokenBox.types'
import { getStakeTokenIcon } from './LendingTokenBox.utils'

const LendingTokenBox: React.FC<ILendingTokenBoxProps> = (props) => {
  const {
    tokenSymbol,
    mintCap,
    minDebt,
    oneTimeFee,
    collateral,
    currentDebt,
    ltv,
    decimals,
    onClick,
  } = props

  return (
    <TokenBox sx={{ p: 2 }} onClick={() => onClick(tokenSymbol)}>
      <Box display="flex" alignItems="center">
        <IconBackground position="relative">
          {getStakeTokenIcon(tokenSymbol)}
        </IconBackground>

        <Typography variant="subtitle2" sx={{ ml: 2 }}>
          {tokenSymbol}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">LTV</Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="body2">
            {ltv === 0n ? 'No Loan' : `${formatPercentValue(ltv, decimals)}%`}
          </Typography>
        </Box>
      </Box>
      <LinearProgress value={ltv} decimals={decimals} />

      <Box my={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Collateral</Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {getStakeTokenIcon(tokenSymbol, { width: 16, height: 16 })}
            <Typography variant="body2">
              {collateral ? `$${formatWithCommas(collateral, decimals)}` : '-'}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between">
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

      <Paper elevation={1} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Min Debt</Typography>
          <Typography variant="body2">
            ${formatWithCommas(minDebt, decimals)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Mint cap</Typography>
          <Typography variant="body2">
            ${formatWithCommas(mintCap, decimals)} Kai
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">One-Time fee</Typography>
          <Typography variant="body2">
            {oneTimeFee < BigInt(5) * BigInt(10) ** BigInt(decimals - 2)
              ? '0.05% or less'
              : formatPercentValue(oneTimeFee, decimals)}
          </Typography>
        </Box>
      </Paper>
    </TokenBox>
  )
}

export default LendingTokenBox
