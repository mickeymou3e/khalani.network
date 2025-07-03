import React from 'react'

import { Button as MUIButton } from '@mui/material'

import { IButtonProps } from './Button.types'

const Button: React.FC<IButtonProps> = (props) => {
  const { text, ...buttonProps } = props

  return <MUIButton {...buttonProps}>{text}</MUIButton>
}

export default Button
