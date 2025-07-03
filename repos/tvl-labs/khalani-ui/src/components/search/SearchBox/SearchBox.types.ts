import { InputBaseProps } from '@mui/material/InputBase'

export interface ISearchBoxProps extends InputBaseProps {
  valueChangeHandler?: (value: string) => void
}
