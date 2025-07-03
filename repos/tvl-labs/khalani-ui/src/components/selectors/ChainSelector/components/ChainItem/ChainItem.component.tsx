import React from 'react'

import GreyButton from '@components/buttons/GreyButton'
import { ArrowDownIcon } from '@components/icons'
import { Box, Skeleton, Typography } from '@mui/material'
import { getNetworkIcon } from '@utils/network'

import { IChainItemProps } from './ChainItem.types'

const ChainItem: React.FC<IChainItemProps> = (props) => {
  const { selectedChain, handleClickOpen } = props

  return (
    <GreyButton
      sx={{ p: 1, width: '100%', justifyContent: 'space-between' }}
      onClick={handleClickOpen}
    >
      <Box display="flex" alignItems="center">
        {selectedChain ? (
          getNetworkIcon(selectedChain.id)
        ) : (
          <Skeleton variant="circular" width={24} height={24} />
        )}
        <Typography variant="button" sx={{ ml: 1 }}>
          {selectedChain?.chainName}
        </Typography>
      </Box>
      <ArrowDownIcon />
    </GreyButton>
  )
}

export default ChainItem
