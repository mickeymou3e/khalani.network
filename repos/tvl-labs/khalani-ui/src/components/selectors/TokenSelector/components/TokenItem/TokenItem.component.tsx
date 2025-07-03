import React from 'react'

import GreyButton from '@components/buttons/GreyButton'
import { ArrowDownIcon } from '@components/icons'
import { Box, Skeleton, Typography } from '@mui/material'
import { getTokenIconComponent } from '@utils/icons'
import { formatTokenSymbol } from '@utils/tokens'

import { ITokenItemProps } from './TokenItem.types'

const TokenItem: React.FC<ITokenItemProps> = (props) => {
  const { selectedToken, handleClickOpen } = props

  const TokenIcon = getTokenIconComponent(selectedToken?.symbol)

  return (
    <GreyButton
      sx={{ p: 1.5, width: '100%', justifyContent: 'space-between' }}
      onClick={handleClickOpen}
    >
      <Box display="flex" alignItems="center">
        {selectedToken ? (
          <TokenIcon />
        ) : (
          <Skeleton variant="circular" width={24} height={24} />
        )}
        <Typography variant="button" sx={{ ml: 1 }}>
          {formatTokenSymbol(selectedToken?.symbol)}
        </Typography>
      </Box>
      <ArrowDownIcon />
    </GreyButton>
  )
}

export default TokenItem
