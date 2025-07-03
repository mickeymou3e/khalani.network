import React from 'react'
import { PrimaryButton } from './Button.styled'
import { Typography } from '@tvl-labs/khalani-ui'

interface ButtonProps {
  text: string
  url: string
}

const Button: React.FC<ButtonProps> = ({ text, url }) => {
  const handleClick = () => {
    window.open(url, '_blank')
  }

  return (
    <PrimaryButton onClick={handleClick}>
      <Typography text={text} variant="subtitle1" textTransform="none" />
    </PrimaryButton>
  )
}

export default Button
