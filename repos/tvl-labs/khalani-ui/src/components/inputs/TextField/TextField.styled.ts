import { styled, TextField } from '@mui/material'

export const TextFieldStyled = styled(TextField)(
  ({ theme }) => `
      .Mui-focused {
        background-color: ${theme.palette.elevation.main} !important;
        color: ${theme.palette.text.secondary};
      }
      .MuiFilledInput-root {
        background-color: ${theme.palette.elevation.main} !important;
        border-radius: 8px;
        ::after, ::before {
            border-bottom: none;
        }
      }
      .MuiFilledInput-input {
        padding-top: 8px;
      }
  `,
)
