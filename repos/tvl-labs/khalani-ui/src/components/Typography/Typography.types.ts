import { ReactElement } from 'react'

import { TypographyProps } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

export interface ITypographyProps extends TypographyProps {
  text: string | ReactElement
  variant: Variant
}
