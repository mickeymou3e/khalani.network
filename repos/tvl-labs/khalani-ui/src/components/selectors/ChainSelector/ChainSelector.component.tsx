import React, { useState } from 'react'

import SwapIconButton from '@components/buttons/SwapIconButton'
import { IChain } from '@interfaces/core'
import { Box, Paper } from '@mui/material'

import ChainSelectorPopover from '../ChainSelectorPopover'
import { IChainSelectorProps } from './ChainSelector.types'
import ChainItem from './components/ChainItem/ChainItem.component'

const ChainSelector: React.FC<IChainSelectorProps> = (props) => {
  const {
    originChains,
    destinationChains,
    selectedOriginChain,
    selectedDestinationChain,
    handleOriginChainChange,
    handleDestinationChainChange,
    handleSwapButtonClick,
  } = props

  const [selectableChains, setSelectableChains] = useState<IChain[]>()
  const [isOrigin, setIsOrigin] = useState<boolean>()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClickOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    isOrigin: boolean,
  ) => {
    setSelectableChains(isOrigin ? originChains : destinationChains)
    setIsOrigin(isOrigin)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ChainItem
          selectedChain={selectedOriginChain}
          handleClickOpen={(event) => handleClickOpen(event, true)}
        />
        <Paper elevation={3}>
          <SwapIconButton onClick={handleSwapButtonClick} />
        </Paper>
        <ChainItem
          selectedChain={selectedDestinationChain}
          handleClickOpen={(event) => handleClickOpen(event, false)}
        />
      </Box>
      <ChainSelectorPopover
        chains={selectableChains ?? []}
        open={open}
        selectedChainId={
          isOrigin ? selectedOriginChain?.id : selectedDestinationChain?.id
        }
        anchorEl={anchorEl}
        handleChainSelect={
          isOrigin ? handleOriginChainChange : handleDestinationChainChange
        }
        handleClose={handleClose}
      />
    </>
  )
}

export default ChainSelector
