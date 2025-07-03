import { IDisplayValue } from '@interfaces/data'

export interface ITokenBarProps extends ITokenPercentage {
  color: string
}

export interface ITokenPercentage {
  symbol?: string
  percentage: number
}

export interface ITokenPreview extends ITokenPercentage {
  value: string
  amount?: IDisplayValue
}

export interface ITokenPreviewColorized extends ITokenPreview {
  color: string
}
