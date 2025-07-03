import { alpha, Box, styled } from '@mui/material'

const backgroundColor = '#031C36'
const borderColor = alpha('#3793FF', 0.3)

export const InputBackground = styled(Box)(
  () => `
      background: ${backgroundColor};
      border: 1px solid ${borderColor};
      border-radius: 8px;
      padding: 12px 12px 4px 12px;
    `,
)
