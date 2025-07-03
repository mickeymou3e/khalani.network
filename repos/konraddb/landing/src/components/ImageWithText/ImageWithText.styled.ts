import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(
  () => `
    background-color: #619bbe;
    position: relative;
  `,
)

export const TextContainer = styled(Box)(
  () => `
    position: absolute;
    width: 40%;
    @media(max-width: 899px) {
      bottom: 32px;
      width: 100%;
      top: unset;
      left: unset;
      position: relative;
      margin-top: 60px;
      right: 0 !important;
      padding: 0 16px;
    }
  `,
)
