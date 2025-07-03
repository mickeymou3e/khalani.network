import React from 'react'

import { CustomizedLightButton } from './LightButton.styled'
import { ILightButtonProps } from './LightButton.types'

const LightButton: React.FC<ILightButtonProps> = (props) => {
  const { text, ...buttonProps } = props

  return (
    <CustomizedLightButton color="inherit" {...buttonProps}>
      {text}
    </CustomizedLightButton>
  )
}

export default LightButton
