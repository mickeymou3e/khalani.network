import { SliderProps } from '@mui/material'

export interface IHealthCheckSlider extends SliderProps {
  leftLabel: string
  factorLabel: string
  factorValueLabel: string
  rightLabel: string
  min?: number
  onValueChange?: (value: number) => void
}
