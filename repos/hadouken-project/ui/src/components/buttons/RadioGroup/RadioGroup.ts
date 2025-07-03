export interface IRadioGroupProps {
  options: { id: string; name: string; disabled?: boolean }[]
  onOptionChange?: (value: string) => void
  selected?: string
  row?: boolean
}
