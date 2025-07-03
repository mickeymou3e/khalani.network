import React from 'react'

import { CustomizedRadioGroup } from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'
import { SLIPPAGE_DECIMALS } from '@utils/math'

import { messages } from './SlippageSelector.messages'
import { ISlippageSelectorProps } from './SlippageSelector.types'

const SlippageSelector: React.FC<ISlippageSelectorProps> = ({
  slippage,
  onSlippageChange,
  decimals = SLIPPAGE_DECIMALS,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection={{ xs: 'column', md: 'row' }}
    >
      <Box
        display="flex"
        justifyContent="flex-start"
        width={{ xs: '100%', md: '20%' }}
        py={{ xs: 2, md: 0 }}
      >
        <Typography variant="paragraphTiny">
          {messages.SLIPPAGE_TOLERANCE}
        </Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="end">
        <CustomizedRadioGroup
          value={slippage}
          buttonLabel={messages.CUSTOM_AMOUNT}
          onSlippageChange={onSlippageChange}
          decimals={decimals}
        />
      </Box>
    </Box>
  )
}

export default SlippageSelector
