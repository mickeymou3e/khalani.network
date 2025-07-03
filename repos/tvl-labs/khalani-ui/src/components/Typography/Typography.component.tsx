import React from 'react'

import { Typography as MUITypography } from '@mui/material'

import { ITypographyProps } from './Typography.types'

const Typography: React.FC<ITypographyProps> = (props) => {
  const { text, ...typographyProps } = props

  return <MUITypography {...typographyProps}>{text}</MUITypography>
}

export default Typography
