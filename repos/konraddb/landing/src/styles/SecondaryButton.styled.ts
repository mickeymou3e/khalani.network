import { alpha, styled } from '@mui/material'
import { Button } from '@tvl-labs/khalani-ui'

export const SecondaryButton = styled(Button)(
  ({ theme }) => `
     background-color: ${theme.palette.common.white};
     color: ${theme.palette.common.black};
     font-weight: 600;
     &:hover {
      background-color: ${alpha(theme.palette.common.white, 0.7)}
     }
  `,
)
