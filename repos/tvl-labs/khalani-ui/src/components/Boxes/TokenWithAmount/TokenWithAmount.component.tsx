import React from 'react'

import CustomizedTooltip from '@components/Tooltip'
import Typography from '@components/Typography'
import { Box, Stack } from '@mui/material'
import { getTokenComponent } from '@utils/icons'

import { ITokenWithAmountProps } from './TokenWithAmount.types'

const TokenWithAmount: React.FC<ITokenWithAmountProps> = (props) => {
  const { symbol, balance, isTooltipVisible = false } = props

  return (
    <Box sx={{ width: 'fit-content' }}>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <CustomizedTooltip title={isTooltipVisible ? symbol : ''}>
          <Box display="flex">
            {getTokenComponent(symbol, { width: 16, height: 16 })}
          </Box>
        </CustomizedTooltip>

        <Typography
          text={balance ?? ''}
          variant="button"
          color="text.secondary"
          fontWeight={700}
        />
        {!isTooltipVisible && (
          <Typography text={symbol} variant="button" color="text.secondary" />
        )}
      </Stack>
    </Box>
  )
}

export default TokenWithAmount
