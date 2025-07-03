import { ToggleButtonGroupProps } from '@mui/material'

export interface IToggleGroupProps extends ToggleButtonGroupProps {
  toggles: { id: string; name: string; disabled?: boolean }[]
  selected: string
  disabled?: boolean
  onToggleChange?: (value: string) => void
}
