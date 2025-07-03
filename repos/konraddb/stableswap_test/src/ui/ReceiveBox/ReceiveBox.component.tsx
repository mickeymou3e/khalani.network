import React from 'react'

import { Box, Typography } from '@mui/material'

import { messages } from './ReceiveBox.messages'
import { ChainLogo } from './ReceiveBox.styled'
import { IReceiveBoxProps } from './ReceiveBox.types'

const ReceiveBox: React.FC<IReceiveBoxProps> = (props) => {
  const { amount, tokenSymbol, chainLogo, additionalData } = props

  return (
    <Box display="flex" alignItems="center">
      <Typography sx={{ mr: 1, opacity: 0.7 }} variant="paragraphMedium">
        {messages.RECEIVE_LABEL}
      </Typography>
      <Typography sx={{ mr: 1 }}>
        {amount.toFixed(2)} {tokenSymbol}
      </Typography>
      {additionalData && (
        <Typography>
          + {additionalData.amount.toFixed(2)} {additionalData.tokenSymbol}
        </Typography>
      )}
      {chainLogo && <ChainLogo src={chainLogo} />}
    </Box>
  )
}

export default ReceiveBox
