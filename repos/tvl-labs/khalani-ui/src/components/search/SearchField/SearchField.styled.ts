import { alpha, IconButton, Input, styled } from '@mui/material'

export const CustomizedSearchField = styled(Input)(
  () => `
       width: 100%;
      .MuiInput-input {
        height: auto;
        padding: 12px 0 12px 16px;
      }
   `,
)

export const SearchButton = styled(IconButton)(
  ({ theme }) => `
       height: 41px;
       background-color: ${theme.palette.primary.dark};
       border-radius: 0;
       padding: 0 11px;
       border-top-right-radius: 8px;
       border-bottom-right-radius: 8px;
       :hover {
        background-color: ${alpha(theme.palette.primary.dark, 0.7)};
       }
       &.Mui-disabled {
        background-color: ${theme.palette.primary.dark}
       }
   `,
)
