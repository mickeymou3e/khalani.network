import React, { useState } from 'react'

import { Box } from '@mui/material'

import ChainItem from '../ChainSelector/components/ChainItem/ChainItem.component'
import ChainSelectorPopover from '../ChainSelectorPopover'
import { SingleChainSelectorProps } from './SingleChainSelector.types'

const SingleChainSelector: React.FC<SingleChainSelectorProps> = (props) => {
  const { chains, selectedChain, handleChainChange } = props

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ChainItem
          selectedChain={selectedChain}
          handleClickOpen={handleClickOpen}
        />
      </Box>
      <ChainSelectorPopover
        chains={chains}
        open={open}
        selectedChainId={selectedChain?.id}
        anchorEl={anchorEl}
        handleChainSelect={handleChainChange}
        handleClose={handleClose}
      />
    </>
  )
}

export default SingleChainSelector
