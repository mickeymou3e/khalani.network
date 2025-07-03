import React from 'react'

import { SettingsIcon } from '@components/icons'
import { ButtonProps } from '@mui/material'

import { CustomizedSettingsButton } from './SettingsButton.styled'

const SettingsButton: React.FC<ButtonProps> = (props) => {
  const { ...buttonProps } = props

  return (
    <CustomizedSettingsButton color="primary" {...buttonProps}>
      <SettingsIcon />
    </CustomizedSettingsButton>
  )
}

export default SettingsButton
