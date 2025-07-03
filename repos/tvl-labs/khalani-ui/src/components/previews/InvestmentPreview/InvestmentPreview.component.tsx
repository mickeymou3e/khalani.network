import React from 'react'

import LPBalance from '@components/Boxes/LPBalance'
import TokenInSummary from '@components/Boxes/TokenInSummary'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IInvestmentPreviewProps } from './InvestmentPreview.types'

const InvestmentPreview: React.FC<IInvestmentPreviewProps> = ({
  label,
  tokenSymbols,
  poolShare,
  outputAmount,
  tokens,
  isLoading,
}) => (
  <Box>
    <Typography
      textAlign="start"
      variant="body2"
      color="text.secondary"
      sx={{ my: 2 }}
    >
      {label}
    </Typography>

    {tokens.map((token, index) => (
      <TokenInSummary
        key={index}
        symbol={token.symbol}
        amount={token.amount}
        amountUSD={token.amountUSD}
        chainId={token.chainId}
      />
    ))}

    <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
      Breakdown:
    </Typography>

    <LPBalance
      tokenSymbols={tokenSymbols}
      poolShare={poolShare}
      label={'You Receive:'}
      balance={outputAmount}
      isLoading={isLoading}
      isPoolShare
      fromModal
    />
  </Box>
)

export default InvestmentPreview
