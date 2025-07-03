import React from 'react'

import { Avatar, Typography } from '@mui/material'

import { SelectedChain } from './ChainBox.styled'
import { IChainBoxProps } from './ChainBox.types'

const ChainBox: React.FC<IChainBoxProps> = (props) => {
  const { selectedChain } = props

  return (
    <SelectedChain sx={{ borderColor: selectedChain.borderColor }}>
      <Avatar src={selectedChain.logo} />
      <Typography variant="paragraphSmall">
        {selectedChain.chainName}
      </Typography>
    </SelectedChain>
  )
}

export default ChainBox
