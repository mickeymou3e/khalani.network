import React from 'react'

import { CustomizedSecondaryButton } from './SecondaryButton.styled'
import { ISecondaryButtonProps } from './SecondaryButton.types'

const SecondaryButton: React.FC<ISecondaryButtonProps> = (props) => {
  const { label, onClickFn } = props

  return (
    <CustomizedSecondaryButton
      onClick={onClickFn}
      variant="text"
      text={label}
    />
  )
}

export default SecondaryButton
