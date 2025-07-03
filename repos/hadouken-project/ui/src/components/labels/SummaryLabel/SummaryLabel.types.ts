import { ReactNode } from 'react'

export interface ISummaryLabelProps {
  label: string | ReactNode
  value: string | ReactNode
  showTopBorder?: boolean
  disabled?: boolean
}
