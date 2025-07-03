import React from 'react'

import { Box, Typography } from '@mui/material'

import { messages } from './FeesBox.messages'
import { IFeesBoxProps } from './FeesBox.types'

const FeesBox: React.FC<IFeesBoxProps> = (props) => {
  const { platformFee, gasFee } = props

  return (
    <>
      <Box display="flex" alignItems="center" mt={4}>
        <Typography sx={{ mr: 1, opacity: 0.7 }} variant="paragraphMedium">
          {messages.PLATFROM_FEE_LABEL}
        </Typography>
        <Typography sx={{ mr: 1 }}>
          {platformFee.toFixed(2)} {messages.ETH_LABEL}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={2}>
        <Typography sx={{ mr: 1, opacity: 0.7 }} variant="paragraphMedium">
          {messages.GAS_FEE_LABEL}
        </Typography>
        <Typography sx={{ mr: 1 }}>
          {gasFee.toFixed(2)} {messages.ETH_LABEL}
        </Typography>
      </Box>
    </>
  )
}

export default FeesBox
