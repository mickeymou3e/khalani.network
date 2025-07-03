import React from 'react'
import { PrimaryButton } from './Button.styled'
import { Box, ButtonProps as MuiButtonProps, useTheme } from '@mui/material'

interface ButtonProps extends MuiButtonProps {
  text: string
  url: string
}

const Button: React.FC<ButtonProps> = ({ text, url, variant, ...props }) => {
  const handleClick = () => {
    window.open(url, '_blank')
  }
  const theme = useTheme()

  return (
    <PrimaryButton
      onClick={handleClick}
      {...props}
      sx={{
        backgroundColor:
          variant === 'contained' ? '#90bf93' : theme.palette.primary.main,
      }}
    >
      <Box className="text">{text}</Box>
    </PrimaryButton>
  )
}

export default Button
