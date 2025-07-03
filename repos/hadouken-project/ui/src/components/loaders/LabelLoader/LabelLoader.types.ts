import { TypographyProps } from '@mui/material/Typography'

export interface ILabelLoaderProps extends TypographyProps {
  isFetching?: boolean
  text?: string
  tooltip?: string
  tooltipText: string
}
