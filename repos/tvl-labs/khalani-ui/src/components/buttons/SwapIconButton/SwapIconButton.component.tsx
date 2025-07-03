import React from 'react'

import SwapHorizontalIcon from '@components/icons/business/SwapHorizontal'

import { CustomizedSwapIconButton } from './SwapIconButton.styled'
import { ISwapIconButtonProps } from './SwapIconButton.types'

const SwapIconButton: React.FC<ISwapIconButtonProps> = (props) => {
  const { onClick } = props

  return (
    <CustomizedSwapIconButton size="small" onClick={onClick}>
      <SwapHorizontalIcon />
    </CustomizedSwapIconButton>
  )
}

export default SwapIconButton
