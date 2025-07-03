import { ReactNode } from 'react'

export interface IWarningBannerProps {
  title: string | ReactNode
  description: string | ReactNode
  icon?: ReactNode
}
