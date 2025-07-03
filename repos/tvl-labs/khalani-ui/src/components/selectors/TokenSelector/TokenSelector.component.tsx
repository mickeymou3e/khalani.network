import React, { useState } from 'react'

import { Box } from '@mui/material'

import TokenSelectorPopover from '../TokenSelectorPopover'
import { TokenSelectorProps } from './TokenSelector.types'
import TokenItem from './components/TokenItem/TokenItem.component'

const TokenSelector: React.FC<TokenSelectorProps> = (props) => {
  const { tokens, selectedToken, handleTokenChange } = props

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
        <TokenItem
          selectedToken={selectedToken}
          handleClickOpen={handleClickOpen}
        />
      </Box>
      <TokenSelectorPopover
        tokens={tokens}
        open={open}
        selectedTokenId={selectedToken?.id}
        anchorEl={anchorEl}
        handleTokenSelect={handleTokenChange}
        handleClose={handleClose}
      />
    </>
  )
}

export default TokenSelector
