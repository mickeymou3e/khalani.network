import { SxProps, Theme } from '@mui/material'

export const placeholderStyles = (): SxProps<Theme> => ({
  'input::placeholder': {
    color: (theme: Theme) => theme.palette.text.primary,
    opacity: 1,
  },
  '& input::-webkit-input-placeholder': {
    color: (theme: Theme) => theme.palette.text.primary,
    opacity: 1,
  },
  '& input:-ms-input-placeholder': {
    color: (theme: Theme) => theme.palette.text.primary,
    opacity: 1,
  },
})
