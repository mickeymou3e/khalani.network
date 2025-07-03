import React from 'react'

import { CloseIcon } from '@components/icons'
import { IconButton, Typography, useTheme } from '@mui/material'
import { getNetworkIcon } from '@utils/network'

import { CustomizedChip } from './ChainChip.styled'
import { IChainChipProps } from './ChainChip.types'

const ChainChip: React.FC<IChainChipProps> = (props) => {
  const { chainId, chainName, withCloseButton = false, buttonClickFn } = props
  const theme = useTheme()

  return (
    <CustomizedChip data-testid="chainChip">
      {getNetworkIcon(chainId)}
      <Typography variant="body2" color="text.secondary">
        {chainName}
      </Typography>
      {withCloseButton && (
        <IconButton
          sx={{ p: 0 }}
          onClick={(event) => buttonClickFn?.(event, chainId)}
        >
          <CloseIcon
            fill={theme.palette.common.black}
            style={{ width: 18, height: 18 }}
          />
        </IconButton>
      )}
    </CustomizedChip>
  )
}

export default ChainChip
