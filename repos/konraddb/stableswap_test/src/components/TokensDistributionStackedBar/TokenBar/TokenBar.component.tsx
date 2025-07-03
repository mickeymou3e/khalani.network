import React from 'react'

import { Box, Typography } from '@mui/material'
import { getValidPercentage } from '@utils/math'

import { ITokenBarProps } from './TokenBar.types'

const TokenBar: React.FC<ITokenBarProps> = ({ percentage, symbol, color }) => {
  const tokenBarWidth = getValidPercentage(percentage)

  return (
    <Box height="100%" width={`${tokenBarWidth}%`}>
      <Box width="100%" height="100%" style={{ backgroundColor: color }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Typography
            color={(theme) => theme.palette.common.white}
            sx={{
              fontWeight: 700,
            }}
          >
            {symbol}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TokenBar
