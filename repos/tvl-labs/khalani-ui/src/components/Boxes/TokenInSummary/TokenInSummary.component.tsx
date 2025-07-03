import React from 'react'

import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import { Box, Typography } from '@mui/material'
import { formatTokenSymbol } from '@utils/tokens'

import { TokenSummaryBox } from './TokenInSummary.styled'
import { ITokenInSummaryProps } from './TokenInSummary.types'

const TokenInSummary: React.FC<ITokenInSummaryProps> = (props) => {
  const { symbol, amount, amountUSD, chainId, hideUSDValues } = props

  const tokenSymbol = formatTokenSymbol(symbol)

  return (
    <TokenSummaryBox mt={1}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        margin={amount ? 0 : '0 auto'}
      >
        {tokenSymbol && (
          <TokenWithNetwork
            chainId={parseInt(chainId)}
            tokenSymbol={tokenSymbol}
          />
        )}
        <Typography variant="button" color="text.secondary">
          {tokenSymbol}
        </Typography>
      </Box>
      {amount && (
        <Box>
          <Typography
            variant="body1"
            fontWeight={500}
            textAlign="right"
            color="text.secondary"
          >
            {amount}
          </Typography>
          {!hideUSDValues && (
            <Typography
              variant="button"
              color="text.secondary"
              textAlign="right"
            >
              {`$${amountUSD}`}
            </Typography>
          )}
        </Box>
      )}
    </TokenSummaryBox>
  )
}

export default TokenInSummary
