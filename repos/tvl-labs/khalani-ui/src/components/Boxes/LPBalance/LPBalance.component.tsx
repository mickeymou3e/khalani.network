import React from 'react'

import { SLIPPAGE_DECIMALS } from '@components/inputs/SlippageTolerance/SlippageTolerance.constants'
import { Box, Paper, Skeleton, Typography } from '@mui/material'
import { bigIntToString, formatOutputAmount } from '@utils/text'
import { formatFullTokenSymbol } from '@utils/tokens'

import { messages } from './LPBalance.messages'
import { ILPBalanceProps } from './LPBalance.types'

const LPBalance: React.FC<ILPBalanceProps> = (props) => {
  const {
    label,
    slippage,
    balance,
    tokenSymbols,
    poolShare,
    gasPayment,
    nativeTokenSymbol,
    isPoolShare = false,
    isLoading = false,
    fromModal = false,
    isGasPayment = false,
  } = props

  const formattedTokens = formatFullTokenSymbol(tokenSymbols)

  return (
    <Paper elevation={3} sx={{ p: 2.25 }}>
      {slippage && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {messages.SLIPPAGE_LABEL}
          </Typography>
          <Typography variant="body2">
            {formatOutputAmount(slippage, SLIPPAGE_DECIMALS)}%
          </Typography>
        </Box>
      )}
      {isPoolShare && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="body2"
            color={fromModal ? 'text.primary' : 'text.secondary'}
          >
            {messages.POOL_SHARE_LABEL}
          </Typography>
          {isLoading ? (
            <Skeleton width={50} />
          ) : (
            <Typography variant="body2">
              {poolShare ? `${poolShare}%` : '-'}
            </Typography>
          )}
        </Box>
      )}
      {label && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="body2"
            color={fromModal ? 'text.primary' : 'text.secondary'}
          >
            {label}
          </Typography>
          {isLoading ? (
            <Skeleton width={50} />
          ) : (
            <Typography variant="body2">
              {balance ? `${balance} ${formattedTokens}` : '-'}
            </Typography>
          )}
        </Box>
      )}
      {isGasPayment && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="body2"
            color={fromModal ? 'text.primary' : 'text.secondary'}
          >
            Gas cost:
          </Typography>
          {isLoading ? (
            <Skeleton width={50} />
          ) : (
            <Typography variant="body2">
              {gasPayment
                ? `${bigIntToString(gasPayment, 18)} ${nativeTokenSymbol}`
                : '-'}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  )
}

export default LPBalance
