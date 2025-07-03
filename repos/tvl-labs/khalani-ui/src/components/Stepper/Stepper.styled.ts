import { Box, styled } from '@mui/material'

export const StepperItem = styled(Box)(
  ({ theme }) => `
        width: 22px;
        height: 22px;
        border: 1px solid ${theme.palette.secondary.main};
        border-radius: 999px;
        display: flex;
        justify-content: center;
        align-items: center;
        &.idle {
            opacity: 0.6
        }
    `,
)

export const CircularProgressLabel = styled(Box)(
  () => `
        top:0;
        bottom:0;
        left:0;
        right:0;
        position: absolute;
        dispaly: flex;
        justify-content: center;
        align-items: center;
      `,
)
