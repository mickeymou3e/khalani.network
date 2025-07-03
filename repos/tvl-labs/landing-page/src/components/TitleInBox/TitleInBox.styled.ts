import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(
  ({ theme }) => `
    opacity: 0.9;
    border: 3px solid #ffffff;
    border-radius: 16px;
    position: absolute;
    top: 5rem;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    background: ${theme.palette.secondary.main};
    padding: 6px 20px;
    @media(max-width: 1200px) {
      top: 2rem;
      padding: 4px 20px;
    }
    @media(max-width: 900px) {
      width: 80%;
      padding: 4px;
    }
  `,
)
