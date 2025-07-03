import React from 'react'

import TokenInSummary from '@components/Boxes/TokenInSummary'
import { SwapRight } from '@components/icons'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IBridgePreviewProps } from './BridgePreview.types'

const BridgePreview: React.FC<IBridgePreviewProps> = ({ tokens }) => (
  <Box mt={2}>
    <Box display="flex" alignItems="center" mb={2}>
      {tokens.map((token, index) => (
        <React.Fragment key={index}>
          <Box flexBasis="50%">
            <Typography variant="body2" color="text.secondary">
              {index === 0 ? 'From' : 'To'}
            </Typography>
            <TokenInSummary
              symbol={token.symbol}
              amount={token.amount}
              amountUSD={token.amountUSD}
              chainId={token.chainId}
              hideUSDValues
            />
          </Box>
          {index === 0 && (
            <Box mt={4}>
              <SwapRight />
            </Box>
          )}
        </React.Fragment>
      ))}
    </Box>
  </Box>
)

export default BridgePreview
