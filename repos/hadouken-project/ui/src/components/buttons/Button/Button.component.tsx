import React from 'react'

import MUIButton from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import { IButtonProps } from './Button.types'

const Button: React.FC<IButtonProps> = ({
  text,
  isFetching,
  disabled,
  size,
  color = 'inherit',
  ...rest
}) => {
  return (
    <MUIButton
      color={color}
      disabled={isFetching ? true : disabled}
      size={size}
      {...rest}
    >
      {isFetching ? (
        <CircularProgress size={size === 'large' ? 32 : 16} color="primary" />
      ) : (
        text
      )}
    </MUIButton>
  )
}

export default Button
