export interface ITextFieldProps {
  endAdornmentSymbol?: string
  placeholder?: string
  startAdornment?: JSX.Element
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
