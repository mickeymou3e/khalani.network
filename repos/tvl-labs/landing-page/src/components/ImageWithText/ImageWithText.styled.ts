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
    @media(max-width: 1008px) {
      bottom: 32px;
      width: 100%;
      top: unset;
      left: unset;
      position: relative;
      margin-top: 80px;
      right: 0 !important;
      padding: 0 9vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    @media(max-width: 450px) {
      margin-top: 40px;
    }
  `,
)
