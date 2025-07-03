import React from 'react'

import SwapVertIcon from '@mui/icons-material/SwapVert'

import { CustomizedIconButton } from './SwapIconButton.styled'
import { ISwapIconButtonProps } from './SwapIconButton.types'

const SwapIconButton: React.FC<ISwapIconButtonProps> = (props) => {
  const { onClick } = props

  return (
    <CustomizedIconButton
      color="secondary"
      size="medium"
      sx={{ mt: 2, ml: 5 }}
      onClick={onClick}
    >
      <SwapVertIcon />
    </CustomizedIconButton>
  )
}

export default SwapIconButton
