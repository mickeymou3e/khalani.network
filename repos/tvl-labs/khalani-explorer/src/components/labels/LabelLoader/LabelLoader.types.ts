import { TypographyProps } from '@mui/material'

export interface ILabelLoaderProps extends TypographyProps {
  isFetching: boolean
  text: string
}
