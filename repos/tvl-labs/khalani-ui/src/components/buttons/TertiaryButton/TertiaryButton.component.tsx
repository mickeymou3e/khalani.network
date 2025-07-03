import React from 'react'

import { CustomizedTertiaryButton } from './TertiaryButton.styled'
import { ITertiaryButtonProps } from './TertiaryButton.types'

const TertiaryButton: React.FC<ITertiaryButtonProps> = (props) => {
  const { label, onClickFn } = props

  return (
    <CustomizedTertiaryButton onClick={onClickFn} variant="text" text={label} />
  )
}

export default TertiaryButton
