import { alpha, Box, styled } from '@mui/material'

export const CustomizedTransactionIcon = styled(Box)(
  ({ theme }) => `
        height: 25px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 0 4px;
        &.pending {
            border: 1px solid ${theme.palette.warning.main};
            background: ${alpha(theme.palette.warning.main, 0.2)}
        }
        &.success {
            border: 1px solid ${theme.palette.success.main};
            background: ${alpha(theme.palette.success.main, 0.2)}
        }
        &.fail {
            border: 1px solid ${theme.palette.error.main};
            background: ${alpha(theme.palette.error.main, 0.2)}
        }
     `,
)
