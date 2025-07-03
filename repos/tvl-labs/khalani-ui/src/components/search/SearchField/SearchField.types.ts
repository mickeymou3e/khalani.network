import { InputBaseProps } from '@mui/material/InputBase'

export interface ISearchFieldProps extends InputBaseProps {
  handleSearchClick: () => void
  notFound?: boolean
  loading?: boolean
  valueChangeHandler?: (value: string) => void
}
