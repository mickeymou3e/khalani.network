import React from 'react'

import { CustomizedSecondaryButton } from './SecondaryButton.styled'
import { ISecondaryButtonProps } from './SecondaryButton.types'

const SecondaryButton: React.FC<ISecondaryButtonProps> = (props) => {
  const { text, children, ...buttonProps } = props

  return (
    <CustomizedSecondaryButton {...buttonProps}>
      {text || children}
    </CustomizedSecondaryButton>
  )
}

export default SecondaryButton
