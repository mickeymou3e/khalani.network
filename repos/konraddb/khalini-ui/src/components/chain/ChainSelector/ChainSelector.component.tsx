import React from 'react'

import { Box, Typography } from '@mui/material'

import ChainBox from '../ChainBox/ChainBox.component'
import { ChainLogo } from './ChainSelector.styled'
import { IChainSelectorProps } from './ChainSelector.types'

const ChainSelector: React.FC<IChainSelectorProps> = (props) => {
  const { label, chains, selectedChain, handleChainClick } = props

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="breadCrumbs" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>
      <Box display="flex" justifyContent="flex-end" gap={1.5}>
        <ChainBox selectedChain={selectedChain} />
        {chains.map((chain) => (
          <ChainLogo key={chain.id} onClick={() => handleChainClick(chain)}>
            <img src={chain?.logo} />
          </ChainLogo>
        ))}
      </Box>
    </Box>
  )
}

export default ChainSelector
