import React from 'react'

import { IChain } from '@interfaces/core'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getNetworkIcon } from '@utils/network'

import { CustomizedPopover } from './ChainSelectorPopover.styled'
import { ChainSelectorPopoverProps } from './ChainSelectorPopover.types'

const ChainSelectorPopover: React.FC<ChainSelectorPopoverProps> = ({
  chains,
  open,
  anchorEl,
  selectedChainId,
  handleClose,
  handleChainSelect,
}) => {
  const onItemClick = (chain: IChain) => {
    handleChainSelect(chain)
    handleClose()
  }

  return (
    <CustomizedPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box p={2} display="flex" flexDirection="column" gap={0.25}>
        {chains?.map((chain) => (
          <Box
            key={chain.id}
            p={1}
            className={`item ${selectedChainId === chain.id ? 'selected' : ''}`}
            onClick={() => onItemClick(chain)}
          >
            {getNetworkIcon(chain.id, {
              style: { width: 32, height: 32 },
            })}
            <Typography variant="button" color="text.secondary">
              {chain.chainName}
            </Typography>
          </Box>
        ))}
      </Box>
    </CustomizedPopover>
  )
}

export default ChainSelectorPopover
