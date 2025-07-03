import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(
  ({ theme }) => `
    opacity: 0.9;
    border: 3px solid #ffffff;
    border-radius: 16px;
    position: absolute;
    top: 5.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    background: ${theme.palette.secondary.main};
    @media (max-width: 1441px) {
      width: 60%;
    }
    @media(max-width: 899px) {
      width: 90%;
      top: 1rem;
    }
    @media (min-width: 1922px) {
      width: 70%;
    }
  `,
)
