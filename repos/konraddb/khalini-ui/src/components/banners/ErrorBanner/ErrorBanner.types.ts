import { ReactNode } from 'react'

export interface IErrorBannerProps {
  backgroundImageUrl?: string
  noFill?: boolean
  children?: ReactNode
  text?: string
}
