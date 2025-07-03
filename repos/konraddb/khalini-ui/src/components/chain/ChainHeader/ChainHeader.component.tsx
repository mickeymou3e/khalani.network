import React from 'react'

import { Box, Typography } from '@mui/material'

import ChainBox from '../ChainBox/ChainBox.component'
import { messages } from './ChainHeader.messages'
import { IChainHeaderProps } from './ChainHeader.types'

const ChainHeader: React.FC<IChainHeaderProps> = (props) => {
  const { expectedChain } = props

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
    >
      <Typography variant="breadCrumbs" sx={{ opacity: 0.7 }}>
        {messages.NETWORK_LABEL}
      </Typography>
      {expectedChain && <ChainBox selectedChain={expectedChain} />}
    </Box>
  )
}

export default ChainHeader
