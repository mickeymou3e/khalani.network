import React from 'react'

import { TokenModel } from '@interfaces/core'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getTokenIconComponent } from '@utils/icons'
import { formatTokenSymbol } from '@utils/tokens'

import { CustomizedPopover } from './TokenSelectorPopover.styled'
import { TokenSelectorPopoverProps } from './TokenSelectorPopover.types'

const TokenSelectorPopover: React.FC<TokenSelectorPopoverProps> = ({
  tokens,
  open,
  anchorEl,
  selectedTokenId,
  handleClose,
  handleTokenSelect,
}) => {
  const onItemClick = (token: TokenModel) => {
    handleTokenSelect(token)
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
        {tokens?.map((token) => {
          const TokenIcon = getTokenIconComponent(token.symbol)
          return (
            <Box
              key={token.id}
              p={1}
              className={`item ${
                selectedTokenId === token.id ? 'selected' : ''
              }`}
              onClick={() => onItemClick(token)}
            >
              <TokenIcon />
              <Typography variant="button" color="text.secondary">
                {formatTokenSymbol(token.symbol)}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </CustomizedPopover>
  )
}

export default TokenSelectorPopover
