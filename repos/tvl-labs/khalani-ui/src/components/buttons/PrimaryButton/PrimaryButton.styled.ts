import { Button, styled } from '@mui/material'

export const CustomizedPrimaryButton = styled(Button)(
  ({ theme }) => `
    width: auto;
    background: ${theme.palette.primary.main};
    border-radius: 99999px;
    justify-content: center;
    align-items: center;
    color: ${theme.palette.secondary.main};
    :hover {
      background: ${theme.palette.primary.main};
      color: ${theme.palette.secondary.main};
    }
    &.Mui-disabled {
      border: none;
    }
  `,
)
