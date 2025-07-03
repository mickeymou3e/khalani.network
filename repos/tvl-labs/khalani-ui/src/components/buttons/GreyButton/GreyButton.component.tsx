import React from 'react'

import { CustomizedGreyButton } from './GreyButton.styled'
import { IGreyButtonProps } from './GreyButton.types'

const GreyButton: React.FC<IGreyButtonProps> = (props) => {
  const { children, ...buttonProps } = props

  return (
    <CustomizedGreyButton color="inherit" {...buttonProps}>
      {children}
    </CustomizedGreyButton>
  )
}

export default GreyButton
