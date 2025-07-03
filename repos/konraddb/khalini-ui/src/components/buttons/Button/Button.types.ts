import { ReactElement } from 'react'

import { ButtonProps } from '@mui/material/Button'

export interface IButtonProps extends ButtonProps {
  text: string | ReactElement
  isFetching?: boolean
}
