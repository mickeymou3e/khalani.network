import React from 'react'

import ChainSelectorPopover from '@components/selectors/ChainSelectorPopover'
import { IconButton } from '@mui/material'
import { getNetworkIcon } from '@utils/network'

import { INetworkDetailsProps } from './NetworkDetails.types'

const NetworkDetails: React.FC<INetworkDetailsProps> = (props) => {
  const { chains, selectedChainId, onChainSelect } = props

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleNetworkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const selectedChain = chains?.find((chain) => chain.id === selectedChainId)

  return (
    <>
      <IconButton
        onClick={handleNetworkClick}
        sx={{ padding: 1, height: 'auto' }}
        size="small"
      >
        {getNetworkIcon(selectedChain?.id)}
      </IconButton>

      <ChainSelectorPopover
        chains={chains ?? []}
        open={open}
        selectedChainId={selectedChain?.id}
        anchorEl={anchorEl}
        handleChainSelect={onChainSelect}
        handleClose={handleClose}
      />
    </>
  )
}

export default NetworkDetails
