import React from 'react'

import { CircularProgress } from '@mui/material'

import { CustomizedPrimaryButton } from './PrimaryButton.styled'
import { IPrimaryButtonProps } from './PrimaryButton.types'

const PrimaryButton: React.FC<IPrimaryButtonProps> = (props) => {
  const { text, children, isLoading = false, ...buttonProps } = props

  return (
    <CustomizedPrimaryButton {...buttonProps}>
      {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
      {text || children}
    </CustomizedPrimaryButton>
  )
}

export default PrimaryButton
