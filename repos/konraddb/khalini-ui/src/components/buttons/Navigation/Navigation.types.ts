import { ReactElement } from 'react'

import { ButtonProps } from '@mui/material/Button'

export interface INavigationProps {
  text: string | ReactElement
  sx?: ButtonProps['sx']
  onClick?: ButtonProps['onClick']
}
